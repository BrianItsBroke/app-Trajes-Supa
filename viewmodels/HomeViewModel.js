import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useHomeViewModel = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null, 
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Limpiar el event listener al desmontar el componente
    return () => backHandler.remove(); 
  }, [navigation]);

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    navigateToRegister,
    navigateToLogin,
  };
};

export default useHomeViewModel;