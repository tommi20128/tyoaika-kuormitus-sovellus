// app/(supervisor)/(tabs)/profile.tsx
import { PasswordChange } from '@/components/profile/PasswordChange';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import CustomButton from '@/components/ui/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading } = useProfileData();

  if (authLoading || loading) return null;
  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('Vahvista', 'Haluatko varmasti kirjautua ulos?', [
      { text: 'Peruuta', style: 'cancel' },
      { text: 'Kirjaudu ulos', onPress: () => router.replace('/') }
    ]);
  };

  return (
    <View style={styles.container}>
      <UserInfoCard
        firstName={profile.firstName}
        lastName={profile.lastName}
        email={profile.email}
        title={profile.title}
      />

      <PasswordChange />

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
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  button:{
     width: "100%",
    height: 42,
    backgroundColor: "#1E3A8A", // tummansininen
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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