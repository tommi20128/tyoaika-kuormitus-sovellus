// app/(supervisor)/add-employee.tsx
import { useState, useEffect } from "react";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function AddEmployee() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [manager, setManager] = useState<{ uid: string; name: string } | null>(null);
  const [managers, setManagers] = useState<{ uid: string; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  // -------------------------
  // Hae kaikki esimiehet Firestoresta
  // -------------------------
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "supervisor"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(d => ({
          uid: d.id,
          name: `${d.data().firstName || ""} ${d.data().lastName || ""}`
        }));
        setManagers(list);
      } catch (error) {
        console.log("Esimiehiä ei voitu hakea:", error);
      }
    };
    fetchManagers();
  }, []);

  const handleBack = () => {
    router.replace("/(supervisor)/mainpage");
  }

  const handleRegister = async () => {
    if (!email || !password || !title || !firstName || !lastName || !manager) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    try {
      const auth = getAuth();

      // Luo uusi käyttäjä Firebase Authiin
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Lisää käyttäjä Firestoreen
      await setDoc(doc(db, "users", uid), {
        uid,
        firstName,
        lastName,
        email,
        password,           // HUOM: pelkästään testauksessa
        title,
        manager: manager.name,
        managerId: manager.uid,
        role: "employee",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Onnistui",
        `Käyttäjä ${firstName} ${lastName} luotu onnistuneesti!`,
        [{ text: "OK", onPress: () => handleBack() }]
      );

      // Tyhjennetään kentät
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setTitle("");
      setManager(null);

    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", error.message || "Käyttäjän luonti epäonnistui");
    }
  };

  // -------------------------
  // Render esimies listaa modalissa
  // -------------------------
  const renderManagerItem = ({ item }: { item: { uid: string; name: string } }) => (
    <Pressable
      style={styles.managerItem}
      onPress={() => {
        setManager(item);
        setModalVisible(false);
      }}
    >
      <Text>{item.name}</Text>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Lisää työntekijä</Text>

          <TextInput style={styles.input} placeholder="Etunimi" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Sukunimi" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Sähköposti" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Salasana" value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder="Titteli" value={title} onChangeText={setTitle} />

          {/* Esimiehen valinta */}
          <Pressable
            style={styles.input}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: manager ? "black" : "#888" }}>
              {manager ? manager.name : "Valitse esimies"}
            </Text>
          </Pressable>

          <Button title="Luo käyttäjä" onPress={handleRegister} />
          <View style={{ height: 10 }} />
          <Button title="Peruuta" onPress={handleBack} />

          {/* Modal manager-valikolle */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={managers}
                  keyExtractor={item => item.uid}
                  renderItem={renderManagerItem}
                />
                <Button title="Peruuta" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  }
});