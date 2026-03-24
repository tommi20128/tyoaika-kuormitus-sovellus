// components/employee/EmployeeInfoCard.tsx
import { User } from '@/types/user';
import { StyleSheet, Text, View } from 'react-native';


// Komponentti käyttäjätietojen näyttämiseen profiilisivulla

export const UserInfoCard = ({
  firstName,
  lastName,
  title,
}: User) => {
  return (
    <View style={styles.card}>

      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',           // kortti vie koko leveyden
    marginBottom: 32,
    paddingHorizontal: 16,   // hieman sisäistä marginaalia
    // alignItems jätetty pois (stretch oletus)
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
    textAlign: 'left',       // vasen tasaus
  },

  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
    textAlign: 'left',       // vasen tasaus
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});