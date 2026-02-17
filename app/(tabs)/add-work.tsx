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
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/Config";
import { useAuth } from '@/context/AuthContext';

export default function AddWorkPage() {
  const { user, loading } = useAuth();
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [load1, setLoad1] = useState("");
  const [stressLoad1, setStressLoad1] = useState("");
  const [stressLoad2, setStressLoad2] = useState("");
  const [comment, setComment] = useState("");

  const todayId = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 🔹 Ladataan päivän kirjaus jos olemassa
  useEffect(() => {
    const fetchTodayEntry = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid, "workEntries", todayId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        const totalMinutes = data.totalMinutes;
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        setHours(h.toString());
        setMinutes(m.toString());
        setLoad1(data.load1.toString());
        setStressLoad1(data.stressLoad1.toString());
        setStressLoad2(data.stressLoad2.toString());
        setComment(data.comment || "");
      }
    };

    fetchTodayEntry();
  }, []);

  // Tallennetaan päivän kirjaus
  const handleSave = async () => {
    try {
      if (!user) return;

      const parsedHours = parseInt(hours);
      const parsedMinutes = parseInt(minutes);
      const parsedLoad1 = parseInt(load1);
      const parsedstressLoad1 = parseInt(stressLoad1);
      const parsedstressLoad2 = parseInt(stressLoad2);

      if (
        isNaN(parsedHours) ||
        isNaN(parsedMinutes) ||
        isNaN(parsedLoad1) ||
        isNaN(parsedstressLoad1) ||
        isNaN(parsedstressLoad2)
      ) {
        Alert.alert("Virhe", "Täytä kaikki numerokentät oikein.");
        return;
      }

      // Varmistetaan, että tunnit ja minuutit ovat oikealla alueella
      if (parsedMinutes < 0 || parsedMinutes > 59) {
        Alert.alert("Virhe", "Minuuttien pitää olla välillä 0–59.");
        return;
      }

      if (parsedLoad1 < 1 || parsedLoad1 > 10) {
        Alert.alert("Virhe", "Kuormitus pitää olla välillä 1–10.");
        return;
      }

      if (parsedstressLoad1 < 1 || parsedstressLoad1 > 10 || parsedstressLoad2 < 1 || parsedstressLoad2 > 10) {
        Alert.alert("Virhe", "Stressikuormitus pitää olla välillä 1–10.");
        return;
      }

      const totalMinutes = parsedHours * 60 + parsedMinutes;
      const dailyLoad = parsedLoad1;
      const dailyStress = (parsedstressLoad1 + parsedstressLoad2) / 2;

      const docRef = doc(db, "users", user.uid, "workEntries", todayId);

      await setDoc(docRef, {
        totalMinutes: totalMinutes,
        load1: dailyLoad,
        stressLoad1: parsedstressLoad1,
        stressLoad2: parsedstressLoad2,
        averageStress: dailyStress,
        comment: comment,
        date: todayId,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Tallennettu", "Päivän kirjaus tallennettu.");
    } catch (error) {
      console.error(error);
      Alert.alert("Virhe", "Tallennus epäonnistui.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} //IOS: siirtää sisältöä ylös, Android: ei vaikutusta
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Lisää työaika</Text>
        <Text style={styles.label}>Työaika (tunnit ja minuutit)</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.timeInput}
            placeholder="Tunnit"
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
          />
          <TextInput
            style={styles.timeInput}
            placeholder="Minuutit"
            keyboardType="numeric"
            value={minutes}
            onChangeText={setMinutes}
          />
        </View>
        <Text style={styles.label}>Kuinka kuormittavana koit tämän työpäivän? (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={load1}
          onChangeText={setLoad1}
        />
        <Text style={styles.label}>Stressikysymys 1 (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={stressLoad1}
          onChangeText={setStressLoad1}
        />
        <Text style={styles.label}>Stressikysymys 2 (1–10)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={stressLoad2}
          onChangeText={setStressLoad2}
        />
        <Text style={styles.label}>Kommentti</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <Pressable
          style={styles.button}
          onPress={handleSave}
        >
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: "48%",
  },
  textArea: {
    backgroundColor: '#ffffff',
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
