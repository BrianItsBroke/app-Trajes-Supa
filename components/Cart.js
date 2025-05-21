import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { supabase } from '../lib/supabase'; 
import { Linking } from 'react-native';

const CartItem = ({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity, isLoading }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.Productos?.imagen || 'URL_IMAGEN_POR_DEFECTO_SI_FALLA' }}
        style={styles.cartItemImage}
        onError={(e) => console.log("Error cargando imagen:", e.nativeEvent.error)}
      />
      <View style={styles.productInfo}>
        {/* Nombre del producto */}
        <Text style={styles.cartItemNombre} numberOfLines={2}>{item.Productos?.nombre || 'Nombre no disponible'}</Text>
        {/* Precio del producto */}
        <Text style={styles.cartItemPrecio}>${item.Productos?.precio?.toFixed(2) || '0.00'}</Text>
        {/* Acciones: Cantidad y Eliminar */}
        <View style={styles.quantityActions}>
            {/* Contenedor de Cantidad (+ / -) */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={onDecreaseQuantity} style={styles.quantityButton} disabled={isLoading}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={onIncreaseQuantity} style={styles.quantityButton} disabled={isLoading}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Botón Eliminar */}
            <TouchableOpacity onPress={onRemove} style={styles.removeButton} disabled={isLoading}>
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );


