// app/index.tsx
import CustomButton from "@/components/CustomButton";
import { Image, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Alert, View, StyleSheet, TextInput } from "react-native";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, } from 'firebase/auth';
import { db, doc,  } from "../Config";
import { router } from "expo-router";
import { useState } from "react";
import { getDoc } from "firebase/firestore";
import { Text, Modal, TouchableOpacity } from "react-native";

export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");


  <Image
  source={require("../assets/images/sovellus1.png")}
  style={{ width: 150, height: 150 }}
/>

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Tarkista kentät");
      return;
    }
try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid =userCredential.user.uid

  console.log("kirjaudutaan", {email})

  const docSnap = await getDoc(doc(db, "users", uid));

  if (docSnap.exists()) {
    const userData = docSnap.data();
    const title = userData.title;
    console.log({title})

    if (title === "Esihenkilö") {
      router.replace("/(supervisor)/mainpage");
      
    } else {
      router.replace("/(tabs)/frontpage");
    }
   }else{
    Alert.alert("Virhe", "Käyttäjätietoja ei löytynyt");
   }
}catch (error){
    console.log(error);
    Alert.alert("Väärä sähköposti tai salasana");
  }
  };

  const handlePasswordReset = async () => {
  if (!resetEmail) {
    Alert.alert("Anna sähköpostiosoite");
    return;
  }

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, resetEmail);

    Alert.alert(
      "Sähköposti lähetetty",
      "Palautuslinkki on lähetetty antamaasi sähköpostiosoitteeseen."
    );

    setResetModalVisible(false);
    setResetEmail("");

  } catch (error: any) {
    console.log("Reset error:", error);
    Alert.alert("Virhe", error.message || "Salasanan palautus epäonnistui.");
  }
};

  return (

    <KeyboardAvoidingView
     style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // IOS: siirtää ylös, Android: scrollaa
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
     <Image
  source={require("../assets/images/sovellus1.png")}
  style={{ width: 200, height: 200, marginBottom: 50 }}
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
      <CustomButton title="Kirjaudu sisään" onPress={handleLogin} />
      <TouchableOpacity onPress={() => setResetModalVisible(true)}>
  <Text style={styles.forgotPassword}>
    Unohditko salasanasi?
  </Text>
</TouchableOpacity>
    </View>
    <Modal
  visible={resetModalVisible}
  transparent
  animationType="fade"
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>

      <Text style={styles.modalTitle}>
        Palauta salasana
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Sähköpostiosoite"
        value={resetEmail}
        onChangeText={setResetEmail}
        autoCapitalize="none"
      />

      <CustomButton
        title="Lähetä palautuslinkki"
        onPress={handlePasswordReset}
      />

      <TouchableOpacity onPress={() => setResetModalVisible(false)}>
        <Text style={styles.cancelText}>Peruuta</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "white",
  },
  forgotPassword: {
  marginTop: 15,
  color: "#007AFF",
  fontSize: 14,
},

modalBackground: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
},

modalContainer: {
  width: "80%",
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  alignItems: "center",
},

modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
},

cancelText: {
  marginTop: 15,
  color: "red",
}
});