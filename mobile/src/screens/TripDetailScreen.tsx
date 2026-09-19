import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, Trajet } from "../types";
import { supabase } from "../lib/supabase";
import { createBooking } from "../lib/api";
import { useAuth } from "../lib/AuthProvider";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "TripDetail">;

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function TripDetailScreen({ route, navigation }: Props) {
  const { tripId } = route.params;
  const { session } = useAuth();
  const [trajet, setTrajet] = useState<Trajet | null>(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    supabase
      .from("trajets")
      .select("*, driver:profiles(*)")
      .eq("id", tripId)
      .single()
      .then(({ data }) => {
        setTrajet(data as Trajet);
        setLoading(false);
      });
  }, [tripId]);

  async function handleBook() {
    if (!session) {
      navigation.navigate("Login");
      return;
    }
    if (!trajet) return;

    setBooking(true);
    try {
      const { bookingId } = await createBooking(trajet.id, seats);
      navigation.navigate("Payment", { bookingId });
    } catch {
      Alert.alert("Erreur", "Impossible de créer la réservation, réessayez.");
    } finally {
      setBooking(false);
    }
  }

  if (loading || !trajet) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  const driver = trajet.driver;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <Text style={styles.route}>
          {trajet.from_city}  →  {trajet.to_city}
        </Text>
        <Text style={styles.muted}>{formatDate(trajet.departure_at)}</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Prix par place</Text>
            <Text style={styles.price}>
              {trajet.price_per_seat.toLocaleString("fr-FR")} FCFA
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Places disponibles</Text>
            <Text style={styles.bold}>
              {trajet.seats_available} / {trajet.seats_total}
            </Text>
          </View>
        </View>

        {trajet.notes ? <Text style={styles.notes}>{trajet.notes}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Conducteur</Text>
        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {driver?.full_name?.[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <View>
            <Text style={styles.bold}>
              {driver?.full_name ?? "Conducteur"}
              {driver?.is_verified ? "  ✓ Vérifié" : ""}
            </Text>
            <Text style={styles.muted}>
              ★ {driver?.rating_avg?.toFixed(1) ?? "—"} · {driver?.trips_count ?? 0} trajets
            </Text>
          </View>
        </View>
      </View>

      {trajet.seats_available > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Réserver</Text>

          <View style={styles.seatRow}>
            <Pressable
              style={styles.seatBtn}
              onPress={() => setSeats((s) => Math.max(1, s - 1))}
            >
              <Text style={styles.seatBtnText}>−</Text>
            </Pressable>
            <Text style={styles.seatCount}>{seats}</Text>
            <Pressable
              style={styles.seatBtn}
              onPress={() => setSeats((s) => Math.min(trajet.seats_available, s + 1))}
            >
              <Text style={styles.seatBtnText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.muted}>Total à payer</Text>
            <Text style={styles.price}>
              {(seats * trajet.price_per_seat).toLocaleString("fr-FR")} FCFA
            </Text>
          </View>

          <Pressable style={styles.button} onPress={handleBook} disabled={booking}>
            {booking ? (
              <ActivityIndicator color={colors.brandForeground} />
            ) : (
              <Text style={styles.buttonText}>Réserver et payer</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <Text style={styles.muted}>Ce trajet est complet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  route: { color: colors.foreground, fontSize: 20, fontWeight: "800" },
  muted: { color: colors.muted, fontSize: 13, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  label: { color: colors.muted, fontSize: 12 },
  price: { color: colors.brand, fontWeight: "800", fontSize: 18 },
  bold: { color: colors.foreground, fontWeight: "700" },
  notes: { color: colors.muted, marginTop: 12, backgroundColor: colors.surface2, padding: 10, borderRadius: 10 },
  sectionTitle: { color: colors.foreground, fontWeight: "800", marginBottom: 10 },
  driverRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.foreground, fontWeight: "800", fontSize: 16 },
  seatRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 14 },
  seatBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  seatBtnText: { color: colors.foreground, fontSize: 20, fontWeight: "800" },
  seatCount: { color: colors.foreground, fontSize: 18, fontWeight: "800", minWidth: 24, textAlign: "center" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.surface2, borderRadius: 10, padding: 12, marginBottom: 14 },
  button: { backgroundColor: colors.brand, borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: colors.brandForeground, fontWeight: "800" },
});
