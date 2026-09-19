import { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { Booking, Trajet, TabScreenProps } from "../types";
import { useAuth } from "../lib/AuthProvider";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";
import AvatarUploader from "../components/AvatarUploader";

type Props = TabScreenProps<"Profile">;

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "En attente de paiement",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  active: "Actif",
  completed: "Terminé",
};

export default function ProfileScreen({ navigation }: Props) {
  const { session, profile, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!session) {
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([
        supabase
          .from("bookings")
          .select("*, trajet:trajets(from_city, to_city, departure_at)")
          .eq("passenger_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("trajets")
          .select("*")
          .eq("driver_id", session.user.id)
          .order("departure_at", { ascending: false }),
      ]).then(([b, t]) => {
        setBookings((b.data as Booking[]) ?? []);
        setTrajets((t.data as Trajet[]) ?? []);
        setLoading(false);
      });
    }, [session])
  );

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (!session || !profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Connectez-vous</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerCard}>
        <AvatarUploader size={56} />
        <View>
          <Text style={styles.name}>
            {profile.full_name}
            {profile.is_verified ? "  ✓" : ""}
          </Text>
          <Text style={styles.muted}>
            ★ {profile.rating_avg.toFixed(1)} ({profile.rating_count}) · {profile.trips_count} trajets
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.logout}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.logoutText}>Déconnexion</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 24 }} />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Mes réservations</Text>
          {bookings.length === 0 && <Text style={styles.muted}>Aucune réservation.</Text>}
          {bookings.map((b) => (
            <Pressable
              key={b.id}
              style={styles.row}
              onPress={() =>
                b.status === "pending_payment"
                  ? navigation.navigate("Payment", { bookingId: b.id })
                  : navigation.navigate("TripDetail", { tripId: b.trajet_id })
              }
            >
              <View>
                <Text style={styles.bold}>
                  {b.trajet?.from_city} → {b.trajet?.to_city}
                </Text>
                <Text style={styles.muted}>
                  {b.seats} place(s) · {b.amount_total.toLocaleString("fr-FR")} FCFA
                </Text>
              </View>
              <Text style={styles.badge}>{STATUS_LABEL[b.status]}</Text>
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Mes trajets publiés</Text>
          {trajets.length === 0 && <Text style={styles.muted}>Aucun trajet publié.</Text>}
          {trajets.map((t) => (
            <Pressable
              key={t.id}
              style={styles.row}
              onPress={() => navigation.navigate("TripDetail", { tripId: t.id })}
            >
              <View>
                <Text style={styles.bold}>
                  {t.from_city} → {t.to_city}
                </Text>
                <Text style={styles.muted}>
                  {t.seats_available}/{t.seats_total} places · {t.price_per_seat.toLocaleString("fr-FR")} FCFA
                </Text>
              </View>
              <Text style={styles.badge}>{STATUS_LABEL[t.status]}</Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  title: { color: colors.foreground, fontSize: 20, fontWeight: "800", marginBottom: 16 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  name: { color: colors.foreground, fontWeight: "800", fontSize: 17 },
  muted: { color: colors.muted, fontSize: 13, marginTop: 2 },
  logout: { alignSelf: "flex-start", marginBottom: 20 },
  logoutText: { color: colors.danger, fontWeight: "700" },
  sectionTitle: { color: colors.foreground, fontWeight: "800", fontSize: 16, marginTop: 12, marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  bold: { color: colors.foreground, fontWeight: "700" },
  badge: {
    color: colors.foreground,
    backgroundColor: colors.surface2,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  button: { backgroundColor: colors.brand, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24 },
  buttonText: { color: colors.brandForeground, fontWeight: "800" },
});
