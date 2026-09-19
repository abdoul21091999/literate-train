import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/bearer";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestPaytechPayment } from "@/lib/paytech";
import { corsJson, corsPreflight } from "@/lib/cors";

// JSON API used by the SenTrajet mobile app to start a PayTech checkout
// for an existing booking. Mirrors the web app's /paiement/[bookingId]
// server action, but returns a redirect URL instead of doing an HTTP
// redirect (the app opens it in an in-app browser).
export async function POST(req: NextRequest) {
  const { user, supabase } = await getUserFromRequest(req);

  if (!user || !supabase) {
    return corsJson({ error: "unauthorized" }, { status: 401 });
  }

  const { bookingId } = (await req.json()) as { bookingId?: string };
  if (!bookingId) {
    return corsJson({ error: "invalid_input" }, { status: 400 });
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, trajet:trajets(from_city, to_city)")
    .eq("id", bookingId)
    .eq("passenger_id", user.id)
    .single();

  if (!booking || booking.status !== "pending_payment") {
    return corsJson({ error: "not_found" }, { status: 404 });
  }

  const refCommand = `SENTRAJET-${booking.id}-${Date.now()}`;

  let paytech;
  try {
    paytech = await requestPaytechPayment({
      itemName: `Trajet ${booking.trajet.from_city} → ${booking.trajet.to_city}`,
      itemPrice: booking.amount_total,
      refCommand,
      commandName: `Réservation SenTrajet (${booking.seats} place(s))`,
      customField: { booking_id: booking.id },
    });
  } catch {
    return corsJson({ error: "paytech_unavailable" }, { status: 502 });
  }

  const admin = createAdminClient();
  await admin.from("payments").insert({
    booking_id: booking.id,
    provider: "paytech",
    provider_ref: refCommand,
    amount: booking.amount_total,
    currency: "XOF",
    status: "pending",
  });

  return corsJson({
    redirectUrl: paytech.redirect_url ?? paytech.redirectUrl,
    ref: refCommand,
  });
}

export async function OPTIONS() {
  return corsPreflight();
}
