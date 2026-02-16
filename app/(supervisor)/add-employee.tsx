import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function AddEmployeePage() {
  const handleAddEmployee = () => {
    alert("Tämä on demo, eikä oikeasti lisää työntekijää.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lisää uusi työntekijä</Text>

      <Text style={styles.label}>Nimi</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. Matti Meikäläinen"
      />

      <Text style={styles.label}>Rooli</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. Asentaja"
      />

      <Text style={styles.label}>Sähköposti</Text>
      <TextInput
        style={styles.input}
        placeholder="sahkoposti@esimerkki.fi"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Salasana</Text>
      <TextInput
        style={styles.input}
        placeholder="Kirjoita salasana"
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleAddEmployee}>
        <Text style={styles.buttonText}>Lisää työntekijä</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
