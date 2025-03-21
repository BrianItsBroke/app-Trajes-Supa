import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useDetalleBlogViewModel } from '../viewmodels/DetalleBlogViewModal';

const DetalleBlog = ({ route }) => {
  const { post, regresar, regresarMain } = useDetalleBlogViewModel(route);

  if (!post) {
    return <Text style={styles.errorText}>Publicación no encontrada</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={post.imagen} style={styles.postImage} />
        <Text style={styles.postTitle}>{post.titulo}</Text>
        <Text style={styles.postDescription}>{post.descripcion}</Text>

        <TouchableOpacity onPress={regresar} style={styles.backButton}>
          <Text style={styles.backButtonText}>Regresar al blog</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={regresarMain} style={styles.backButton}>
          <Text style={styles.backButtonText}>Regresar a la página principal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  postImage: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  postTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  postDescription: { fontSize: 18, textAlign: 'justify' },
  backButton: { backgroundColor: '#8B4513', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { textAlign: 'center', fontSize: 18, color: 'red', marginTop: 20 },
});

export default DetalleBlog;
