// app/(supervisor)/manage.tsx
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import { doc, deleteDoc, collection, getDocs, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../Config";

export default function ManageEmployees() {
  const { user } = useAuth();
  const { employees: fetchedEmployees } = useEmployeeData();

  const [employees, setEmployees] = useState<any[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");

  // Päivitä local state, kun hookista tulee uutta dataa
  useEffect(() => {

    const q = query(
      collection(db, "users"),
      where("role", "==", "employee")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const employeeList: any[] = [];

      snapshot.forEach((doc) => {
        employeeList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setEmployees(employeeList);

    });

    return () => unsubscribe();

  }, []);

  // Lisää työntekijä
  const addEmployee = () => {
    router.push('/(supervisor)/add-employee');
  };

  // Poista työntekijä
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
              // hae kaikki workEntries
              const workRef = collection(db, "users", id, "workEntries");
              const snapshot = await getDocs(workRef);

              // poista kaikki workEntries
              for (const entry of snapshot.docs) {
                await deleteDoc(entry.ref);
              }

              // poista käyttäjä
              await deleteDoc(doc(db, "users", id));

              Alert.alert("Työntekijä poistettu");

              // Päivitä local state heti, jotta työntekijä katoaa listalta
              setEmployees(prev => prev.filter(emp => emp.id !== id));

            } catch (error: any) {
              console.log("Delete error:", error);
              Alert.alert("Virhe", error.message);
            }
          }
        }
      ]
    );
  };

  if (!user) return null;

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
            <Text>{item.firstName} {item.lastName}</Text>
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