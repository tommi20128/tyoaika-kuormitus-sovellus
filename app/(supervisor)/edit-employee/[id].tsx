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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useUsers } from "@/hooks/useUsers";

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

  const { users } = useUsers("all");

  const supervisors = users.filter(
    (u) => u.role === "supervisor"
  );

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

        // Hae manager olio
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
        <Text style={role === "employee" && styles.activeText}>
          Työntekijä
        </Text>
      </Pressable>

      <Pressable
        style={[styles.roleButton, role === "supervisor" && styles.selected]}
        onPress={() => {
          setRole("supervisor");
          setManager(null);
        }}
      >
        <Text style={role === "supervisor" && styles.activeText}>
          Esihenkilö
        </Text>
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
        <Text style={{ color: "#000" }}>
          {manager
            ? `${manager.firstName} ${manager.lastName}`
            : "Valitse esimies"}
        </Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Muokkaa {firstName} {lastName}</Text>

        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Etunimi" />
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Sukunimi" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Sähköposti" />
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titteli" />

        {renderRoleSelector()}
        {renderManagerSelector()}

        <Button title="Tallenna muutokset" onPress={handleSave} />
        <View style={{ height: 10 }} />
        <Button title="Peruuta" onPress={() => router.back()} />

        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={supervisors}
                keyExtractor={(item) => item.id}
                renderItem={renderManagerItem}
              />

              {/* viiva viimeisen nimen jälkeen*/}
              <View style={styles.divider} />

              <Button title="Peruuta" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// -------------------------
// STYLES
// -------------------------

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },

  input: {
    width: '100%',
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
    justifyContent: 'center',
  },

  roleContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,

  },

  roleButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#D1D5DB",

    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
  },

  selected: {
    backgroundColor: "#1E3A8A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 24,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },

  managerItem: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  activeText: {
    color: "#fff",
  },
});