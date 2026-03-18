// app/index.tsx
import CustomButton from "@/components/ui/CustomButton";
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
  style={{ width: 220, height: 220, marginBottom: 40 }}
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
    padding: 24,
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },

  input: {
    width: "100%",
    height: 52,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
  },

  forgotPassword: {
    marginTop: 10,
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "500",
  },

  button: {
    width: "100%",
    height: 52,
    backgroundColor: "#1E3A8A", 
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000",
  },

  cancelText: {
    marginTop: 18,
    color: "#1E3A8A",
    fontWeight: "500",
  },
});