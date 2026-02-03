import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleBackToLogin = () => {
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröinti!</Text>
      <TextInput
              style={styles.input}
              placeholder="Käyttäjätunnus"
              value={username}
              onChangeText={setUsername}
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
              placeholder="Sähköposti"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
      <Button title="Takaisin kirjautumiseen" onPress={() => handleBackToLogin()} />
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