import CustomButton from "@/components/CustomButton";
import { Alert, View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from "expo-router";
import { useState } from "react";

export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [error, setError] = useState(null);
  const auth = getAuth();

 /* const handleLogin = () => {
    router.replace('/(tabs)');
  };*/

const handleLogin = () => {
  if (email === '' || password === '') {
    console.log(Error)
    Alert.alert("Tarkista kentät");
  } else {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        router.replace('/(tabs)');
        console.log("Kirjautuminen onnistui")

        if (!setEmail) {
          console.log("Error")
          Alert.alert("Väärä sähköposti tai salasana");
          return;
        }
      });
  }
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