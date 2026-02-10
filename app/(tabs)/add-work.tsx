import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function AddWorkPage() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} //IOS: siirtää sisältöä ylös, Android: ei vaikutusta
    > 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Lisää työaika</Text>

        <Text style={styles.label}>Työaika (tunnit)</Text> 
        <TextInput
          style={styles.input}
          placeholder="Esim. 7.5"
          keyboardType="numeric"
        />

        <Text style={styles.label}>
          Kuinka kuormittavana koit tämän työpäivän? (1–10)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="1 = kevyt, 10 = erittäin kuormittava"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Kysymys 2 (1–10)</Text>
        <TextInput
          style={styles.input}
          placeholder="1 = kevyt, 10 = erittäin kuormittava"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Kysymys 3 (1–10)</Text>
        <TextInput
          style={styles.input}
          placeholder="1 = kevyt, 10 = erittäin kuormittava"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Kommentti</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Vapaa kommentti työpäivästä"
          multiline
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Tallenna</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // ← lisää tilaa, jotta nappi ei jää tabBarin alle
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
