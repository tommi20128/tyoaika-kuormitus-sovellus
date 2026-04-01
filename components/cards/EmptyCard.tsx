// components/cards/EmptyCard.tsx
import { View, Text, StyleSheet } from 'react-native';

// Yksinkertainen kortti, jota voidaan käyttää "Ei merkintöjä" -tms. 
// näyttämiseen esimerkiksi historia-sivulla, 
// kun tiettynä viikkona tai kuukautena ei ole kirjauksia.

interface EmptyCardProps {
  title?: string;   // Otsikko, joka näytetään kortissa
  message?: string; // Viesti, joka näytetään kortissa
}

// Yksinkertainen kortti, jota voidaan käyttää "Ei merkintöjä" -tms. näyttämiseen
export default function EmptyCard({
  title,
  message = 'Ei merkintöjä'
}: EmptyCardProps) {
  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}

      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});