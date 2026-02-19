// app/(tabs)/add-work.tsx
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { WorkEntryFormData } from '@/types/work';

export default function AddWorkPage() {
  const { user, loading } = useAuth();

  // Yhdistetty state kaikille input-kentille
  const [formData, setFormData] = useState<WorkEntryFormData>({
    hours: '',
    minutes: '',
    load1: '',
    stressLoad1: '',
    stressLoad2: '',
    comment: '',
  });

  const todayId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Ladataan päivän kirjaus jos olemassa
  useEffect(() => {
    const fetchTodayEntry = async () => {
      if (!user) return;

      const docRef = doc(db, 'users', user.uid, 'workEntries', todayId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        const totalMinutes = data.totalMinutes || 0;

        setFormData({
          hours: Math.floor(totalMinutes / 60).toString(),
          minutes: (totalMinutes % 60).toString(),
          load1: (data.load1 || '').toString(),
          stressLoad1: (data.stressLoad1 || '').toString(),
          stressLoad2: (data.stressLoad2 || '').toString(),
          comment: data.comment || '',
        });
      }
    };

    fetchTodayEntry();
  }, [user]);

  // Parsitaan numerokentät ja tekstiedot oikeisiin muotoihin tallennusta varten
  const parseInputs = () => {
    return {
      hours: parseInt(formData.hours),
      minutes: parseInt(formData.minutes),
      load1: parseInt(formData.load1),
      stressLoad1: parseInt(formData.stressLoad1),
      stressLoad2: parseInt(formData.stressLoad2),
      comment: formData.comment,
    };
  };

  // Tarkistetaan syötteiden oikeellisuus
  const validateInputs = (data: ReturnType<typeof parseInputs>): string | null => {
    if (
      isNaN(data.hours) ||
      isNaN(data.minutes) ||
      isNaN(data.load1) ||
      isNaN(data.stressLoad1) ||
      isNaN(data.stressLoad2)
    ) return 'Täytä kaikki numerokentät oikein.';
    
    if (data.minutes < 0 || data.minutes > 59) return 'Minuuttien pitää olla välillä 0–59.';
    if (data.load1 < 1 || data.load1 > 10) return 'Kuormitus pitää olla välillä 1–10.';
    if (data.stressLoad1 < 1 || data.stressLoad1 > 10 || data.stressLoad2 < 1 || data.stressLoad2 > 10)
      return 'Stressikuormitus pitää olla välillä 1–10.';

    return null;
  };

  // Tallennetaan Firestoreen
  const saveToFirestore = async (data: ReturnType<typeof parseInputs>) => {
    const totalMinutes = data.hours * 60 + data.minutes;
    const averageStress = (data.stressLoad1 + data.stressLoad2) / 2;

    const docRef = doc(db, 'users', user!.uid, 'workEntries', todayId);

    await setDoc(docRef, {
      totalMinutes,
      load1: data.load1,
      stressLoad1: data.stressLoad1,
      stressLoad2: data.stressLoad2,
      averageStress,
      comment: data.comment,
      date: todayId,
      createdAt: serverTimestamp(),
    });
  };

  // Pääfunktio tallennukselle
  const handleSave = async () => {
    if (!user) return;

    try {
      const parsed = parseInputs();
      const validationError = validateInputs(parsed);
      if (validationError) return Alert.alert('Virhe', validationError);

      await saveToFirestore(parsed);
      Alert.alert('Tallennettu', 'Päivän kirjaus tallennettu.');
    } catch (error) {
      console.error(error);
      Alert.alert('Virhe', 'Tallennus epäonnistui.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // IOS: siirtää ylös, Android: scrollaa
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0} // säädä tarpeen mukaan
    >
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
        > 
        <Text style={styles.title}>Lisää työaika</Text>

        {/* Työaika tunnit ja minuutit */}
        <Text style={styles.label}>Työaika (tunnit ja minuutit)</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.timeInput}
            placeholder="Tunnit"
            keyboardType="numeric"
            value={formData.hours}
            onChangeText={(val) => setFormData({ ...formData, hours: val })}
          />
          <TextInput
            style={styles.timeInput}
            placeholder="Minuutit"
            keyboardType="numeric"
            value={formData.minutes}
            onChangeText={(val) => setFormData({ ...formData, minutes: val })}
          />
        </View>

        {/* Kuormitus- ja stressikysymykset */}
        <Text style={styles.label}>Kuinka kuormittavana koit tämän työpäivän? (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.load1}
          onChangeText={(val) => setFormData({ ...formData, load1: val })}
        />

        <Text style={styles.label}>Stressikysymys 1 (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.stressLoad1}
          onChangeText={(val) => setFormData({ ...formData, stressLoad1: val })}
        />

        <Text style={styles.label}>Stressikysymys 2 (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.stressLoad2}
          onChangeText={(val) => setFormData({ ...formData, stressLoad2: val })}
        />

        {/* Kommentti */}
        <Text style={styles.label}>Kommentti</Text>
        <TextInput
          style={[styles.textArea, styles.input]}
          multiline
          value={formData.comment}
          onChangeText={(val) => setFormData({ ...formData, comment: val })}
        />

        {/* Tallenna-nappi */}
        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Tallenna</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '48%',
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
