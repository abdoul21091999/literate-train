import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";

const apiBaseUrl = (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? "";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(
        error.message.includes("Email not confirmed")
          ? "Confirmez d'abord votre email (lien envoyé à l'inscription)."
          : "Email ou mot de passe incorrect."
      );
      return;
    }
    navigation.replace("Tabs");
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Email requis", "Entrez votre email ci-dessus d'abord.");
      return;
    }
    if (!apiBaseUrl) {
      Alert.alert("Erreur", "Configuration manquante, réessayez plus tard.");
      return;
    }

    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${apiBaseUrl}/reinitialiser-mot-de-passe`,
    });
    setResetting(false);

    Alert.alert(
      "Vérifiez votre email",
      error
        ? "Une erreur est survenue, réessayez."
        : "Si un compte existe pour cet email, un lien de réinitialisation vient de lui être envoyé."
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>Accédez à votre compte SenTrajet.</Text>

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

      <Pressable onPress={handleForgotPassword} disabled={resetting}>
        <Text style={styles.forgotLink}>
          {resetting ? "Envoi…" : "Mot de passe oublié ?"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.brandForeground} />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Pas encore de compte ? Inscrivez-vous</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, justifyContent: "center" },
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
  forgotLink: { color: colors.muted, textAlign: "right", marginBottom: 4, fontSize: 13, fontWeight: "600" },
  error: { color: colors.danger, marginBottom: 8, fontSize: 13 },
});
