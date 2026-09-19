"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBooking(trajetId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/trajets/${trajetId}`);
  }

  const seats = Number(formData.get("seats") ?? 1);

  const { data: trajet, error: trajetError } = await supabase
    .from("trajets")
    .select("price_per_seat, seats_available")
    .eq("id", trajetId)
    .single();

  if (trajetError || !trajet || seats < 1 || seats > trajet.seats_available) {
    redirect(`/trajets/${trajetId}?erreur=places`);
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      trajet_id: trajetId,
      passenger_id: user.id,
      seats,
      amount_total: seats * trajet.price_per_seat,
    })
    .select("id")
    .single();

  if (bookingError || !booking) {
    redirect(`/trajets/${trajetId}?erreur=reservation`);
  }

  redirect(`/paiement/${booking.id}`);
}
