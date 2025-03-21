import React from 'react';
import { View, ImageBackground, Button, StyleSheet, Image } from 'react-native';
import useHomeViewModel from '../viewmodels/HomeViewModel';

const Home = () => {
  const { navigateToRegister, navigateToLogin } = useHomeViewModel();

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
        <Button 
          title="Registrarse" 
          color={'#8B4513'}
          onPress={navigateToRegister} 
          style={styles.button}
        />
        <Button 
          title="Iniciar Sesión" 
          color={'#8B4513'}
          onPress={navigateToLogin} 
          style={styles.button}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 100,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15
  },
  button: {
    margin: 5
  },
});

export default Home;