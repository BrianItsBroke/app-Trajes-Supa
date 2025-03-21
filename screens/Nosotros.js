import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import useNosotrosViewModel from '../viewmodels/UseNosotrosViewModel';

const { width } = Dimensions.get('window');

const Nosotros = () => {
  const { openInstagram } = useNosotrosViewModel();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Nosotros.jpg')} style={styles.imagenN} />
      
      <ScrollView>
        <View style={styles.textoContainer}>
          <Text style={styles.titulo}>Sobre nosotros</Text>
          <Text style={styles.descripcion}>
            En Cataleya Swimwear, cada pieza está confeccionada con materiales suaves y de alta calidad 
            que se adaptan a tu cuerpo como una segunda piel.
          </Text>
        </View>

        <View style={styles.textoContainer}>
          <Text style={styles.subtittle}>Te ofrecemos:</Text>
        </View>

        <View style={styles.textoContainer}>
          <Text style={styles.descripcion}>Diseños exclusivos: Encuentra el traje de baño perfecto que refleje tu estilo único.</Text>
          <Text style={styles.descripcion}>Proceso sostenible de principio a fin: Nos preocupamos por el medio ambiente, por eso nuestros procesos son responsables y sostenibles.</Text>
          <Text style={styles.descripcion}>Materiales de alta calidad y durabilidad: Confeccionados para durar y resistir el paso del tiempo.</Text>
          <Text style={styles.descripcion}>Envíos rápidos: Recibe tu pedido rápidamente y disfruta de tu nuevo traje de baño.</Text>
        </View>

        <View style={styles.containerS}>
          <Text style={styles.sobreNosotrosText}>SÍGUENOS</Text>
          
          <View style={styles.row}>
            <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('cataleyaswimwear_')}> 
                <Image source={require('../assets/Logo_imagen.jpg')} style={styles.imagen} />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@cataleyaswimwear_</Text> 
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('karencendejass')}> 
                <Image source={require('../assets/Karen.jpg')} style={styles.imagen} />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@karencendejass</Text> 
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('garciia_m_')}>
                <Image source={require('../assets/melissa.jpg')} style={styles.imagen} />
                <View style={styles.sombreado}>
                  <Text style={styles.instagramText}>@garciia_m_</Text> 
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.cuadro}>
              <TouchableOpacity onPress={() => openInstagram('ale_cendejas')}>
                <Image source={require('../assets/Ale.jpg')} style={styles.imagen} />
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
    padding: 0,
  },
  imagenN: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  textoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 20,
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
  subtittle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cuadro: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 12,
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sombreado: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerS: {
    flex: 1,
  },
  sobreNosotrosText: {
    fontSize: 35,
    textAlign: 'center',
    padding: 25,
  },
});

export default Nosotros;
