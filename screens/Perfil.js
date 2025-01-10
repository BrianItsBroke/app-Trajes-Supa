import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { supabase } from '../lib/supabase';

const Perfil = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Obtener el usuario actual

        if (user) {
          const { data, error } = await supabase
            .from('usuarios') // Reemplaza 'usuarios' con el nombre de tu tabla
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error al obtener los datos del usuario:', error);
          } else {
            setUserData(data);
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ImageBackground
        source={require('../assets/FondoPerfil.jpg')} 
        style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <View style={styles.header}> 
        <Image 
          source={require('../assets/perfil.jpg')} // Reemplaza con la imagen que desees
          style={styles.profileImage} 
        />
        <Text style={styles.nombreUsuario}>{userData.nombre}</Text>
        <Text style={styles.correoUsuario}>{userData.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.valor}>{userData.id}</Text>

      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nombreUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  correoUsuario: {
    fontSize: 16,
    color: '#555',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  valor: {
    fontSize: 16,
    marginBottom: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
  },
});

export default Perfil;