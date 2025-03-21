import { useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useMenuDesplegableViewModel = (isVisible, onClose) => {
  const translateY = useRef(new Animated.Value(-200)).current;

  Animated.timing(translateY, {
    toValue: isVisible ? 0 : -200,
    duration: 300,
    useNativeDriver: true,
  }).start();

  const navigation = useNavigation();

  const navigateTo = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  return {
    translateY,
    navigateTo,
  };
};

export default useMenuDesplegableViewModel;