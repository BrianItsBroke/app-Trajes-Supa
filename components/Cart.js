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
import { supabase } from '../lib/supabase'; // Asegúrate que la ruta sea correcta

// --- Componente Hijo: CartItem ---
// Muestra cada producto dentro del carrito
const CartItem = ({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity, isLoading }) => ( // isLoading opcional para deshabilitar botones
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

// --- Componente Principal: Cart ---
// Gestiona el estado del carrito, la visibilidad y las interacciones
const Cart = () => {
  // --- Estados del Componente ---
  const [cartItems, setCartItems] = useState([]); // Array de items en el carrito
  const [subtotal, setSubtotal] = useState(0);   // Subtotal calculado
  const [isCartVisible, setIsCartVisible] = useState(false); // Visibilidad del modal del carrito
  const [isLoading, setIsLoading] = useState(false);      // Indicador de carga general o de operaciones
  const [userId, setUserId] = useState(null);             // ID del usuario autenticado

  // --- Efecto para obtener Sesión y User ID ---
   useEffect(() => {
        const getSessionData = async () => {
             const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) { console.error('Error getting session:', sessionError); return; }
            setUserId(sessionData?.session?.user?.id ?? null);
        };
        getSessionData();
        // Escucha cambios en el estado de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUserId = session?.user?.id ?? null;
            setUserId(currentUserId);
            // Si el usuario cierra sesión, limpia el carrito y cierra el modal
            if (!currentUserId) {
                setCartItems([]);
                setIsCartVisible(false);
            }
        });
        // Limpia el listener al desmontar
        return () => { authListener?.subscription.unsubscribe(); };
    }, []);

  // --- Función para Cargar el Carrito desde Supabase ---
  // useCallback para optimizar y usar como dependencia en otros efectos
  const fetchCart = useCallback(async (showLoadingIndicator = true) => {
    // Si no hay usuario, limpia el carrito y termina
    if (!userId) { setCartItems([]); return; }

    // Muestra indicador de carga si se solicita
    if (showLoadingIndicator) setIsLoading(true);
    try {
      // Consulta a Supabase para obtener items del carrito y datos del producto relacionado
      const { data, error } = await supabase
          .from('Carrito')
          .select('*, Productos (*)') // Join con la tabla Productos
          .eq('user_id', userId)      // Filtra por el usuario actual
          .order('create_at', { ascending: true }); // Ordena por fecha (verifica nombre 'create_at')

      if (error) {
        console.error('Error al obtener el carrito (fetchCart):', error);
        setCartItems([]); // Limpia en caso de error
      } else {
        setCartItems(data || []); // Actualiza el estado con los datos obtenidos
      }
    } catch (error) {
      console.error('Excepción al obtener el carrito:', error);
      setCartItems([]); // Limpia en caso de excepción
    } finally {
      // Oculta indicador de carga si se mostró
      if (showLoadingIndicator) setIsLoading(false);
    }
  }, [userId]); // Esta función depende del userId

  // --- Efecto para Carga Inicial del Carrito ---
  // Se ejecuta cuando el componente se monta o cuando fetchCart (o userId) cambian
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

 // --- Efecto para Suscripción Realtime ---
 // Escucha cambios en la tabla Carrito para mantener la UI sincronizada
 useEffect(() => {
    // No configura la suscripción si no hay usuario
    if (!userId) { return; }

    // Crea un canal específico para la tabla Carrito filtrado por usuario
    const channel = supabase
        .channel(`public:Carrito:user_id=eq.${userId}`)
        .on(
            'postgres_changes',
            {
                event: '*', // Escucha cualquier evento (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'Carrito',
                filter: `user_id=eq.${userId}` // Filtro crucial para escuchar solo cambios propios
            },
            (payload) => {
                // Cuando llega un cambio, vuelve a cargar el carrito
                // El 'false' evita mostrar el indicador de carga grande para actualizaciones pequeñas
                fetchCart(false);
            }
        )
        .subscribe((status, err) => { // Maneja el estado de la conexión del canal
             if (status === 'CHANNEL_ERROR' || err) { console.error('[Realtime] Channel Error:', err); }
             // Puedes añadir logs para otros estados si es necesario (SUBSCRIBED, TIMED_OUT, etc.)
         });

    // Función de limpieza: se ejecuta al desmontar o cambiar userId
    return () => {
        if (channel) {
            supabase.removeChannel(channel); // Elimina el canal para liberar recursos
        }
    };
 }, [userId, fetchCart]); // Depende de userId y fetchCart

  // --- Efecto para Calcular el Subtotal ---
  // Se ejecuta cada vez que cambia el array cartItems
  useEffect(() => {
    let total = 0;
    cartItems.forEach(item => {
      // Suma el precio * cantidad de cada item válido
      if (item.Productos && typeof item.Productos.precio === 'number' && typeof item.quantity === 'number') {
        total += item.Productos.precio * item.quantity;
      }
    });
    setSubtotal(total); // Actualiza el estado del subtotal
  }, [cartItems]);


  // --- Funciones de Modificación con OPTIMISTIC UI ---

  // Eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    if (!userId) return; // Requiere usuario logueado

    // 1. Guarda el estado actual para posible reversión
    const originalCartItems = [...cartItems];
    // Encuentra el item a eliminar (necesitamos su ID de fila)
    const itemToRemove = originalCartItems.find(item => item.product_id === productId);
    if (!itemToRemove) {
        console.warn(`[removeFromCart] Intento de eliminar item no encontrado localmente: ${productId}`);
        return; // Evita errores si el item ya no está por alguna razón
    }

    // 2. Actualización Optimista: Modifica el estado local *antes* de llamar a Supabase
    setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));

    // 3. Llama a Supabase en segundo plano para eliminar en la BD
    try {
      setIsLoading(true); // Indicador sutil de operación en curso (opcional)
      const { error } = await supabase
        .from('Carrito')
        .delete()
        .eq('id', itemToRemove.id) // Identifica la fila por su ID primario
        .eq('user_id', userId);    // Doble verificación por seguridad (RLS ya lo hace)

      // 4. Maneja la respuesta de Supabase
      if (error) {
        console.error('[removeFromCart] Error de Supabase:', error);
        Alert.alert('Error', `No se pudo eliminar: ${error.message}`);
        // 5. REVIERTE: Si Supabase falló, restaura el estado local original
        setCartItems(originalCartItems);
      }
      // Si no hubo error, la UI ya está correcta. Realtime puede confirmar después.
    } catch (error) {
      console.error('[removeFromCart] Excepción:', error);
      Alert.alert('Error', 'Problema al eliminar.');
      // 5. REVIERTE: También revierte en caso de excepción inesperada
      setCartItems(originalCartItems);
    } finally {
      setIsLoading(false); // Quita el indicador de operación en curso
    }
  };

  // Actualizar la cantidad de un producto
  const updateQuantity = async (productId, change) => {
    if (!userId) return; // Requiere usuario

    // 1. Guarda estado original y encuentra el item a actualizar
    const originalCartItems = [...cartItems];
    const itemIndex = originalCartItems.findIndex(item => item.product_id === productId);
    if (itemIndex === -1) {
         console.warn(`[updateQuantity] Intento de actualizar item no encontrado localmente: ${productId}`);
         return;
    }

    const currentItem = originalCartItems[itemIndex];
    const originalQuantity = currentItem.quantity;
    const newQuantity = Math.max(originalQuantity + change, 1); // Cantidad mínima es 1

    // Si no hay cambio real (ej. intentar bajar de 1), no hace nada
    if (newQuantity === originalQuantity && change < 0) return;

    // 2. Actualización Optimista: Modifica el estado local inmediatamente
    setCartItems(prevItems =>
        prevItems.map(item =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity } // Actualiza la cantidad del item correcto
                : item // Deja los demás items igual
        )
    );

    // 3. Llama a Supabase en segundo plano para actualizar la BD
    try {
        setIsLoading(true); // Indicador sutil (opcional)
        const { error } = await supabase
            .from('Carrito')
            .update({ quantity: newQuantity }) // Actualiza solo la cantidad
            .eq('id', currentItem.id)        // Identifica la fila por su ID
            .eq('user_id', userId);           // Doble verificación

        // 4. Maneja la respuesta
        if (error) {
            console.error('[updateQuantity] Error de Supabase:', error);
            Alert.alert('Error', `No se pudo actualizar: ${error.message}`);
            // 5. REVIERTE: Restaura el estado local original si Supabase falló
            setCartItems(originalCartItems);
        }
        // Si no hubo error, la UI ya está correcta.
    } catch (error) {
        console.error('[updateQuantity] Excepción:', error);
        Alert.alert('Error', 'Problema al actualizar.');
        // 5. REVIERTE: Restaura en caso de excepción
        setCartItems(originalCartItems);
    } finally {
         setIsLoading(false); // Quita indicador
    }
  };

  // Funciones helper que llaman a updateQuantity
  const increaseQuantity = (productId) => updateQuantity(productId, 1);
  const decreaseQuantity = (productId) => updateQuantity(productId, -1);

  // --- Control de Visibilidad del Modal ---
  const toggleCartVisibility = () => {
    if (userId) { // Solo abre si hay usuario
      setIsCartVisible(!isCartVisible);
    } else {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para ver tu carrito.");
    }
  };

  // --- Renderizado del Componente ---
  // Calcula el número total de items (sumando cantidades) para el badge
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
        animationType="slide" // Animación al aparecer/desaparecer
        transparent={false}   // Fondo opaco
        visible={isCartVisible} // Controlado por el estado
        onRequestClose={toggleCartVisibility} // Botón atrás de Android
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

          {/* Footer del Carrito (Subtotal y Botón Comprar) */}
          {/* Solo se muestra si hay items en el carrito */}
          {cartItems.length > 0 && (
             <View style={styles.cartFooter}>
                <Text style={styles.subtotalText}>SUBTOTAL: ${subtotal.toFixed(2)}</Text>
                <TouchableOpacity style={styles.buyButton} disabled={isLoading}>
                  <Text style={styles.buyButtonText}>COMPRAR AHORA</Text>
                </TouchableOpacity>
             </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

// --- ESTILOS ---
// (Los mismos estilos que tenías en la versión anterior con Modal deberían funcionar bien)
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