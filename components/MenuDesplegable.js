import React, { useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenuDesplegable = ({ isVisible, onClose }) => {
  const translateY = useRef(new Animated.Value(-200)).current; 

  Animated.timing(translateY, {
    toValue: isVisible ? 0 : -200,
    duration: 300,
    useNativeDriver: true,
  }).start();

  const navigation = useNavigation();

  return (
    <Animated.View style={[styles.menuContainer, { transform: [{ translateY }], opacity: isVisible ? 1 : 0 },]}>
      <View style={styles.menuHeader}> 
        <TouchableOpacity onPress={onClose}> 
          <Image source={require('../assets/menu.png')} style={styles.closeIcon} /> 
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); navigation.navigate('Perfil'); }}>
        <Text>Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); navigation.navigate('CerrarSesion'); }}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 10, 
    left: 10,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  menuItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuHeader: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeIcon: { 
    width: 24, 
    height: 24, 
  },
});

export default MenuDesplegable;