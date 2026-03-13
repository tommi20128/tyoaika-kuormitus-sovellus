// app/(supervisor)/profile.tsx
import { PasswordChange } from '@/components/profile/PasswordChange';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
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
        managerName={profile.managerName}
      />

      <PasswordChange />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Kirjaudu ulos</Text>
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
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});