// components/PasswordChange.tsx
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';

// Komponentti salasanan vaihtamiseen profiilisivulla

export const PasswordChange = () => {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Täytä kaikki kentät');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Uudet salasanat eivät täsmää');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user?.email || '',
        oldPassword
      );

      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, newPassword);

      Alert.alert('Salasana vaihdettu onnistuneesti');

      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      Alert.alert('Virhe', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vanha salasana"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Uusi salasana"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Toista uusi salasana"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>
          Vaihda salasana
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 42,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#000000",
  },
  button:{
    width: "100%",
    height: 42,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,

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
});