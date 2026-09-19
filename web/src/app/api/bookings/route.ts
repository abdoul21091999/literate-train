import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/bearer";

// JSON API used by the SenTrajet mobile app to create a booking.
// The web app's /trajets/[id] page uses the createBooking server action
// instead — this route exists so the same booking flow works without
// cookies (Authorization: Bearer <supabase access token>).
export async function POST(req: NextRequest) {
  const { user, supabase } = await getUserFromRequest(req);

  if (!user || !supabase) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { trajetId, seats } = (await req.json()) as {
    trajetId?: string;
    seats?: number;
  };

  if (!trajetId || !seats || seats < 1) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { data: trajet } = await supabase
    .from("trajets")
    .select("price_per_seat, seats_available")
    .eq("id", trajetId)
    .single();

  if (!trajet || seats > trajet.seats_available) {
    return NextResponse.json({ error: "not_enough_seats" }, { status: 409 });
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      trajet_id: trajetId,
      passenger_id: user.id,
      seats,
      amount_total: seats * trajet.price_per_seat,
    })
    .select("id")
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "booking_failed" }, { status: 500 });
  }

  return NextResponse.json({ bookingId: booking.id });
}
