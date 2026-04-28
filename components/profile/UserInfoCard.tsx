// components/profile/UserInfoCard.tsx
import { ProfileData } from '@/types/profile';
import { StyleSheet, Text, View } from 'react-native';

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

      <Text style={[styles.name, { textAlign: 'left' }]}>
        {firstName} {lastName}
      </Text>

      <Text style={styles.title}>
        Titteli: {title}
      </Text>

      <Text style={styles.email}>
        Sähköpostiosoite: {email}
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
    marginBottom: 8,
    color: '#000',
    textAlign: 'left',
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  manager: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  }
});