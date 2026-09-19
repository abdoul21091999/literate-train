import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function Avatar({
  avatarUrl,
  fullName,
  size = 40,
}: {
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: number;
}) {
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={dimensions} />;
  }

  return (
    <View style={[styles.fallback, dimensions]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
        {fullName?.[0]?.toUpperCase() ?? "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: colors.foreground, fontWeight: "800" },
});
