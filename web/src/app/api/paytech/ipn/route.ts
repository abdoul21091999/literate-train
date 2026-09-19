import { NextRequest, NextResponse } from "next/server";
import { verifyPaytechIpn } from "@/lib/paytech";
import { createAdminClient } from "@/lib/supabase/admin";

// PayTech posts IPN callbacks as application/x-www-form-urlencoded.
async function readBody(req: NextRequest): Promise<Record<string, string>> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await req.json()) as Record<string, string>;
  }

  const form = await req.formData();
  return Object.fromEntries(
    Array.from(form.entries()).map(([k, v]) => [k, String(v)])
  );
}

export async function POST(req: NextRequest) {
  const payload = await readBody(req);

  const isValid = verifyPaytechIpn({
    hmac_compute: payload.hmac_compute,
    item_price: payload.item_price,
    ref_command: payload.ref_command,
  });

  if (!isValid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("*")
    .eq("provider_ref", payload.ref_command)
    .single();

  if (!payment) {
    return NextResponse.json({ error: "unknown payment" }, { status: 404 });
  }

  const succeeded = payload.type_event === "sale_complete";

  await admin
    .from("payments")
    .update({
      status: succeeded ? "success" : "failed",
      raw_payload: payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  if (succeeded) {
    const { data: booking } = await admin
      .from("bookings")
      .select("id, trajet_id, seats, status")
      .eq("id", payment.booking_id)
      .single();

    if (booking && booking.status === "pending_payment") {
      // Only confirm + decrement seats if enough seats are still available —
      // guards against overselling from two concurrent bookings.
      const { data: trajet } = await admin
        .from("trajets")
        .select("seats_available")
        .eq("id", booking.trajet_id)
        .single();

      if (trajet && trajet.seats_available >= booking.seats) {
        await admin
          .from("trajets")
          .update({ seats_available: trajet.seats_available - booking.seats })
          .eq("id", booking.trajet_id);

        await admin
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", booking.id);
      }
    }
  }

  return NextResponse.json({ success: 1 });
}
