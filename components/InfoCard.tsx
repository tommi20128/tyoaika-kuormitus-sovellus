// components/InfoCard.tsx
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

type InfoCardProps = {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
};

// Tämä on yleinen korttikomponentti, jota käytetään TodayCardissa, SummaryCardissa ja WorkEntryCardissa. Se hoitaa korttien ulkoasun ja otsikon näyttämisen.

export default function InfoCard({
  title,
  children,
  style,
}: InfoCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  content: {
    marginTop: 4,
  },
});
