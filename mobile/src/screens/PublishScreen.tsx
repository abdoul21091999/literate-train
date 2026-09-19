import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { TabScreenProps } from "../types";
import { SENEGAL_REGIONS } from "../types";
import { useAuth } from "../lib/AuthProvider";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";
import CityPickerModal from "../components/CityPickerModal";

type Props = TabScreenProps<"Publish">;

export default function PublishScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [date, setDate] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("4");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [pickerFor, setPickerFor] = useState<"from" | "to" | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Connectez-vous</Text>
        <Text style={styles.subtitle}>
          Vous devez avoir un compte pour publier un trajet.
        </Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </Pressable>
      </View>
    );
  }

  async function handlePublish() {
    if (!from || !to || from === to || !price || !seats || !vehicle.trim()) {
      Alert.alert(
        "Champs manquants",
        "Merci de remplir tous les champs (villes différentes, véhicule requis)."
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("trajets")
      .insert({
        driver_id: session!.user.id,
        from_city: from,
        to_city: to,
        departure_at: date.toISOString(),
        price_per_seat: Number(price),
        seats_total: Number(seats),
        seats_available: Number(seats),
        vehicle: vehicle.trim(),
        notes: notes.trim() || null,
      })
      .select("id")
      .single();
    setLoading(false);

    if (error || !data) {
      Alert.alert("Erreur", "Impossible de publier le trajet, réessayez.");
      return;
    }

    setFrom(null);
    setTo(null);
    setPrice("");
    setVehicle("");
    setNotes("");
    navigation.navigate("TripDetail", { tripId: data.id });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>➕ Publier un trajet</Text>
      <Text style={styles.subtitle}>
        Proposez des places libres dans votre véhicule.
      </Text>

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

      <Text style={styles.label}>Date et heure de départ</Text>
      <Pressable style={styles.select} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.selectText}>
          {new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(date)}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          minimumDate={new Date()}
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <Text style={styles.label}>Prix par place (FCFA)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="5000"
        placeholderTextColor={colors.muted}
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Places disponibles</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="4"
        placeholderTextColor={colors.muted}
        value={seats}
        onChangeText={setSeats}
      />

      <Text style={styles.label}>Véhicule</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Toyota Corolla grise"
        placeholderTextColor={colors.muted}
        value={vehicle}
        onChangeText={setVehicle}
      />

      <Text style={styles.label}>Notes (optionnel)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Point de rendez-vous, bagages autorisés…"
        placeholderTextColor={colors.muted}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <Pressable style={styles.button} onPress={handlePublish} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.brandForeground} />
        ) : (
          <Text style={styles.buttonText}>Publier le trajet</Text>
        )}
      </Pressable>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 16, textAlign: "center" },
  label: { color: colors.muted, fontSize: 12, marginBottom: 6, marginTop: 12 },
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    color: colors.foreground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: colors.brandForeground, fontWeight: "800" },
});
