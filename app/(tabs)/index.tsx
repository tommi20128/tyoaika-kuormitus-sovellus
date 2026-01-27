// app/index.tsx
import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';

export default function IndexPage() {
  const handleRegister = () => {
    Alert.alert('Rekisteröinti', 'Siirrytään rekisteröitymiseen');
  };

  const handleLogin = () => {
    Alert.alert('Kirjautuminen', 'Siirrytään kirjautumiseen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa sovellukseemme!</Text>
      <CustomButton title="Rekisteröidy" onPress={handleRegister} />
      <CustomButton title="Kirjaudu sisään" onPress={handleLogin} />
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
});
