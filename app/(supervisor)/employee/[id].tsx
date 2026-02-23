import { ScrollView, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { mockEmployees } from "../../../data/mockEmployees";
import InfoCard from "@/components/InfoCard";
import InfoRow from "@/components/InfoRow";

export default function EmployeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const employee = mockEmployees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Työntekijää ei löytynyt.</Text>
      </ScrollView>
    );
  }

  const weekBalance = employee.weekHours - employee.weekGoal;
  const monthBalance = employee.monthHours - employee.monthGoal;
  const totalBalance = employee.totalWorked - employee.totalRequired;

  const handleBack = () => {
    router.push('/(supervisor)/mainpage'); // Vie takaisin esimiehen etusivulle
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <InfoCard>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.role}>{employee.role}</Text>
      </InfoCard>

      <InfoCard title="Viikko">
        <InfoRow
          label="Työtunnit"
          value={`${employee.weekHours} / ${employee.weekGoal}`}
        />
        <InfoRow
          label="Tuntisaldo"
          value={`${weekBalance >= 0 ? "+" : ""}${weekBalance} h`}
        />
        <InfoRow
          label="Kuormitus"
          value={`${employee.weekLoad} / 10`}
        />
      </InfoCard>

      <InfoCard title="Kuukausi">
        <InfoRow
          label="Työtunnit"
          value={`${employee.monthHours} / ${employee.monthGoal}`}
        />
        <InfoRow
          label="Tuntisaldo"
          value={`${monthBalance >= 0 ? "+" : ""}${monthBalance} h`}
        />
        <InfoRow
          label="Kuormitus"
          value={`${employee.monthLoad} / 10`}
        />
      </InfoCard>

      <InfoCard title="Kokonaissaldo">
        <InfoRow
          label="Kokonaisero"
          value={`${totalBalance >= 0 ? "+" : ""}${totalBalance} h`}
        />
      </InfoCard>

      {/* Takaisin-nappi */}
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Takaisin</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  role: {
    fontSize: 16,
    color: "#666666",
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
  },
   backButton: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
