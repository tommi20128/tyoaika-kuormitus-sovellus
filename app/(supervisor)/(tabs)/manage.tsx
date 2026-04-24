// app/(supervisor)/(tabs)/manage.tsx
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { act, useState } from "react";
import { router } from "expo-router";
import { useUsers } from "@/hooks/useUsers";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../Config";

export default function ManageEmployees() {
  // toggle tila
  const [mode, setMode] = useState<"mine" | "all">("mine");

  // uusi hook
  const { users: employees, loading } = useUsers(mode);

  const addEmployee = () => {
    router.push("/(supervisor)/add-employee");
  };

  const editEmployee = (id: string) => {
    router.push(`/(supervisor)/edit-employee/${id}`);
  };

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
              const workRef = collection(db, "users", id, "workEntries");
              const snapshot = await getDocs(workRef);

              for (const entry of snapshot.docs) {
                await deleteDoc(entry.ref);
              }

              await deleteDoc(doc(db, "users", id));

              Alert.alert("Työntekijä poistettu");
            } catch (error: any) {
              Alert.alert("Virhe", error.message);
            }
          },
        },
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

      {/* 🔄 Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable
          style={[styles.toggleButton, mode === "mine" && styles.active]}
          onPress={() => setMode("mine")}
        >
          <Text style={mode === "mine" && styles.activeText}>
            Omat alaiset
            </Text>
        </Pressable>

        <Pressable
          style={[styles.toggleButton, mode === "all" && styles.active]}
          onPress={() => setMode("all")}
        >
          <Text style={mode === "all" && styles.activeText}>
            Kaikki
            </Text>
        </Pressable>
      </View>

      {/* ➕ Lisää */}
      <View style={styles.addContainer}>
        <Pressable style={styles.addButton} onPress={addEmployee}>
          <Text style={styles.buttonText}>Lisää uusi työntekijä</Text>
        </Pressable>
      </View>

      {/* 📋 Lista */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeRow}>
            <View>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.role}>{item.title}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={styles.editButton}
                onPress={() => editEmployee(item.id)}
              >
                <Text style={styles.editText}>Muokkaa</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => removeEmployee(item.id)}
              >
                <Text style={styles.deleteText}>Poista</Text>
              </Pressable>
            </View>
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
    fontSize: 26,
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
    paddingHorizontal: 16,
    marginBottom: 16,
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
    fontSize: 16,
    color: "#1E3A8A",
    marginTop: 8,
  },

  deleteButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  deleteText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,

  },
  editText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  toggleButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },

  active: {
    backgroundColor: "#1E3A8A",
  },
  activeText: {
    color: "#fff",
  },
});