"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function publishTrajet(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/publier");
  }

  const fromCity = String(formData.get("from_city") ?? "");
  const toCity = String(formData.get("to_city") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const pricePerSeat = Number(formData.get("price_per_seat") ?? 0);
  const seatsTotal = Number(formData.get("seats_total") ?? 0);
  const vehicle = String(formData.get("vehicle") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (
    !fromCity ||
    !toCity ||
    fromCity === toCity ||
    !date ||
    !time ||
    pricePerSeat <= 0 ||
    seatsTotal <= 0 ||
    !vehicle
  ) {
    redirect("/publier?erreur=champs");
  }

  const departureAt = new Date(`${date}T${time}:00`).toISOString();

  const { data, error } = await supabase
    .from("trajets")
    .insert({
      driver_id: user.id,
      from_city: fromCity,
      to_city: toCity,
      departure_at: departureAt,
      price_per_seat: pricePerSeat,
      seats_total: seatsTotal,
      seats_available: seatsTotal,
      vehicle,
      notes,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/publier?erreur=serveur");
  }

  redirect(`/trajets/${data.id}?publie=1`);
}
