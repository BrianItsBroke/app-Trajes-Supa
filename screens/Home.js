import React, {useEffect}from 'react';
import { View, ImageBackground, Button, StyleSheet, Image, BackHandler } from 'react-native';

const Home = ({ navigation }) => {

  useEffect(() => {
    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null, 
    });
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Limpiar el event listener al desmontar el componente
    return () => backHandler.remove(); 

  }, [navigation]);

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
          onPress={() => navigation.navigate('Register')} 
          style={styles.button}
        />
        <Button 
          title="Iniciar Sesión" 
          color={'#8B4513'}
          onPress={() => navigation.navigate('Login')} 
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
    borderRadius:250/2,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap:15
  },
  button: {
    margin:5
  },
});

export default Home;