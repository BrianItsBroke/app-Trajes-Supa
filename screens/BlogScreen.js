import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import ContactoInfo from '../components/ContactoInfo';

const BlogScreen = () => {
  const navigation = useNavigation();
  const [blogPosts, setBlogPosts] = useState([]);

  const regresarMain=() => {
    navigation.navigate('ProductList')
  }

  useEffect(() => {
    // Aquí deberías obtener los datos de tus publicaciones de blog, 
    // ya sea de una API o de un archivo local. 
    // Por ahora, usaré datos de ejemplo:
    setBlogPosts([
      {
        id: 1,
        imagen: require('../assets/Blog1.jpg'), // Reemplaza con la URL o ruta de tu imagen
        titulo: 'EL SWIMWEAR PERFECTO PARA UN DÍA DE DESCANSO!',
        hashtags: ['#Moda', '#Story'],
        fecha: 'Hace 4 días',
      },
      {
        id: 2,
        imagen: require('../assets/Blog2.jpg'), // Reemplaza con la URL o ruta de tu imagen
        titulo: 'RELAJATE CON TU COMODO SWIMWEAR MIENTRAS TOMAS UNA DUCHA',
        hashtags: ['#Beach', '#New'],
        fecha: 'Hace 6 días',
      },
      {
        id: 3,
        imagen: require('../assets/Blog3.jpg'), // Reemplaza con la URL o ruta de tu imagen
        titulo: 'NUESTRA NUEVA COLECCION ESTA CASI POR SALIR, DA CLICK AQUI PARA SABER TODO ACERCA DE ELLA',
        hashtags: ['#New', '#Beach'],
        fecha: 'Hace 8 días',
      },
      {
        id: 4,
        imagen: require('../assets/Blog4.jpg'), // Reemplaza con la URL o ruta de tu imagen
        titulo: 'NUESTRA COLECCION A SIDO TODO UN EXITO GRACIAS A SU COMODIDAD Y FLEXIBILIDAD',
        hashtags: ['#Soft', '#Quality'],
        fecha: 'Hace 10 días',
      },
      
      // ... más publicaciones
    ]);
    navigation.setOptions({
      headerLeft: () => null, 
    });
  }, [navigation]);

  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.blogPost} onPress={() => navigation.navigate('DetalleBlog', { postId: item.id,blogPosts: blogPosts  })}>
      <Image source={item.imagen} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.titulo}</Text>
      <View style={styles.hashtagsContainer}>
        {item.hashtags.map((hashtag, index) => (
          <Text key={index} style={styles.hashtag}>{hashtag}</Text>
        ))}
      </View>
      <Text style={styles.postDate}>{item.fecha}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>BLOG</Text>
      {/* Barra de categorías */}
      <View style={styles.categories}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Fashion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Promo</Text>
        </TouchableOpacity>
        {/* ... más categorías */}
      </View>
      <FlatList
        data={blogPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
      />
      
      <TouchableOpacity onPress={regresarMain} style={styles.backButton}>
        <Text style={styles.backButtonText}>Regresar a la pagina principal</Text> 
      </TouchableOpacity>

      <ContactoInfo /> 
      
      <View style={styles.navigationButtonsContainer}> 
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Nosotros')}>
          <Text style={styles.navigationButtonText}>Nosotros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Contacto')}>
          <Text style={styles.navigationButtonText}>Contacto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Blog')}>
          <Text style={styles.navigationButtonText}>Blog</Text>
        </TouchableOpacity>
      </View> 

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center'
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
  },
  blogPost: {
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  hashtag: {
    marginRight: 10,
    color: '#8B4513', // Color de los hashtags
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  //Estilos del contacto
  contactoContainer: {
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', 
  },
  contactoEmail: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactoTelefono: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactoHorario: {
    fontSize: 14,
    color: '#888', 
  },
  // Estilos para los botones de navegación
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    padding: 20,
  },
  navigationButton: { 
    padding: 10,
    borderRadius: 5,
  },
    navigationButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight:'bold'
  },
  backButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlogScreen;