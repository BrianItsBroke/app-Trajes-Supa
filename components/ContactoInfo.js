
import { View, Text, StyleSheet} from 'react-native';

const ContactoInfo=({}) => (
<View style={styles.contactoContainer}>
    <Text style={styles.contactoEmail}>INFORMACION DE CONTACTO</Text>
    <Text style={styles.contactoEmail}>cataleya@gmail.com</Text>
    <Text style={styles.contactoTelefono}>+52 351 556 6547</Text>
    <Text style={styles.contactoHorario}>08:00 - 22:00 - Todos los días</Text>
</View>
);

const styles = StyleSheet.create({
contactoContainer: {
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', 
  },
  contactoEmail: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactoTelefono: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactoHorario: {
    fontSize: 14,
    color: '#888', 
  },
});

export default ContactoInfo;