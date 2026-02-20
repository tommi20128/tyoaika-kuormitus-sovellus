// components/UserInfoCard.tsx
import { View, Text, StyleSheet, Image } from 'react-native';
import { ProfileData } from '@/types/profile';

// Komponentti käyttäjätietojen näyttämiseen profiilisivulla

export const UserInfoCard = ({
  firstName,
  lastName,
  email,
  title,
}: ProfileData) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
});