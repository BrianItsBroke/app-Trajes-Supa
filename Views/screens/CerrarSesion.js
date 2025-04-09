import React from 'react';
import { StyleSheet, View, Text,  Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { supabase } from '../lib/supabase'; // Importa tu cliente de Supabase
import { useNavigation } from '@react-navigation/native'; 

const CerrarSesion = () => {
  const navigation = useNavigation();

  const handleCerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
        Alert.alert('Error', 'No se pudo cerrar sesión.');
      } else {
        // Redirigir a la pantalla de inicio de sesión o a la pantalla principal
        navigation.navigate('Login'); // Reemplaza 'Login' con el nombre de tu pantalla de inicio de sesión
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/FondoPerfil.jpg')} 
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={styles.titulo}>Cerrar Sesión</Text>
      <TouchableOpacity style={styles.boton} onPress={handleCerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  boton: {
    backgroundColor: '#8B4513', 
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
  },
});

export default CerrarSesion;