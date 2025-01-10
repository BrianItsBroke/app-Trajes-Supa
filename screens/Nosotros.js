import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

const openInstagram = (username) => {
    const url = `https://instagram.com/${username}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("No se pudo abrir la URL: " + url);
      }
    });
  };

const Nosotros = () => {
  return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/Nosotros.jpg') } 
        style={styles.imagenN}
      />
     <ScrollView>
      {/* Sección central con el texto */}
      <View style={styles.textoContainer}>
        <Text style={styles.titulo}>Sobre nosotros</Text>
        <Text style={styles.descripcion}>En Cataleya Swimwear, cada pieza está confeccionada con materiales suaves y de alta calidad que se adaptan a tu cuerpo como una segunda piel.</Text>
      </View>
      <View style={styles.textoContainer}>
      <Text style={styles.subtittle}>Te ofrecemos:</Text>
      </View>
      <View style={styles.textoContainer}>
      <Text style={styles.descripcion}>Diseños exclusivos: Encuentra el traje de baño perfecto que refleje tu estilo único.</Text>
      </View>
      <View style={styles.textoContainer}>
      <Text style={styles.descripcion}>Proceso sostenible de principio a fin: Nos preocupamos por el medio ambiente, por eso nuestros procesos son responsables y sostenibles.</Text>
      </View>
      <View style={styles.textoContainer}>
      <Text style={styles.descripcion}>Materiales de alta calidad y durabilidad: Confeccionados para durar y resistir el paso del tiempo.</Text>
      </View>
      <View style={styles.textoContainer}>
      <Text style={styles.descripcion}>Envíos rápidos: Recibe tu pedido rápidamente y disfruta de tu nuevo traje de baño.</Text>
      </View>

      <View style={styles.containerS}>
          <Text style={styles.sobreNosotrosText}>SIGUENOS</Text>
            <View style={styles.row}>
              <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('cataleyaswimwear_')}> 
                <Image 
                  source={require('../assets/Logo_imagen.jpg')} 
                  style={styles.imagen}
                />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@cataleyaswimwear_</Text> 
                </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('karencendejass')}> 
                <Image 
                  source={require('../assets/Karen.jpg')} 
                  style={styles.imagen}
                />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@karencendejass</Text> 
                </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('garciia_m_')}>
                <Image 
                  source={require('../assets/melissa.jpg')} 
                  style={styles.imagen}
                />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@garciia_m_</Text> 
                </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('ale_cendejas')}>
                <Image 
                  source={require('../assets/Ale.jpg')} 
                  style={styles.imagen}
                />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@ale_cendejas</Text> 
                </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  imagenN: {
    width: 500,
    height: 190,
    marginBottom: 20,
    resizeMode:'cover',
    alignItems:'center'
  },
  textoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'justify',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  subtittle:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:10
  },
  containerImagen: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',   
    alignItems:'center',
    margin:20,
  },
  cuadro: {
    width: (width - 60) / 2, // Calcula el ancho del cuadro para que quepan 2 en una fila
    aspectRatio: 1, // Mantiene la proporción cuadrada
    overflow: 'hidden',
    borderRadius:12,
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ajusta la imagen al cuadro manteniendo la proporción
  },
  instagramSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  sombreado: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Color del sombreado con transparencia
    borderRadius: 10, // Bordes redondeados (opcional)
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 132,
  },
  instagramText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop:10
  },
  containerS:{
    flex:1
  },
  sobreNosotrosText:{
    fontSize:35,
    textAlign:'center',
    padding:25,
  },
});

export default Nosotros;