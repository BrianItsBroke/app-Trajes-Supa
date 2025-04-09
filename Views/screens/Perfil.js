import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, ActivityIndicator } from 'react-native';
import usePerfilViewModel from '../viewmodels/ProfileViewModel';

const Perfil = () => {
  const { userData, loading } = usePerfilViewModel();

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />;
  }

  if (!userData) {
    return <Text style={styles.errorText}>No se encontraron datos del usuario</Text>;
  }

  return (
    <ImageBackground source={require('../assets/FondoPerfil.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/perfil.jpg')} style={styles.profileImage} />
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
    elevation: 5,
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default Perfil;
