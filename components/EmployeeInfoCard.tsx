import { EmployeeData } from '@/types/employees';
import { View, Text, StyleSheet, Image } from 'react-native';


// Komponentti käyttäjätietojen näyttämiseen profiilisivulla

export const UserInfoCard = ({
  firstName,
  lastName,
  title,
}: EmployeeData) => {
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
  manager:{
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  }
});