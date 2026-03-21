// app/(supervisor)/add-employee.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
  Modal,
  FlatList
} from "react-native";
import { db, doc, setDoc, serverTimestamp } from "../../Config";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/Config";
import { useRouter } from "expo-router";
import { useSupervisors } from "@/hooks/useSupervisorData";

type Role = "employee" | "supervisor";

type Manager = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function AddEmployee() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [manager, setManager] = useState<Manager | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { supervisors } = useSupervisors();
  const router = useRouter();

  const handleBack = () => {
    router.replace("/(supervisor)/mainpage");
  }

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setTitle("");
    setManager(null);
    setRole("employee");
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !title) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return false;
    }

    if (role === "employee" && !manager) {
      Alert.alert("Virhe", "Valitse esimies työntekijälle");
      return;
    }

    try {
      // Vältetään duplicate Firebase app
      let secondaryApp = getApps().find(app => app.name === "Secondary");

      if (!secondaryApp) {
        secondaryApp = initializeApp(firebaseConfig, "Secondary");
      }

      const secondaryAuth = getAuth(secondaryApp);

      // Luodaan käyttäjä ilman että pää-auth vaihtuu
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // Lisää käyttäjä Firestoreen
      await setDoc(doc(db, "users", uid), {
        uid,
        firstName,
        lastName,
        email,
        password,           // HUOM: pelkästään testauksessa
        title,
        role,               // supervisor tai employee
        manager: role === "employee" ? manager?.firstName + " " + manager?.lastName : null,
        managerId: role === "employee" ? manager?.id : null,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Onnistui",
        `Käyttäjä ${firstName} ${lastName} luotu!`,
        [{ text: "OK", onPress: () => handleBack() }]
      );

      // Kirjaudu ulos Secondary authista
      await secondaryAuth.signOut();

      // Tyhjennetään kentät
      resetForm();

    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", error.message || "Käyttäjän luonti epäonnistui");
    }
  };

  // -------------------------
  // Render esimies listaa modalissa
  // -------------------------
  const renderManagerItem = ({ item }: { item: any }) => (
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
        style={[
          styles.roleButton,
          role === "employee" && styles.roleSelected,
        ]}
        onPress={() => {
          setRole("employee");
        }}
      >
        <Text>Employee</Text>
      </Pressable>

      <Pressable
        style={[
          styles.roleButton,
          role === "supervisor" && styles.roleSelected,
        ]}
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
          {manager ? `${manager.firstName} ${manager.lastName}` : "Valitse esimies"}
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
        <Text style={styles.title}>Lisää työntekijä</Text>

        <TextInput style={styles.input} placeholder="Etunimi" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Sukunimi" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Sähköposti" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Titteli" value={title} onChangeText={setTitle} />

        {renderRoleSelector()}
        {renderManagerSelector()}

        <Button title="Luo käyttäjä" onPress={handleRegister} />
        <View style={{ height: 10 }} />
        <Button title="Peruuta" onPress={handleBack} />

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    justifyContent: 'center',
  }, // Tarviiko muokata?
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  managerItem: {
    padding: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  }, // Näitä arvoja pitää luultavasti vielä muokata
  roleContainer: {
    flexDirection: "row",
    width: "100%",
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
  roleSelected: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
    color: "#fff",
  },
});