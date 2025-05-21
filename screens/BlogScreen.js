import React,{useCallback,useState,useEffect,useRef} from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useBlogViewModel } from '../viewmodels/BlogViewModel';
import ContactoInfo from '../components/ContactoInfo';

const BlogScreen = () => {
  const { blogPosts, irADetalle, regresarMain } = useBlogViewModel();
  
  //const navigation = useNavigation();
  //LazyLoading
  const [visibleItemIds, setVisibleItemIds] = useState(new Set());

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setVisibleItemIds(prevVisibleItemIds => {
      const newVisibleItemIds = new Set(prevVisibleItemIds);
      viewableItems.forEach(item => {
        if (item.isViewable && item.item) {
          newVisibleItemIds.add(item.item.id);
        }
      });
      return newVisibleItemIds;
    });
  }, []);

  //lazyLoading
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 15
  }).current;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.blogPost} onPress={() => irADetalle(item.id)}>
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

        {/* Categorías */}
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Fashion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Promo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de publicaciones */}
        <FlatList
          data={blogPosts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />

        <TouchableOpacity onPress={regresarMain} style={styles.backButton}>
          <Text style={styles.backButtonText}>Regresar a la página principal</Text>
        </TouchableOpacity>

        <ContactoInfo />

        {/* Navegación */}
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  categories: { flexDirection: 'row', marginBottom: 20 },
  categoryButton: { paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  categoryText: { fontSize: 16 },
  blogPost: { marginBottom: 20 },
  postImage: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  hashtagsContainer: { flexDirection: 'row', marginBottom: 5 },
  hashtag: { marginRight: 10, color: '#8B4513' },
  postDate: { fontSize: 14, color: '#888' },
  navigationButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  navigationButton: { padding: 10, borderRadius: 5 },
  navigationButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#8B4513', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BlogScreen;
