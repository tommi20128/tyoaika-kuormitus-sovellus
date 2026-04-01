// app/(tabs)/profile.tsx
import { PasswordChange } from '@/components/profile/PasswordChange';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import CustomButton from "@/components/ui/CustomButton";
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <UserInfoCard
        firstName={profile.firstName}
        lastName={profile.lastName}
        email={profile.email}
        title={profile.title}
        managerName={profile.managerName}
      />

      {/* Salasanan vaihto */}
      <View style={styles.card}>
        <PasswordChange />
      </View>

      {/* Kirjaudu ulos (Tarviiko tätä?) */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.85 }
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Kirjaudu ulos</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  logoutButton: {
    height: 52,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

