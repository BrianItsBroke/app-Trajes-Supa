import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';

const DetalleBlog = ({ route }) => {
  const navigation = useNavigation();
  const { postId, blogPosts} = route.params; 
  // Obtén el post correspondiente usando postId (esto dependerá de cómo almacenas tus datos)
  const post = blogPosts.find(post => post.id === postId); 

  const regresar=() => {
    navigation.navigate('BlogScreen')
  }
  const regresarMain=() => {
    navigation.navigate('ProductList')
  }

  if (!post) {
    return <Text>Publicación no encontrada</Text>;
  }

  useEffect(() => {
    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null, 
    });
  }, [navigation]); 

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image source={post.imagen} style={styles.postImage} />
      <Text style={styles.postTitle}>{post.titulo}</Text>
      <View style={styles.container}>
      {/* ... imagen y título ... */}

      {postId === 1 && (
        <Text style={styles.postDescription}>
          Esta es la descripción detallada de la publicación 1. Aquí puedes 
          escribir un texto más largo con información relevante sobre el tema 
          del blog...
          <Text style={styles.postDescription}>
          Esta es la descripción detallada de la publicación 1. Aquí puedes 
          escribir un texto más largo con información relevante sobre el tema 
          del blog...
        </Text>
        <Text style={styles.postDescription}>
          Esta es la descripción detallada de la publicación 1. Aquí puedes 
          escribir un texto más largo con información relevante sobre el tema 
          del blog...
        </Text>
        <Text style={styles.postDescription}>
          Esta es la descripción detallada de la publicación 1. Aquí puedes 
          escribir un texto más largo con información relevante sobre el tema 
          del blog...
        </Text>
        <Text style={styles.postDescription}>
          Esta es la descripción detallada de la publicación 1. Aquí puedes 
          escribir un texto más largo con información relevante sobre el tema 
          del blog...
        </Text>
        </Text>
        
      )}

      {postId === 2 && (
        <Text style={styles.postDescription}>
          Esta es la descripción de la publicación 2. Puedes poner aquí el 
          contenido que quieras mostrar para esta publicación específica.
        </Text>
      )}

      {postId === 3 && (
        <Text style={styles.postDescription}>
          Esta es la descripción de la publicación 2. Puedes poner aquí el 
          contenido que quieras mostrar para esta publicación específica.
        </Text>
      )}

      {postId === 4 && (
        <Text style={styles.postDescription}>
          Esta es la descripción de la publicación 2. Puedes poner aquí el 
          contenido que quieras mostrar para esta publicación específica.
        </Text>
      )}
    </View>

      <TouchableOpacity onPress={regresar} style={styles.backButton}>
        <Text style={styles.backButtonText}>Regresar al blog</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={regresarMain} style={styles.backButton}>
        <Text style={styles.backButtonText}>Regresar a la pagina principal</Text> 
      </TouchableOpacity>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 18,
    textAlign:'justify'
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

export default DetalleBlog;