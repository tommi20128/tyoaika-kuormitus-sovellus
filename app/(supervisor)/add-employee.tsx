// app/(supervisor)/add-employee.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { db, doc, setDoc, serverTimestamp } from "../../Config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function AddEmployee() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [manager, setManager] = useState("");

  const router = useRouter();

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

      // Lisää käyttäjä Firestoreen ilman että esihenkilö kirjautuu ulos
      await setDoc(doc(db, "users", uid), {
        uid,
        firstName,
        lastName,
        email,
        password,           // HUOM: Tämä on pelkästään testausta varten ja poistetaan tuotantoversiosta
        title,              // työntekijän titteli
        manager,            // Esihenkilön nimi, joka on vastuussa tästä työntekijästä
        role: "employee",   // työntekijä
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Onnistui",
        "Työntekijä luotu onnistuneesti",
        [{ text: "OK", onPress: () => handleBack() }]
      );

      // Tyhjennetään kentät, jotta esihenkilö voi lisätä seuraavan
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setTitle("");
      setManager("");

    } catch (error: any) {
      console.error(error);
      Alert.alert("Virhe", error.message || "Käyttäjän luonti epäonnistui");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Lisää työntekijä</Text>

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
          <View style={{ height: 10 }} />
          <Button title="Peruuta" onPress={handleBack} />
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
    backgroundColor: 'white',
  },
});