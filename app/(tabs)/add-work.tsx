// app/(tabs)/add-work.tsx
import { db } from '@/Config';
import { useAuth } from '@/context/AuthContext';
import { WorkEntryFormData } from '@/types/work';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AddWorkPage() {
  const { user, loading } = useAuth();

  // Yhdistetty state kaikille input-kentille
  const [formData, setFormData] = useState<WorkEntryFormData>({
    hours: '',
    minutes: '',
    workload: '',
    stress1: '',
    stress2: '',
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
          workload: (data.workload || '').toString(),
          stress1: (data.stress1 || '').toString(),
          stress2: (data.stress2 || '').toString(),
          comment: data.comment || '',
        });
      }
    };

    fetchTodayEntry();
  }, [user]);

  // Parsitaan numerokentät ja tekstiedot oikeisiin muotoihin tallennusta varten
  const parseFormData = () => {
    return {
      hours: parseInt(formData.hours, 10),
      minutes: parseInt(formData.minutes, 10),
      load1: parseInt(formData.workload, 10),
      stressLoad1: parseInt(formData.stress1, 10),
      stressLoad2: parseInt(formData.stress2, 10),
      comment: formData.comment,
    };
  };

  // Tarkistetaan syötteiden oikeellisuus
  const validateFormData = (data: ReturnType<typeof parseFormData>): string | null => {
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
  const saveToFirestore = async (data: ReturnType<typeof parseFormData>) => {
    const totalMinutes = data.hours * 60 + data.minutes;
    const averageStress = (data.stressLoad1 + data.stressLoad2) / 2;

    const docRef = doc(db, 'users', user!.uid, 'workEntries', todayId);

    await setDoc(docRef, {
      totalMinutes,
      workload: data.load1,
      stress1: data.stressLoad1,
      stress2: data.stressLoad2,
      //averageStress,
      comment: data.comment,
      date: todayId,
      createdAt: serverTimestamp(),
    });
  };

  // Pääfunktio tallennukselle
  const handleSave = async () => {
    if (!user) return;

    try {
      const parsed = parseFormData();
      const validationError = validateFormData(parsed);
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
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // IOS: siirtää ylös, Android: scrollaa
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
     // säädä tarpeen mukaan
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
          value={formData.workload}
          onChangeText={(val) => setFormData({ ...formData, workload: val })}
        />

        <Text style={styles.label}>Oliko sinulla työpäivän aikana aikaa palautumiselle (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.stress1}
          onChangeText={(val) => setFormData({ ...formData, stress1: val })}
        />

        <Text style={styles.label}>Koitko työsi merkitykselliseksi (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.stress2}
          onChangeText={(val) => setFormData({ ...formData, stress2: val })}
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
    backgroundColor: '#FFFFFF',
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
    borderColor:'#Black',
    borderWidth:0.2,
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
    borderColor:'#Black',
    borderWidth:0.2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
button:{
     width: "100%",
    height: 42,
    backgroundColor: "#1E3A8A", // tummansininen
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
});
