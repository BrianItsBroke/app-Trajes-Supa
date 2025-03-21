import React from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRegisterViewModel } from '../viewmodels/RegisterViewModal';

const Register = () => {
  const { nombre, setNombre, email, setEmail, password, setPassword, error, handleRegistro } = useRegisterViewModel();

  return (
    <ImageBackground source={require('../assets/Login_image.png')} style={styles.backgroundImage}>
      <View style={styles.containerLogo}>
        <Image source={require('../assets/Logo_imagen.jpg')} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <View style={styles.formSquare}>
          <Text style={styles.textForm}>Registro</Text>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

          <Button title="Registrarse" color={'#8B4513'} onPress={handleRegistro} />
        </View>
      </View>
    </ImageBackground>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  containerLogo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 200, borderRadius: 250 / 2, marginBottom: 20 },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  error: { color: 'red', marginBottom: 10 },
  formSquare: {
    backgroundColor: '#ffff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  textForm: { textAlign: 'center', color: '#8B4513', fontWeight: 'bold', fontSize: 20, marginBottom: 7 },
});

export default Register;
