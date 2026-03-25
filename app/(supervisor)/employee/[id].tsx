// app/(supervisor)/employee/[id].tsx
import { router, useLocalSearchParams } from "expo-router";
import HistoryPage from "@/app/(tabs)/history";
import { Pressable, View, Text, StyleSheet } from "react-native";

export default function EmployeeHistoryWrapper() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Välitetään employeeId propsina HistoryPage:lle
  return (
  <View style={{ flex: 1 }}>
      <HistoryPage employeeId={id} />

      <Pressable
        onPress={() => router.back()}
        style={{ padding: 16, alignItems: "center" }}
      >
        <Text style={styles.takaisin}>Takaisin</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  takaisin:{
    marginBottom: 12,
  }
})