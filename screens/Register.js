// Registro.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground,Image, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  

  const handleRegistro = async () => {
    setError(null); // Clear previous errors

    try {
      console.log("Before supabase.auth.signUp");
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      console.log("After supabase.auth.signUp", { user, error });

      if (error) {
        console.error('Error registering user:', error);
        setError(error.message); // Set the error state
        Alert.alert('Error', error.message);
      } else {
        console.log("User successfully signed up:", user);
        try {
          await supabase
            .from('usuarios')
            .insert([
              { 
                nombre: nombre,
                email: email,
                rol: 'cliente' 
              }
            ]);
          Alert.alert('Se completo tu registro con exito');
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error inserting user data:', error);
          setError(error.message); // Set the error state 
          Alert.alert('Error', 'Ocurrió un error al guardar los datos del usuario.');
        }
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      setError('Ocurrió un error inesperado.'); // Generic error message
      Alert.alert('Error', 'Ocurrió un error inesperado al registrar el usuario.');
    }
  };
  return (
    <ImageBackground
      source={require('../assets/Login_image.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.containerLogo}>
     <Image
          source={require('../assets/Logo_imagen.jpg')} 
          style={styles.logo} 
        />
     </View>
    <View style={styles.container}>
      <View style={styles.formSquare}>
      <Text style={styles.textForm}>Registro</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
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
     

      <Button title="Registrarse" color={'#8B4513'} onPress={handleRegistro} />
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
  },
  containerLogo:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo:{
    width: 200,
    height: 200,
    borderRadius:250/2,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },formSquare: {
    backgroundColor: '#ffff', // Color de fondo del cuadrado
    padding: 20,
    borderRadius: 10, // Ajusta el radio para controlar la redondez de las esquinas
    width: '100%', // Ocupa todo el ancho del contenedor padre
    // Agrega sombras si lo deseas (opcional)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  },
  textForm:{
    textAlign:'center',
    color:'#8B4513',
    fontWeight:'bold',
    fontSize:20,
    marginBottom:7
  }
});

export default Register;