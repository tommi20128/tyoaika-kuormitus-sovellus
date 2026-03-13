// app/(supervisor)/manage.tsx
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../Config";

export default function ManageEmployees() {
  // -------------------------
  // Hae työntekijät hookilla
  // -------------------------
  const { employees, loading } = useEmployeeData();

  const [newEmployeeName, setNewEmployeeName] = useState("");

  // -------------------------
  // Lisää työntekijä navigaatiolla add-employee sivulle
  // -------------------------
  const addEmployee = () => {
    router.push('/(supervisor)/add-employee');
  };

  // -------------------------
  // Poista työntekijä ja hänen kaikki workEntries
  // -------------------------
  const removeEmployee = (id: string) => {
    Alert.alert(
      "Poista työntekijä",
      "Haluatko varmasti poistaa työntekijän ja kaikki hänen tietonsa?",
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              // Poista kaikki työntekijän workEntries
              const workRef = collection(db, "users", id, "workEntries");
              const snapshot = await getDocs(workRef);
              for (const entry of snapshot.docs) {
                await deleteDoc(entry.ref);
              }

              // Poista käyttäjä
              await deleteDoc(doc(db, "users", id));

              Alert.alert("Työntekijä poistettu");

            } catch (error: any) {
              console.log("Delete error:", error);
              Alert.alert("Virhe", error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Ladataan työntekijöitä...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Työntekijähallinta</Text>

      {/* Lisää uusi työntekijä */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Työntekijän nimi"
          value={newEmployeeName}
          onChangeText={setNewEmployeeName}
        />
        <Pressable style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.buttonText}>Lisää</Text>
        </Pressable>
      </View>

      {/* Työntekijälista */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeRow}>
            <View>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.role}>{item.title}</Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => removeEmployee(item.id)}
            >
              <Text style={styles.deleteText}>Poista</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f3ebeb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4efef",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});