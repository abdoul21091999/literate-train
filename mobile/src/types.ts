import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

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
  trajet?: Pick<Trajet, "from_city" | "to_city" | "departure_at">;
};

export const SENEGAL_REGIONS = [
  "Dakar",
  "Thiès",
  "Diourbel",
  "Touba",
  "Fatick",
  "Kaolack",
  "Kaffrine",
  "Kédougou",
  "Kolda",
  "Louga",
  "Matam",
  "Saint-Louis",
  "Sédhiou",
  "Tambacounda",
  "Ziguinchor",
] as const;

export type RootStackParamList = {
  Tabs: undefined;
  Login: undefined;
  Signup: undefined;
  TripDetail: { tripId: string };
  Payment: { bookingId: string };
};

export type TabsParamList = {
  Search: undefined;
  Publish: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof TabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
