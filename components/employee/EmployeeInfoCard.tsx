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
    alignSelf: 'stretch',
    paddingHorizontal: 16,   // hieman sisäistä marginaalia
    // alignItems jätetty pois (stretch oletus)
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'left',       // vasen tasaus
  },

  title: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    textAlign: 'left',       // vasen tasaus
  },

});