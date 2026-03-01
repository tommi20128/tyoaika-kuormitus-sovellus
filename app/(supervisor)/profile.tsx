import { View, Text, StyleSheet, Pressable, Image, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { PasswordChange } from '@/components/PasswordChange';
import { useProfileData } from '@/hooks/useProfileData';
import { UserInfoCard } from '@/components/UserInfoCard';

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
          manager= {profile.manager}
        />
  
        {/* Salasanan vaihto */}
        <PasswordChange />
  
        {/* Kirjaudu ulos -nappi*/}
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
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

