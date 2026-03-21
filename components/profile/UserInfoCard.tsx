// components/UserInfoCard.tsx
import { ProfileData } from '@/types/profile';
import { Image, StyleSheet, Text, View } from 'react-native';

// Komponentti käyttäjätietojen näyttämiseen profiilisivulla

export const UserInfoCard = ({
  firstName,
  lastName,
  email,
  title,
  managerName: manager,
}: ProfileData) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />

      <Text style={[styles.name, { textAlign: 'left' }]}>
        {firstName} {lastName}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      {manager && (
        <Text style={styles.manager}>
          Esihenkilö: {manager}
        </Text>
      )}
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
    color: '#000',
    textAlign: 'left',
  },
  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  manager: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  }
});