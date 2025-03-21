import { Linking } from 'react-native';

const useNosotrosViewModel = () => {
  const openInstagram = (username) => {
    const url = `https://instagram.com/${username}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("No se pudo abrir la URL: " + url);
        }
      })
      .catch((err) => console.error('Error al abrir la URL:', err));
  };

  return { openInstagram };
};

export default useNosotrosViewModel;
