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
        {/*<TextInput
          style={styles.input}
          placeholder="Työntekijän nimi"
          value={newEmployeeName}
          onChangeText={setNewEmployeeName}
        />*/}
        <Pressable style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.buttonText}>Lisää uusi työntekijä</Text>
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
    padding: 24,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#000000",
  },

  addContainer: {
    marginBottom: 24,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
  },

  addButton: {
    height: 44,
    backgroundColor: "#1E3A8A", // tummansininen
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  employeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  role: {
    fontSize: 14,
    color: "#1E3A8A",
    marginTop: 2,
  },

  deleteButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  deleteText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});