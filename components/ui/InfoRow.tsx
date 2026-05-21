// components/ui/InfoRow.tsx
import { View, Text, StyleSheet } from "react-native";

type InfoRowProps = {
  label: string;
  value: string | number;
};

// Tämä komponentti näyttää yhden rivin tietoa, jossa on label ja value. 
// Käytetään InfoCardin sisällä SummaryCardissa, TodayCardissa ja WorkEntryCardissa.

export default function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>
      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: "#000",
    flexShrink: 0,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "right",
    
  },
});
