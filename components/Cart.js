import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';


const CartItem = ({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity }) => (
  <View style={styles.cartItem}>
    <Image source={{uri: item.imagen}} style={styles.cartItemImage} />
    <View style={styles.productInfo}>
      <Text style={styles.cartItemNombre}>{item.nombre}</Text>
      <Text style={styles.cartItemPrecio}>${item.precio}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={onDecreaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={onIncreaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Cart = ({ cartItems, setCartItems }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        
        const { data: user, error: userError } = await supabase.auth.getSession();
            if (userError|| !user) {
              console.error('Error de autenticación:', userError);
              Alert.alert('Error', 'No se pudo obtener la sesión del usuario.'); 
              return;       
            }
        const userId = user.id;
        console.log(user.id)
        const { data, error } = await supabase
          .from('Carrito')
          .select('*, Productos (*)') // Obtener la información del producto con un join
          .eq('user_id', "ae6e8029-01eb-4f9c-ac2d-91c78fa45c0f");
          console.log(data)
        if (error) {
          console.error('Error al obtener el carrito:', error);
          // Manejar el error (mostrar un mensaje al usuario, por ejemplo)
        } else {
          
          setCartItems(data);
        }
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
        // Manejar el error
      }
    };
  
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const { error } = await supabase
        .from('Carrito')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
  
      if (error) {
        console.error('Error al eliminar del carrito:', error);
        // Manejar el error
      } else {
        // Puedes actualizar el estado local 'cartItems' o volver a cargar el carrito desde la base de datos
        // Aquí, simplemente filtramos el item eliminado del estado local:
        setCartItems(cartItems.filter(item => item.product_id !== productId));
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      // Manejar el error
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      // Obtener la cantidad actual del producto en el carrito
      const { data: existingItem, error: existingItemError } = await supabase
        .from('Carrito')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId);
  
      if (existingItemError) {
        console.error('Error al obtener la cantidad del producto:', existingItemError);
        Alert.alert('Error', 'No se pudo aumentar la cantidad del producto.');
      } else if (existingItem.length > 0) {
        // Aumentar la cantidad en 1
        const { error: updateError } = await supabase
          .from('carrito')
          .update({ quantity: existingItem[0].quantity + 1 })
          .eq('id', existingItem[0].id);
  
        if (updateError) {
          console.error('Error al actualizar la cantidad:', updateError);
          Alert.alert('Error', 'No se pudo aumentar la cantidad del producto.');
        }
      }
    } catch (error) {
      console.error('Error al aumentar la cantidad:', error);
      Alert.alert('Error', 'No se pudo aumentar la cantidad del producto.');
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      // Obtener la cantidad actual del producto en el carrito
      const { data: existingItem, error: existingItemError } = await supabase
        .from('Carrito')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId);
  
      if (existingItemError) {
        console.error('Error al obtener la cantidad del producto:', existingItemError);
        Alert.alert('Error', 'No se pudo disminuir la cantidad del producto.');
      } else if (existingItem.length > 0) {
        // Disminuir la cantidad en 1, pero no menos de 1
        const newQuantity = Math.max(existingItem[0].quantity - 1, 1); 
        const { error: updateError } = await supabase
          .from('Carrito')
          .update({ quantity: newQuantity })
          .eq('id', existingItem[0].id);
  
        if (updateError) {
          console.error('Error al actualizar la cantidad:', updateError);
          Alert.alert('Error', 'No se pudo disminuir la cantidad del producto.');
        }
      }
    } catch (error) {
      console.error('Error al disminuir la cantidad:', error);
      Alert.alert('Error', 'No se pudo disminuir la cantidad del producto.');
    }
  };
  
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
  <View>
    <TouchableOpacity onPress={toggleCartVisibility}> 
      <Image source={require('../assets/bag.png')} style={styles.icon} /> 
    </TouchableOpacity>

    {isCartVisible && (
    <View style={styles.cartContainer}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Carrito de compras</Text>
        <TouchableOpacity onPress={toggleCartVisibility} style={styles.closeButton}>
        
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartMessage}>El carrito está vacío</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.cartContent}>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeFromCart(item.id)}
              onIncreaseQuantity={() => increaseQuantity(item.id)}
              onDecreaseQuantity={() => decreaseQuantity(item.id)}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.cartFooter}>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  cartContainer: {
    position: 'absolute',
    top: 45, 
    left:-350,
    width: '950%',
    backgroundColor: '#fff',
    zIndex: 2, 
    padding: 20,
    height: '1700%', // Altura fija para el carrito
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS y Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight:'bold',
    marginBottom: 30, 
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  cartContent: {
    flex: 1, // Permite que el contenido sea desplazable
    padding: 10, // Espacio interno
  },
  cartItem: {
    flexDirection: 'row', 
    alignItems: 'flex-start', // Alinea los elementos al inicio verticalmente
    marginBottom: 20, // Espacio entre cada item
    borderBottomWidth: 1, // Separador entre items
    borderBottomColor: '#eee', 
    paddingBottom: 15, // Espacio inferior para cada item
  },
  cartItemImage: {
    width: 120,
    height: 150,
    resizeMode: 'cover',
    marginRight: 15,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1, // Ocupa el espacio restante
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton:   
  {
    alignSelf: 'flex-start', // Alinea el botón a la izquierda
  },
  removeButtonText: {
    color: 'red',
    fontSize: 14,
  },
});

export default Cart;