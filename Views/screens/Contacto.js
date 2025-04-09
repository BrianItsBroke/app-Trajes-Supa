import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ImageBackground, Alert } from 'react-native';
import email from 'react-native-email';
import { supabase } from '../lib/supabase';

const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState(null);

  useEffect(() => {
    const obtenerCorreoUsuario = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Obtener el usuario actual

        if (user) {
          setCorreoUsuario(user.email);
        }
      } catch (error) {
        console.error('Error al obtener el correo del usuario:', error);
      }
    };

    obtenerCorreoUsuario();
  }, []);

  const enviarEmail = () => {
    if (!correoUsuario) {
      Alert.alert('Error', 'No se pudo obtener tu correo electrónico.');
      return;
    }

    const to = ['isc_bvargas2021@accitesz.com']; // Destinatario (tu correo)
    const from = correoUsuario; // Remitente (correo del usuario)

    email(to, {
      cc: [from], // Incluir la dirección "from" en el campo "cc"
      subject: 'Nuevo mensaje de contacto',
      body: `Nombre: ${nombre}\nEmail: ${correo}\nMensaje: ${mensaje}`,
    }).catch(console.error);

    // Mostrar una alerta al usuario
    Alert.alert('Mensaje enviado', 'Gracias por contactarnos. Te responderemos pronto.');

    // Limpiar el formulario
    setNombre('');
    setCorreo('');
    setMensaje('');
  };

  return (
    <ImageBackground
      source={require('../assets/Login_image.png')} 
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
    <View style={styles.formSquare}>
      <Text style={styles.titulo}>Contáctanos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.inputArea}
        placeholder="Mensaje"
        value={mensaje}
        onChangeText={setMensaje}
        multiline
        numberOfLines={4}
      />

      <Button title="Enviar" color={'#8B4513'} onPress={enviarEmail} />
    </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  inputArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center', 
  },
  formSquare: {
    backgroundColor: '#ffff', // Color de fondo del cuadrado
    padding: 20,
    borderRadius: 10, // Ajusta el radio para controlar la redondez de las esquinas
    width: '100%', // Ocupa todo el ancho del contenedor padre
    // Agrega sombras si lo deseas (opcional)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    }
  }
});

export default Contacto;