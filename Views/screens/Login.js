import React from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useLoginViewModel } from '../viewmodels/LoginViewModel';

const Login = () => {
  const { email, setEmail, password, setPassword, isLoading, error, handleLogin, navigation } = useLoginViewModel();

  return (
    <ImageBackground source={require('../assets/Login_image.png')} style={styles.backgroundImage}>
      <View style={styles.containerLogo}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/Logo_imagen.jpg')} style={styles.logo} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.formSquare}>
          <Text style={styles.textForm}>Iniciar Sesión</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button title="Iniciar Sesión" color={'#8B4513'} onPress={handleLogin} />
          )}
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

export default Login;
