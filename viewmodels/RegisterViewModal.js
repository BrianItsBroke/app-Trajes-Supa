import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export const useRegisterViewModel = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegistro = async () => {
    setError(null); // Limpiar errores previos

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error registrando usuario:', error);
        setError(error.message);
        Alert.alert('Error', error.message);
      } else {
        try {
          await supabase
            .from('usuarios')
            .insert([{ nombre, email, rol: 'cliente' }]);

          Alert.alert('Éxito', 'Se completó tu registro con éxito.');
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error insertando datos del usuario:', error);
          setError('Error al guardar los datos del usuario.');
          Alert.alert('Error', 'Ocurrió un error al guardar los datos del usuario.');
        }
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Ocurrió un error inesperado.');
      Alert.alert('Error', 'Ocurrió un error inesperado al registrar el usuario.');
    }
  };

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleRegistro,
  };
};
