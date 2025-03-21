import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useDetalleBlogViewModel = (route) => {
  const navigation = useNavigation();
  const { postId, blogPosts } = route.params;
  
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Buscar el post por ID
    const foundPost = blogPosts.find((item) => item.id === postId);
    setPost(foundPost);
  }, [postId, blogPosts]);

  useEffect(() => {
    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const regresar = () => navigation.navigate('BlogScreen');
  const regresarMain = () => navigation.navigate('ProductList');

  return { post, regresar, regresarMain };
};
