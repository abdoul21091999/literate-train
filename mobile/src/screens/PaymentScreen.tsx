import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { initiatePaytechPayment } from "../lib/api";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

type Status = "idle" | "opening" | "checking" | "success" | "failed";

export default function PaymentScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const [status, setStatus] = useState<Status>("idle");
  const refCommand = useRef<string | null>(null);

  async function handlePay() {
    setStatus("opening");
    try {
      const { redirectUrl, ref } = await initiatePaytechPayment(bookingId);
      refCommand.current = ref;

      await WebBrowser.openBrowserAsync(redirectUrl);

      // The passenger closed the in-app browser (paid, cancelled, or
      // backed out) — check whether the IPN webhook already confirmed it.
      setStatus("checking");
      await checkStatus();
    } catch {
      setStatus("failed");
    }
  }

  async function checkStatus() {
    if (!refCommand.current) return;

    const { data } = await supabase
      .from("payments")
      .select("status")
      .eq("provider_ref", refCommand.current)
      .single();

    setStatus(data?.status === "success" ? "success" : "failed");
  }

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => navigation.navigate("Tabs"), 1800);
      return () => clearTimeout(t);
    }
  }, [status, navigation]);

  return (
    <View style={styles.container}>
      {status === "idle" && (
        <>
          <Text style={styles.title}>💳 Paiement</Text>
          <Text style={styles.subtitle}>
            Vous allez être redirigé vers PayTech pour payer par Wave, Orange
            Money, Free Money ou carte bancaire.
          </Text>
          <Pressable style={styles.button} onPress={handlePay}>
            <Text style={styles.buttonText}>Payer avec PayTech</Text>
          </Pressable>
        </>
      )}

      {(status === "opening" || status === "checking") && (
        <>
          <ActivityIndicator color={colors.brand} size="large" />
          <Text style={styles.subtitle}>
            {status === "opening" ? "Ouverture du paiement…" : "Vérification du paiement…"}
          </Text>
        </>
      )}

      {status === "success" && (
        <>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.title}>Paiement confirmé !</Text>
          <Text style={styles.subtitle}>Bon voyage avec SenTrajet.</Text>
        </>
      )}

      {status === "failed" && (
        <>
          <Text style={styles.emoji}>⏳</Text>
          <Text style={styles.title}>Paiement non confirmé</Text>
          <Text style={styles.subtitle}>
            Si vous avez payé, la confirmation peut prendre quelques
            instants — vérifiez votre profil.
          </Text>
          <Pressable style={styles.button} onPress={() => setStatus("idle")}>
            <Text style={styles.buttonText}>Réessayer</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { color: colors.foreground, fontSize: 22, fontWeight: "800", textAlign: "center" },
  subtitle: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: 8, marginBottom: 20 },
  button: { backgroundColor: colors.brand, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24, alignItems: "center" },
  buttonText: { color: colors.brandForeground, fontWeight: "800" },
});