const Cart = () => {
  
  const [cartItems, setCartItems] = useState([]); 
  const [subtotal, setSubtotal] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);     
  const [userId, setUserId] = useState(null);            

  
   useEffect(() => {
        const getSessionData = async () => {
             const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) { console.error('Error getting session:', sessionError); return; }
            setUserId(sessionData?.session?.user?.id ?? null);
        };
        getSessionData();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUserId = session?.user?.id ?? null;
            setUserId(currentUserId);

            if (!currentUserId) {
                setCartItems([]);
                setIsCartVisible(false);
            }
        });
        // Limpia el listener al desmontar
        return () => { authListener?.subscription.unsubscribe(); };
    }, []);

    
  const fetchCart = useCallback(async (showLoadingIndicator = true) => {
    // Si no hay usuario, limpia el carrito y termina
    if (!userId) { setCartItems([]); return; }

    // Muestra indicador de carga si se solicita
    if (showLoadingIndicator) setIsLoading(true);
    try {
      // Consulta a Supabase para obtener items del carrito y datos del producto relacionado
      const { data, error } = await supabase
          .from('Carrito')
          .select('*, Productos (*)') 
          .eq('user_id', userId)      
          .order('create_at', { ascending: true }); 

      if (error) {
        console.error('Error al obtener el carrito (fetchCart):', error);
        setCartItems([]); 
      } else {
        setCartItems(data || []); 
      }
    } catch (error) {
      console.error('Excepción al obtener el carrito:', error);
      setCartItems([]); 
    } finally {
      
      if (showLoadingIndicator) setIsLoading(false);
    }
  }, [userId]); 

  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);


 useEffect(() => {
    
    if (!userId) { return; }

    
    const channel = supabase
        .channel(`public:Carrito:user_id=eq.${userId}`)
        .on(
            'postgres_changes',
            {
                event: '*', 
                schema: 'public',
                table: 'Carrito',
                filter: `user_id=eq.${userId}` 
            },
            (payload) => {
                
                fetchCart(false);
            }
        )
        .subscribe((status, err) => { 
             if (status === 'CHANNEL_ERROR' || err) { console.error('[Realtime] Channel Error:', err); }
         });

    
    return () => {
        if (channel) {
            supabase.removeChannel(channel); 
        }
    };
 }, [userId, fetchCart]); 


  useEffect(() => {
    let total = 0;
    cartItems.forEach(item => {
      
      if (item.Productos && typeof item.Productos.precio === 'number' && typeof item.quantity === 'number') {
        total += item.Productos.precio * item.quantity;
      }
    });
    setSubtotal(total); 
  }, [cartItems]);


  
  const removeFromCart = async (productId) => {
    if (!userId) return; 

    
    const originalCartItems = [...cartItems];
    
    const itemToRemove = originalCartItems.find(item => item.product_id === productId);
    if (!itemToRemove) {
        console.warn(`[removeFromCart] Intento de eliminar item no encontrado localmente: ${productId}`);
        return; 
    }

    setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));

    
    try {
      setIsLoading(true); 
      const { error } = await supabase
        .from('Carrito')
        .delete()
        .eq('id', itemToRemove.id) 
        .eq('user_id', userId);    

      
      if (error) {
        console.error('[removeFromCart] Error de Supabase:', error);
        Alert.alert('Error', `No se pudo eliminar: ${error.message}`);
      
        setCartItems(originalCartItems);
      }
      
    } catch (error) {
      console.error('[removeFromCart] Excepción:', error);
      Alert.alert('Error', 'Problema al eliminar.');
      
      setCartItems(originalCartItems);
    } finally {
      setIsLoading(false); 
    }
  };

  
  const updateQuantity = async (productId, change) => {
    if (!userId) return; 

    
    const originalCartItems = [...cartItems];
    const itemIndex = originalCartItems.findIndex(item => item.product_id === productId);
    if (itemIndex === -1) {
         console.warn(`[updateQuantity] Intento de actualizar item no encontrado localmente: ${productId}`);
         return;
    }

    const currentItem = originalCartItems[itemIndex];
    const originalQuantity = currentItem.quantity;
    const newQuantity = Math.max(originalQuantity + change, 1); 

    
    if (newQuantity === originalQuantity && change < 0) return;

    
    setCartItems(prevItems =>
        prevItems.map(item =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity } 
                : item 
        )
    );

    
    try {
        setIsLoading(true); 
        const { error } = await supabase
            .from('Carrito')
            .update({ quantity: newQuantity }) 
            .eq('id', currentItem.id)        
            .eq('user_id', userId);           

        if (error) {
            console.error('[updateQuantity] Error de Supabase:', error);
            Alert.alert('Error', `No se pudo actualizar: ${error.message}`);
            setCartItems(originalCartItems);
        }
        
    } catch (error) {
        console.error('[updateQuantity] Excepción:', error);
        Alert.alert('Error', 'Problema al actualizar.');
        
        setCartItems(originalCartItems);
    } finally {
         setIsLoading(false);
    }
  };

  
  const increaseQuantity = (productId) => updateQuantity(productId, 1);
  const decreaseQuantity = (productId) => updateQuantity(productId, -1);

  
  const toggleCartVisibility = () => {
    if (userId) { 
      setIsCartVisible(!isCartVisible);
    } else {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para ver tu carrito.");
    }
  };

  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      {/* Botón en el Header para abrir el carrito */}
      <TouchableOpacity onPress={toggleCartVisibility}>
        <Image source={require('../assets/bag.png')} style={styles.icon} />
        {/* Badge contador (solo visible si hay items) */}
        {totalItems > 0 && (
             <View style={styles.badgeContainer}>
                 <Text style={styles.badgeText}>{totalItems}</Text>
             </View>
         )}
      </TouchableOpacity>

      {/* Modal que muestra el contenido del carrito */}
      <Modal
        animationType="slide" 
        transparent={false}   
        visible={isCartVisible} 
        onRequestClose={toggleCartVisibility} 
      >
        {/* SafeAreaView para respetar áreas seguras del dispositivo */}
        <SafeAreaView style={styles.safeArea}>
          {/* Configura la barra de estado */}
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
          {/* Header dentro del Modal */}
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Productos ({cartItems.length})</Text>
             <TouchableOpacity onPress={toggleCartVisibility} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* Contenido principal del carrito (lista de items) */}
          {/* Muestra "Cargando..." solo al inicio si el carrito está vacío */}
          {isLoading && cartItems.length === 0 ? (
            <View style={styles.centeredMessage}><Text>Cargando...</Text></View>
          ) :
          // Muestra "Vacío" si no está cargando y no hay items
          !isLoading && cartItems.length === 0 ? (
            <View style={styles.centeredMessage}><Text style={styles.emptyCartMessage}>Tu carrito está vacío</Text></View>
          ) : (
            // Muestra la lista de items si hay alguno
            <ScrollView contentContainerStyle={styles.cartContent}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id} // Usa el ID único de la fila del carrito como key
                  item={item}
                  // Pasa las funciones controladoras al componente CartItem
                  onRemove={() => removeFromCart(item.product_id)}
                  onIncreaseQuantity={() => increaseQuantity(item.product_id)}
                  onDecreaseQuantity={() => decreaseQuantity(item.product_id)}
                  isLoading={isLoading} // Pasa el estado de carga (opcional)
                />
              ))}
               {/* Indicador sutil si isLoading es true durante una actualización */}
               {isLoading && cartItems.length > 0 && <Text style={styles.loadingMoreText}>Actualizando...</Text>}
            </ScrollView>
          )}

          {cartItems.length > 0 && (
             <View style={styles.cartFooter}>
                <Text style={styles.subtotalText}>SUBTOTAL: ${subtotal.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.bbva.mx/')} style={styles.buyButton} >
                  <Text style={styles.buyButtonText}>COMPRAR AHORA</Text>
                </TouchableOpacity>
             </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    loadingMoreText: { textAlign: 'center', padding: 10, color: '#888', fontStyle: 'italic', },
    icon: { width: 28, height: 28, },
    badgeContainer: { position: 'absolute', right: -8, top: -8, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1, },
    badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold', },
    safeArea: { flex: 1, backgroundColor: '#ffffff', },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', },
    closeButton: { padding: 5, },
    closeButtonText: { fontSize: 16, color: '#8B4513', fontWeight: '500', },
    cartContent: { paddingHorizontal: 15, paddingBottom: 20, flexGrow: 1, },
    cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', },
    cartItemImage: { width: 80, height: 100, resizeMode: 'cover', marginRight: 15, borderRadius: 4, },
    productInfo: { flex: 1, justifyContent: 'space-between', },
    cartItemNombre: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 5, },
    cartItemPrecio: { fontSize: 16, color: '#8B4513', fontWeight: 'bold', marginBottom: 12, },
    quantityActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', },
    quantityButton: { backgroundColor: '#f0f0f0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: '#ddd', },
    quantityButtonText: { fontSize: 18, fontWeight: 'bold', color: '#555', },
    quantityText: { fontSize: 16, fontWeight: 'bold', minWidth: 30, textAlign: 'center', marginHorizontal: 12, color: '#333', },
    removeButton: { paddingVertical: 5, paddingHorizontal: 8, },
    removeButtonText: { color: '#CC0000', fontSize: 14, fontWeight: '500', textTransform: 'uppercase', },
    centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    emptyCartMessage: { fontSize: 18, color: '#666', textAlign: 'center', },
    cartFooter: { paddingVertical: 15, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0', backgroundColor: '#ffffff', },
    subtotalText: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'left', marginBottom: 15, textTransform: 'uppercase', },
    buyButton: { backgroundColor: '#8B4513', paddingVertical: 14, borderRadius: 5, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4, },
    buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', },
});

export default Cart;

