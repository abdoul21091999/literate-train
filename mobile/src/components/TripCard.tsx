import { Pressable, View, Text, StyleSheet } from "react-native";
import type { Trajet } from "../types";
import { colors } from "../theme";
import Avatar from "./Avatar";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function TripCard({
  trajet,
  onPress,
}: {
  trajet: Trajet;
  onPress: () => void;
}) {
  const driver = trajet.driver;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.driverRow}>
          <Avatar avatarUrl={driver?.avatar_url} fullName={driver?.full_name} size={40} />
          <View>
            <Text style={styles.driverName}>
              {driver?.full_name ?? "Conducteur"}
              {driver?.is_verified ? "  ✓" : ""}
            </Text>
            <Text style={styles.meta}>
              ★ {driver?.rating_avg?.toFixed(1) ?? "—"} · {driver?.trips_count ?? 0} trajets
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.price}>
            {trajet.price_per_seat.toLocaleString("fr-FR")}
          </Text>
          <Text style={styles.meta}>FCFA / place</Text>
        </View>
      </View>

      <Text style={styles.route}>
        {trajet.from_city}  →  {trajet.to_city}
      </Text>

      <View style={styles.row}>
        <Text style={styles.meta}>{formatDate(trajet.departure_at)}</Text>
        <Text style={styles.meta}>{trajet.seats_available} place(s)</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  driverRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  driverName: { color: colors.foreground, fontWeight: "700" },
  meta: { color: colors.muted, fontSize: 12 },
  price: { color: colors.brand, fontWeight: "800", fontSize: 18 },
  route: { color: colors.foreground, fontWeight: "700", marginTop: 10, marginBottom: 6 },
});
