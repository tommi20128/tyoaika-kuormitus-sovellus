import CustomButton from "@/components/CustomButton";
import { Alert, View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db, doc, getDoc } from "../Config"; 
import { router } from "expo-router";
import { useState } from "react";

export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();


const handleLogin = () => { if (email === '' || password === '') 
  { Alert.alert("Tarkista kentät");
    return; } 
    signInWithEmailAndPassword(auth, email, password) 
    .then((userCredential) => { console.log("Kirjautuminen onnistui");
       router.replace('/(tabs)'); })
       .catch((error) => 
        { console.log(error); 
        Alert.alert("Väärä sähköposti tai salasana");
       });
       };


  const handleRegister = () => {
    router.push('/register');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa sovellukseemme!</Text>
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
      <CustomButton title="Kirjaudu sisään" onPress={handleLogin} />
      <CustomButton title="Rekisteröidy" onPress={handleRegister} />

     
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