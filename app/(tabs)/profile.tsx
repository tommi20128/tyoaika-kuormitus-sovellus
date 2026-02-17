import { View, Text, StyleSheet, Pressable, Image, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/Config';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Haetaan käyttäjätiedot Firebasesta
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setTitle(data.title || '');
        setEmail(user.email || ''); // Firebase Authentication -sähköposti
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) return null;
  if (!user) return null;

  const handleLogout = () => {
    // Tähän myöhemmin kirjautuminen ulos
    router.replace('/'); // Menee kirjautumissivulle
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Täytä kaikki kentät');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Uudet salasanat eivät täsmää!');
      return;
    }
    try {
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);

      // Uudelleenautentikointi
      await reauthenticateWithCredential(user, credential);

      // Salasanan päivitys
      await updatePassword(user, newPassword);

      Alert.alert('Salasana vaihdettu onnistuneesti!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Salasanan vaihto epäonnistui', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profiilikuva missä ei ole vielä mitään*/}
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />

      {/* Käyttäjätiedot */}
      <Text style={styles.name}>{firstName} {lastName}</Text>
      <Text style={styles.name}>Titteli: {title}</Text>
      <Text style={styles.email}>{email}</Text>

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
      <TextInput
        style={styles.input}
        placeholder="toista uusi salasana"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
      />
      <Pressable style={styles.changeButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Vaihda salasana</Text>
      </Pressable>

      {/* Kirjaudu ulos -nappi*/}
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
function setFirstName(firstName: any) {
  throw new Error('Function not implemented.');
}

function setLastName(lastName: any) {
  throw new Error('Function not implemented.');
}

