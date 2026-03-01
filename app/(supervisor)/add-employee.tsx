import { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { db, doc, setDoc, serverTimestamp } from "../../Config";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function Register() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); ""
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [manager, setManager] = useState("");

  const router = useRouter();

  const handleBackToLogin = () => {
    router.replace("/(supervisor)/mainpage");
  }
  const handleRegister = async () => {
    if (!email || !password || !title || !firstName || !lastName || !manager) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }
    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        firstName,
        lastName,
        email,
        password,
        title,
        manager,
        createdAt: serverTimestamp(),
      });
      Alert.alert(
        "",
        "Käyttäjä luotu",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(supervisor)/mainpage");
            },
          },
        ]
      );

    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", error.message || "Käyttäjän luonti epäonnistui");
    }
  };

  return (
    <KeyboardAvoidingView
     >
    <ScrollView >
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröinti</Text>
      <TextInput
        style={styles.input}
        placeholder="Etunimi"
        value={firstName}
        onChangeText={setFirstName}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Sukunimi"
        value={lastName}
        onChangeText={setLastName}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Titteli"
        value={title}
        onChangeText={setTitle}
      />
            <TextInput
        style={styles.input}
        placeholder="Esihenkilö"
        value={manager}
        onChangeText={setManager}
      />
      <Button title="Luo käyttäjä" onPress={handleRegister} />
      <Button title="Peruuta" onPress={handleBackToLogin} />
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'white',
  },
});