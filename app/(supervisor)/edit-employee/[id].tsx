// app/(supervisor)/edit-employee/[id].tsx

import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/Config";
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { useSupervisors } from "@/hooks/useSupervisorData";

type Role = "employee" | "supervisor";

type Manager = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function EditEmployee() {
  const { id } = useLocalSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [manager, setManager] = useState<Manager | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { supervisors } = useSupervisors();

  // -------------------------
  // Hae käyttäjä
  // -------------------------
  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, "users", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setTitle(data.title || "");
        setRole(data.role || "employee");

        // 🔥 Hae manager olio
        if (data.managerId) {
          const managerRef = doc(db, "users", data.managerId);
          const managerSnap = await getDoc(managerRef);

          if (managerSnap.exists()) {
            const mData = managerSnap.data();
            setManager({
              id: managerSnap.id,
              firstName: mData.firstName || "",
              lastName: mData.lastName || "",
            });
          }
        }
      }
    };

    fetchUser();
  }, [id]);

  // -------------------------
  // Tallenna muutokset
  // -------------------------
  const handleSave = async () => {
    if (!firstName || !lastName || !email || !title) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    if (role === "employee" && !manager) {
      Alert.alert("Virhe", "Valitse esimies");
      return;
    }

    try {
      const ref = doc(db, "users", id as string);

      await updateDoc(ref, {
        firstName,
        lastName,
        email,
        title,
        role,
        manager: role === "employee"
          ? `${manager?.firstName} ${manager?.lastName}`
          : null,
       managerId: role === "employee" && manager
  ? manager.id
  : null,
      });

      Alert.alert("Tallennettu");
      router.back();

    } catch (error) {
      console.log(error);
      Alert.alert("Virhe tallennuksessa");
    }
  };

  // -------------------------
  // UI
  // -------------------------

  const renderManagerItem = ({ item }: { item: Manager }) => (
    <Pressable
      style={styles.managerItem}
      onPress={() => {
        setManager(item);
        setModalVisible(false);
      }}
    >
      <Text>{item.firstName} {item.lastName}</Text>
    </Pressable>
  );

  const renderRoleSelector = () => (
    <View style={styles.roleContainer}>
      <Pressable
        style={[styles.roleButton, role === "employee" && styles.selected]}
        onPress={() => setRole("employee")}
      >
        <Text>Employee</Text>
      </Pressable>

      <Pressable
        style={[styles.roleButton, role === "supervisor" && styles.selected]}
        onPress={() => {
          setRole("supervisor");
          setManager(null);
        }}
      >
        <Text>Supervisor</Text>
      </Pressable>
    </View>
  );

  const renderManagerSelector = () => {
    if (role !== "employee") return null;

    return (
      <Pressable
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: manager ? "#000" : "#888" }}>
          {manager
            ? `${manager.firstName} ${manager.lastName}`
            : "Valitse esimies"}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muokkaa työntekijää</Text>

      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Etunimi" />
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Sukunimi" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Sähköposti" />
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titteli" />

      {renderRoleSelector()}
      {renderManagerSelector()}

      <Button title="Tallenna muutokset" onPress={handleSave} />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={supervisors}
              keyExtractor={(item) => item.id}
              renderItem={renderManagerItem}
            />
            <Button title="Peruuta" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// -------------------------
// STYLES
// -------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },

  selected: {
    backgroundColor: "#1E3A8A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },

  managerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});