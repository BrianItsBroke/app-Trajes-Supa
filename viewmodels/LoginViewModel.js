import { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoginViewModel = () => {
  const navigation = useNavigation();
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

    return () => backHandler.remove(); // Limpieza del event listener
  }, [navigation]);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('Correo electrónico o contraseña incorrectos.');
        } else {
          setError('Error al iniciar sesión.');
          console.error(error);
        }
      } else {
        await AsyncStorage.setItem('userId', data.user.id); // Guardar el ID en AsyncStorage
        navigation.navigate('ProductList');
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
    navigation,
  };
};
