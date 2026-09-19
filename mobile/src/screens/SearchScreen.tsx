import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { Trajet, TabScreenProps } from "../types";
import { SENEGAL_REGIONS } from "../types";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";
import TripCard from "../components/TripCard";
import CityPickerModal from "../components/CityPickerModal";

type Props = TabScreenProps<"Search">;

export default function SearchScreen({ navigation }: Props) {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerFor, setPickerFor] = useState<"from" | "to" | null>(null);

  const search = useCallback(async (fromCity: string | null, toCity: string | null) => {
    setLoading(true);
    let query = supabase
      .from("trajets")
      .select("*, driver:profiles(*)")
      .eq("status", "active")
      .gt("seats_available", 0)
      .gte("departure_at", new Date().toISOString())
      .order("departure_at", { ascending: true })
      .limit(30);

    if (fromCity) query = query.eq("from_city", fromCity);
    if (toCity) query = query.eq("to_city", toCity);

    const { data } = await query;
    setTrajets((data as Trajet[]) ?? []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      search(from, to);
      // Only re-run when the screen regains focus or filters change explicitly
      // via the Rechercher button — not on every keystroke.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          La manière la plus simple de traverser le Sénégal 🇸🇳
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.label}>De</Text>
        <Pressable style={styles.select} onPress={() => setPickerFor("from")}>
          <Text style={from ? styles.selectText : styles.selectPlaceholder}>
            {from ?? "Ville de départ"}
          </Text>
        </Pressable>

        <Text style={styles.label}>À</Text>
        <Pressable style={styles.select} onPress={() => setPickerFor("to")}>
          <Text style={to ? styles.selectText : styles.selectPlaceholder}>
            {to ?? "Destination"}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => search(from, to)}>
          <Text style={styles.buttonText}>🔍 Rechercher des trajets</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        {loading ? "Recherche…" : `${trajets.length} trajet(s) disponible(s)`}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={trajets}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TripCard
              trajet={item}
              onPress={() => navigation.navigate("TripDetail", { tripId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aucun trajet pour le moment. Revenez bientôt !
            </Text>
          }
        />
      )}

      <CityPickerModal
        visible={pickerFor !== null}
        cities={SENEGAL_REGIONS}
        onSelect={(city) => {
          if (pickerFor === "from") setFrom(city);
          if (pickerFor === "to") setTo(city);
          setPickerFor(null);
        }}
        onClose={() => setPickerFor(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
  },
  heroTitle: { color: colors.foreground, fontSize: 18, fontWeight: "800", textAlign: "center" },
  searchBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  label: { color: colors.muted, fontSize: 12, marginBottom: 4, marginTop: 8 },
  select: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectText: { color: colors.foreground },
  selectPlaceholder: { color: colors.muted },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: colors.brandForeground, fontWeight: "800" },
  sectionTitle: { color: colors.foreground, fontWeight: "700", marginBottom: 10 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 24 },
});
