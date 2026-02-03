import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ProfilePage() {
  const handleLogout = () => {
    router.replace('/'); // pitäisi viedä kirjautumissivulle mutta ei toimi
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiili-sivu</Text>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:'#f2f2f2', 
    padding:20 },
  title: { 
    fontSize:24, 
    fontWeight:'bold', 
    marginBottom:40, 
    textAlign:'center' },
  button: { 
    backgroundColor:'#FF3B30', 
    paddingHorizontal:24, 
    paddingVertical:12, 
    borderRadius:8 },
  buttonText: { 
    color:'white', 
    fontSize:16 },
});
