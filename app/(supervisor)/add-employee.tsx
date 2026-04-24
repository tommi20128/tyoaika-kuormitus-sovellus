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
import { useUsers } from "@/hooks/useUsers";


// -------------------------
// Tyypit
// -------------------------
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

  // Modal (esimiesvalinta)
  const [manager, setManager] = useState<Manager | null>(null);

  // Modal (esimiesvalinta)
  const [modalVisible, setModalVisible] = useState(false);

  // Data ja navigaatio
  const { users: supervisors } = useUsers("supervisors");
  const router = useRouter();

  // Navigointi takaisin
  const handleBack = () => {
    //router.replace("/(supervisor)/manage");
    router.back();
  }

  // -------------------------
  // Form tyhjennys
  // -------------------------
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setTitle("");
    setManager(null);
    setRole("employee");
  };


  // -------------------------
  // Käyttäjän luonti
  // -------------------------
  const handleRegister = async () => {

    // Validointi
    if (!firstName || !lastName || !email || !password || !title) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return false;
    }

    // Employee tarvitsee esimiehen
    if (role === "employee" && !manager) {
      Alert.alert("Virhe", "Valitse esimies työntekijälle");
      return;
    }

    try {
      // -------------------------
      // Luodaan Secondary Firebase app
      // (ettei nykyinen kirjautunut käyttäjä vaihdu)
      // -------------------------
      let secondaryApp = getApps().find(app => app.name === "Secondary");

      if (!secondaryApp) {
        secondaryApp = initializeApp(firebaseConfig, "Secondary");
      }

      const secondaryAuth = getAuth(secondaryApp);

      // -------------------------
      // Luo käyttäjä Firebase Authiin
      // -------------------------
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // -------------------------
      // Tallenna käyttäjä Firestoreen
      // -------------------------
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

      // Tyhjennetään form kentät
      resetForm();

    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", error.message || "Käyttäjän luonti epäonnistui");
    }
  };

  // -------------------------
  // Render: esihenkilö listan item
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

  // -------------------------
  // Render: roolin valinta
  // -------------------------
  const renderRoleSelector = () => (
    <View style={styles.roleContainer}>

      {/* Employee */}
      <Pressable
        style={[
          styles.roleButton,
          role === "employee" && styles.roleSelected,
        ]}
        onPress={() => {
          setRole("employee");
        }}
      >
        <Text style={role === "employee" && styles.activeText}>
          Työntekijä
        </Text>
      </Pressable>

      {/* Supervisor */}
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
        <Text style={role === "supervisor" && styles.activeText}>
        Esihenkilö
        </Text>
      </Pressable>
    </View>
  );

  // -------------------------
  // Render: esimiehen valinta
  // -------------------------
  const renderManagerSelector = () => {
    if (role !== "employee") return null;

    return (
      <Pressable
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "#000"}}>
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

        {/* Perustiedot */}
        <TextInput style={styles.input} placeholder="Etunimi" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Sukunimi" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Sähköposti" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Titteli" value={title} onChangeText={setTitle} />

        {/* Rooli + esimies */}
        {renderRoleSelector()}
        {renderManagerSelector()}

        {/* Toiminnot */}
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Luo käyttäjä</Text>
        </Pressable>

        <View style={{ height: 10 }} />

        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Peruuta</Text>
        </Pressable>


        {/* MODAL: esimiehen valinta */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              {/* Lista esimiehistä */}
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
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
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  }, // Tarviiko muokata?
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
  }, // Näitä arvoja pitää luultavasti vielä muokata
  roleContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  roleSelected: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 42,
    backgroundColor: "#1E3A8A", 
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});