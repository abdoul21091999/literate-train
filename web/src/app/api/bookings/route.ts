import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/bearer";
import { corsJson, corsPreflight } from "@/lib/cors";
import { computeBookingTotal } from "@/lib/pricing";

// JSON API used by the SenTrajet mobile app to create a booking.
// The web app's /trajets/[id] page uses the createBooking server action
// instead — this route exists so the same booking flow works without
// cookies (Authorization: Bearer <supabase access token>).
export async function POST(req: NextRequest) {
  const { user, supabase } = await getUserFromRequest(req);

  if (!user || !supabase) {
    return corsJson({ error: "unauthorized" }, { status: 401 });
  }

  const { trajetId, seats } = (await req.json()) as {
    trajetId?: string;
    seats?: number;
  };

  if (!trajetId || !seats || seats < 1) {
    return corsJson({ error: "invalid_input" }, { status: 400 });
  }

  const { data: trajet } = await supabase
    .from("trajets")
    .select("price_per_seat, seats_available")
    .eq("id", trajetId)
    .single();

  if (!trajet || seats > trajet.seats_available) {
    return corsJson({ error: "not_enough_seats" }, { status: 409 });
  }

  const { total } = computeBookingTotal(trajet.price_per_seat, seats);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      trajet_id: trajetId,
      passenger_id: user.id,
      seats,
      amount_total: total,
    })
    .select("id")
    .single();

  if (error || !booking) {
    return corsJson({ error: "booking_failed" }, { status: 500 });
  }

  return corsJson({ bookingId: booking.id });
}

export async function OPTIONS() {
  return corsPreflight();
}
