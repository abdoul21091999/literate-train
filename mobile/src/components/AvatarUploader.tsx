import { useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";
import { colors } from "../theme";

const MAX_SIZE = 3 * 1024 * 1024; // 3 MB

export default function AvatarUploader({ size = 64 }: { size?: number }) {
  const { session, profile, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function handlePick() {
    if (!session) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission requise",
        "Autorisez l'accès à vos photos pour changer votre photo de profil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_SIZE) {
      Alert.alert("Image trop lourde", "Choisissez une image de moins de 3 Mo.");
      return;
    }

    setUploading(true);
    try {
      const file = new File(asset.uri);
      const bytes = await file.arrayBuffer();
      const ext = asset.uri.split(".").pop()?.split("?")[0] ?? "jpg";
      const path = `${session.user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, bytes, {
          upsert: true,
          contentType: asset.mimeType ?? "image/jpeg",
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      const bustedUrl = `${publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: bustedUrl })
        .eq("id", session.user.id);
      if (updateError) throw updateError;

      await refreshProfile();
    } catch {
      Alert.alert("Erreur", "Impossible d'envoyer la photo, réessayez.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Pressable
      onPress={handlePick}
      disabled={uploading}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      {profile?.avatar_url ? (
        <Image
          source={{ uri: profile.avatar_url }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
          {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
        </Text>
      )}

      <View style={styles.badge}>
        {uploading ? (
          <ActivityIndicator size="small" color={colors.brandForeground} />
        ) : (
          <Text style={styles.badgeIcon}>📷</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  initial: { color: colors.foreground, fontWeight: "800" },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeIcon: { fontSize: 11 },
});
