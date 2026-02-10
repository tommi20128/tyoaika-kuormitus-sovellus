import { View, Text, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function ProfilePage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = () => {
    // Tähän myöhemmin kirjautuminen ulos
    router.replace('/indexe'); // Menee kirjautumissivulle
  };

  const handleChangePassword = () => {
    // Toiminto lisätään myöhemmin
    console.log('Vaihdetaan salasanaa. Vanha:', oldPassword, 'Uusi:', newPassword);
  };

  return (
    <View style={styles.container}>
      {/* Profiilikuva missä ei ole vielä mitään*/}
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />

      {/* Käyttäjätiedot */}
      <Text style={styles.name}>Keijo Käyttäjä</Text>
      <Text style={styles.name}>Titteli: Kuningas johtaja</Text>
      <Text style={styles.email}>keijokayttaja@example.com</Text>

      {/* Salasanan vaihto */}
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
      <Pressable style={styles.changeButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Vaihda salasana</Text>
      </Pressable>

      {/* Kirjaudu ulos -nappi joka ei vielä toimi oikein*/}
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </Pressable>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  changeButton: {
    backgroundColor: '#007AFF', // sininen nappi
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF3B30', // punainen nappi
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
