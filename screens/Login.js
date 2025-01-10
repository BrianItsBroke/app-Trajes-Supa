import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator,ImageBackground,Image, BackHandler, TouchableOpacity} from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null, 
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Limpiar el event listener al desmontar el componente
    return () => backHandler.remove(); 
  }, [navigation]);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // Manejo de errores de Supabase
        if (error.message === 'Invalid login credentials') { 
          setError('Correo electrónico o contraseña incorrectos.');
        } else {
          setError('Error al iniciar sesión.');
          console.error(error);
        }
      } else {
        // Login exitoso
        const userId = data.user.id; // Obtener el ID del usuario
        await AsyncStorage.setItem('userId', userId); // Guardar el ID en AsyncStorage
        navigation.navigate('ProductList');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Login_image.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.containerLogo}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../assets/Logo_imagen.jpg')} 
          style={styles.logo} 
        />
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
        <Button title="Iniciar Sesión" color={'#8B4513'} onPress={() => handleLogin({ navigation })} />
      )}
      </View>
    </View>
    </ImageBackground>
  );
};

// Estilos (puedes personalizarlos)
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

export default Login;