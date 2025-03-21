import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BlogPost } from '../models/BlogPost';

export const useBlogViewModel = () => {
  const navigation = useNavigation();
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos
    setBlogPosts([
      new BlogPost(1, require('../assets/Blog1.jpg'), 'EL SWIMWEAR PERFECTO PARA UN DÍA DE DESCANSO!', ['#Moda', '#Story'], 'Hace 4 días'),
      new BlogPost(2, require('../assets/Blog2.jpg'), 'RELAJATE CON TU COMODO SWIMWEAR MIENTRAS TOMAS UNA DUCHA', ['#Beach', '#New'], 'Hace 6 días'),
      new BlogPost(3, require('../assets/Blog3.jpg'), 'NUESTRA NUEVA COLECCION ESTA CASI POR SALIR, DA CLICK AQUI PARA SABER TODO ACERCA DE ELLA', ['#New', '#Beach'], 'Hace 8 días'),
      new BlogPost(4, require('../assets/Blog4.jpg'), 'NUESTRA COLECCION A SIDO TODO UN EXITO GRACIAS A SU COMODIDAD Y FLEXIBILIDAD', ['#Soft', '#Quality'], 'Hace 10 días'),
    ]);

    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const irADetalle = (postId) => {
    navigation.navigate('DetalleBlog', { postId, blogPosts });
  };

  const regresarMain = () => {
    navigation.navigate('ProductList');
  };

  return { blogPosts, irADetalle, regresarMain };
};
