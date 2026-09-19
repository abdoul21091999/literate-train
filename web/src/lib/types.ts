export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  trips_count: number;
  created_at: string;
};

export type Trajet = {
  id: string;
  driver_id: string;
  from_city: string;
  to_city: string;
  departure_at: string;
  price_per_seat: number;
  seats_total: number;
  seats_available: number;
  vehicle: string | null;
  notes: string | null;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  driver?: Profile;
};

export type Booking = {
  id: string;
  trajet_id: string;
  passenger_id: string;
  seats: number;
  amount_total: number;
  status: "pending_payment" | "confirmed" | "cancelled" | "refunded";
  created_at: string;
  trajet?: Trajet;
};

export type Payment = {
  id: string;
  booking_id: string;
  provider: "paytech" | "cinetpay";
  provider_ref: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
};
