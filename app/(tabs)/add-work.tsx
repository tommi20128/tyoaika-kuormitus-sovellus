import { View, Text, StyleSheet } from 'react-native';

export default function WorkPage() {
   return (
      <View style={styles.container}>
        <Text style={styles.title}>Työajan lisäys sivu!</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 40,
      textAlign: 'center',
    },
});
