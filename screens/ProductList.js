import React, { useState, useEffect, useRef, useCallback} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, Alert, Dimensions} from 'react-native';
import { supabase } from '../lib/supabase'; 
import AddProductModal from '../components/addProductModal';
import { fetchProducts } from '../utils/productHelpers';
import MenuDesplegable from '../components/MenuDesplegable';
import SearchIcon from "../components/SearchIcon"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import Swiper from 'react-native-swiper';

import Cart from '../components/Cart';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isEditingModalVisible, setIsEditingModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userRole, setUserRole] = useState(null);
  const swiperRef = useRef(null);
  //Para el lazyloading
  const [visibleItemIds, setVisibleItemIds] = useState(new Set());

  useEffect(() => {
    // Iniciar el autoplay del Swiper (opcional)
    const autoplayInterval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1);
      }
    }, 3000); 

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(autoplayInterval);
  }, []);

useEffect(() => {
  const fetchUserRole = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', userId)
          .single();
        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          setUserRole(data.rol);
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  fetchUserRole();
}, []);
  
 

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {

    // Quitar la flecha de retroceso
    navigation.setOptions({
      headerLeft: () => null, 
    });
  }, [navigation]);
 

  const handleAddProduct = async (productData) => {
    try {
        const { error } = await supabase
          .from('Productos')
          .insert([productData]);
        if (error) {
          console.error('Error añadiendo el producto:', error);
          Alert.alert('Error', 'No se pudo agregar el producto.');
        } else {
          setIsModalVisible(false); // Cerrar el modal
          fetchProducts(setProducts);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', 'No se pudo agregar el producto.');
      }
  };
  const handleUpdateProduct = async (productData) => {
    try {
      const { error } = await supabase
        .from('Productos')
        .update(productData)
        .eq('id', productToEdit.id); 

      if (error) {
        console.error('Error updating product:', error);
        Alert.alert('Error', 'No se pudo actualizar el producto.');
      } else {
        setIsEditingModalVisible(false); 
        setProductToEdit(null);
        fetchProducts(setProducts);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    }
  };
  const handleDeleteProduct = async (productId) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('Productos')
                .delete()
                .eq('id', productId);
  
              if (error) {
                console.error('Error deleting product:', error);
                Alert.alert('Error', 'No se pudo eliminar el producto.');
              } else {
                fetchProducts(setProducts);
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  const handleSearch = async (text) => {
    try {
      let { data: products, error } = await supabase
        .from("Productos")
        .select("*")
        .ilike("nombre", `%${text}%`);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(products); // Actualiza el estado 'products'
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };2
  
  const handleAddToCart = async (productId) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
        Alert.alert("Inicia sesión", "Debes iniciar sesión para agregar productos al carrito.");
        return;
    }

    const userId = sessionData.session.user.id;

    try {
        const { data: existingItem, error: fetchError } = await supabase
            .from('Carrito')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .maybeSingle();

         if (fetchError) {
            console.error("Error checking cart:", fetchError);
            Alert.alert("Error", "No se pudo verificar el carrito: " + fetchError.message);
            return;
         }

        if (existingItem) {
            const newQuantity = existingItem.quantity + 1;
            const { error: updateError } = await supabase
                .from('Carrito')
                .update({ quantity: newQuantity })
                .eq('id', existingItem.id);

            if (updateError) {
                 console.error("Error updating quantity:", updateError);
                Alert.alert("Error", "No se pudo actualizar la cantidad en el carrito: " + updateError.message);
            } else {
                 
            }
        } else {
            const { error: insertError } = await supabase
                .from('Carrito')
                .insert({ user_id: userId, product_id: productId, quantity: 1 });

            if (insertError) {
                 console.error("Error adding to cart:", insertError);
                 if (insertError.code === '23505') {
                     Alert.alert("Error", "Este producto ya está en tu carrito.");
                 } else {
                     Alert.alert("Error", "No se pudo agregar el producto al carrito: " + insertError.message);
                 }
            } else {
                 
            }
        }
    } catch (error) {
         console.error("Exception adding to cart:", error);
         Alert.alert("Error", "Ocurrió un problema al agregar al carrito.");
    }
};

  //Para el LazyLoading
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setVisibleItemIds(prevVisibleItemIds => {
      const newVisibleItemIds = new Set(prevVisibleItemIds);
      viewableItems.forEach(item => {
        if (item.isViewable && item.item) { // item.item to ensure it's a product
          newVisibleItemIds.add(item.item.id);
        }
      });
      return newVisibleItemIds;
    });
  }, []);

  // Configuration for viewability
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50 // Load when 50% of the item is visible
  }).current;


  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image 
      source={{ uri: item.imagen }} 
      style={styles.productImage}
      />
      <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productPrice}>${item.precio}</Text>
      </View>

      <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item.id)}
        >
          <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://www.bbva.mx/')} style={styles.buyButton}> 
        <Text style={styles.buyButtonText}>Comprar</Text> 
      </TouchableOpacity>
      
      {userRole === 'admin' && (
        <>
        <Button
          title="Editar" 
          onPress={() => {
          setProductToEdit(item);
          setIsEditingModalVisible(true);
          }} 
        />
        <Button 
          title="Eliminar" 
          color="red"
          onPress={() => handleDeleteProduct(item.id)} 
          />
          </>
        )}
        
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
        <Image source={require('../assets/menu.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <MenuDesplegable isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <View style={styles.iconsContainer}>
        <SearchIcon
          onSearch={handleSearch}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <View style={{ marginLeft: 15 }}> 
          <Cart />
        </View>
        
        </View>
        </View>

        <View style={styles.carruselContainer}> 
        <Swiper 
        ref={swiperRef} 
        style={styles.carrusel} 
        loop 
        autoplay={false} 
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        >
        <Image source={require('../assets/Blog1.jpg')} style={styles.carruselImagen} />
        <Image source={require('../assets/Blog2.jpg')} style={styles.carruselImagen} />
        <Image source={require('../assets/Blog3.jpg')} style={styles.carruselImagen} />
        </Swiper>
        </View>
        
        <AddProductModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onAddProduct={handleAddProduct} 
        fetchProducts={fetchProducts}
        setProducts={setProducts}
        />

        <AddProductModal 
        isVisible={isEditingModalVisible} 
        onClose={() => { 
          setIsEditingModalVisible(false); 
          setProductToEdit(null); 
        }} 
        fetchProducts={fetchProducts}
        setProducts={setProducts}
        onAddProduct={handleUpdateProduct}
        product={productToEdit}
        />

        <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        numColumns={1}
        contentContainerStyle={styles.productList}
        />

        {userRole === 'admin' && (
        <Button style={styles.buttonsContainer}
        color={'#8B4513'}
        title="Agregar producto" 
        onPress={() => setIsModalVisible(true)} 
        />
        )}

          <View style={styles.navigationButtonsContainer}> 
            <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Nosotros')}>
              <Text style={styles.navigationButtonText}>Nosotros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Contacto')}>
              <Text style={styles.navigationButtonText}>Contacto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('BlogScreen')}>
              <Text style={styles.navigationButtonText}>Blog</Text>
            </TouchableOpacity>
          </View> 

    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 8, 
    },
    productList: {
      padding: 10,
    },
    productItem: {
      flex: 1,
      margin: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    productInfo: {
      padding: 10,
    },
    productName: {
      fontSize: 16,
    },
    productPrice: {
      fontSize: 14,
      color: '#8B4513',
    },
    buyButton: {
     backgroundColor: '#8B4513',
     padding: 15,
     borderRadius: 5,
     marginTop: 20,
     alignItems: 'center',
    },
    addToCartButton:{
     backgroundColor: '#8B4513',
     padding: 15,
     borderRadius: 5,
     marginTop: 20,
     alignItems: 'center',
    },
    addToCartButtonText:{
      color: '#fff',
     fontSize: 16,
     fontWeight: 'bold',
    },
    buyButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: 'bold',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    header: {
    flexDirection: "row", // Alinea los elementos en una fila
    justifyContent: "space-between", // Distribuye el espacio entre los elementos
    alignItems: "center", // Alinea los elementos verticalmente al centro
    backgroundColor: "#f2f2f2",
    padding: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  menuIcon: { // Nuevo estilo para el icono del menú
    width: 30,
    height: 30,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Alinea los íconos a la derecha 
  },
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
  carruselContainer: { 
    height: 200, // Ajusta la altura del contenedor
    marginBottom: 20,
  },
  carrusel: { 
    marginBottom: 20,
  },
  carruselImagen: {
    width: Dimensions.get('window').width, // Ancho de la pantalla
    height: '100%',
    resizeMode: 'cover',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)', 
    width: 8, 
    height: 8,
    borderRadius: 4, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 3, 
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#8B4513', 
    width: 8, 
    height: 8,
    borderRadius: 4, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 3, 
    marginBottom: 3,
  },
  });

export default ProductList;