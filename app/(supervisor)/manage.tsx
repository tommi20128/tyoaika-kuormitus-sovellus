import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from "react-native";
import { useActionState, useState } from "react";
import { router } from "expo-router";
import { EmployeeData } from '@/types/employees';
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useAuth } from "@/context/AuthContext";

export default function ManageEmployees() {
     const { user, loading: authLoading } = useAuth();

      if (!user) return null;
   const { employees, loading } = useEmployeeData ();
   console.log({employees})
  

 const [newEmployeeName, setNewEmployeeName] = useState("");

  // ➕ Lisää työntekijä
  const addEmployee = () => {
    router.push('/(supervisor)/add-employee');
    /*if (!newEmployeeName.trim()) return;

    const newEmployee = {
      id: Date.now().toString(),
      name: newEmployeeName,
    };

    setEmployees([...employees, newEmployee]);
    setNewEmployeeName("");*/
  };

  // ❌ Poista työntekijä
  const removeEmployee = (id: string) => {
    alert("Tällä hetkellä poistettu mahdollisuus poistaa  henkilöitä. Koodissa poisto on kommentoituna");
    //setEmployees(employees.filter(emp => emp.id !== id));
  };

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
