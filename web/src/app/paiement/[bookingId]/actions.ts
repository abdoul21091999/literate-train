"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestPaytechPayment } from "@/lib/paytech";

export async function startPayment(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/paiement/${bookingId}`);
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, trajet:trajets(from_city, to_city)")
    .eq("id", bookingId)
    .eq("passenger_id", user.id)
    .single();

  if (!booking || booking.status !== "pending_payment") {
    redirect(`/paiement/${bookingId}?erreur=introuvable`);
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
  } catch (err) {
    console.error("startPayment: PayTech request failed:", err);
    redirect(`/paiement/${bookingId}?erreur=paytech`);
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

  redirect(paytech.redirect_url ?? paytech.redirectUrl);
}
