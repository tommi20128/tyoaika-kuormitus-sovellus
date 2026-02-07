import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { db, collection, addDoc, serverTimestamp } from "../Config"; 
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function Register() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/");
  }

  const handleRegister = async () => {
    if (!email || !password || !title) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        email: email,
        password: password, 
        title: title,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Onnistui", "Käyttäjä luotu");
      router.push("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Virhe", "Käyttäjän luonti epäonnistui");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröinti</Text>

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

      <Button title="Luo käyttäjä" onPress={handleRegister} />
      <Button title="Takaisin kirjautumiseen" onPress={handleBackToLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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