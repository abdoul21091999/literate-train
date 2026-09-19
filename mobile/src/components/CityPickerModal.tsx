import { Modal, View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function CityPickerModal({
  visible,
  cities,
  onSelect,
  onClose,
}: {
  visible: boolean;
  cities: readonly string[];
  onSelect: (city: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Choisir une ville</Text>
        <FlatList
          data={cities}
          keyExtractor={(c) => c}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => onSelect(item)}>
              <Text style={styles.rowText}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.foreground, fontWeight: "800", fontSize: 16, marginBottom: 12 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { color: colors.foreground, fontSize: 15 },
});
