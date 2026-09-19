import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignup() {
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);

    if (error) {
      setError("Une erreur est survenue, réessayez.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vérifiez votre email ✉️</Text>
        <Text style={styles.subtitle}>
          Nous vous avons envoyé un lien de confirmation. Cliquez dessus puis
          connectez-vous.
        </Text>
        <Pressable style={styles.button} onPress={() => navigation.replace("Login")}>
          <Text style={styles.buttonText}>Aller à la connexion</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>
        Rejoignez SenTrajet pour réserver ou proposer des trajets.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor={colors.muted}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone (+221 77 000 00 00)"
        placeholderTextColor={colors.muted}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.brandForeground} />
        ) : (
          <Text style={styles.buttonText}>Créer mon compte</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Déjà inscrit ? Connectez-vous</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    color: colors.foreground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: colors.brandForeground, fontWeight: "800", fontSize: 15 },
  link: { color: colors.brand, textAlign: "center", marginTop: 20, fontWeight: "600" },
  error: { color: colors.danger, marginBottom: 8, fontSize: 13 },
});
