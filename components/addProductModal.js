import React from 'react';
import { Button, Modal, StyleSheet, TextInput, View, Text } from 'react-native';
import useAddProductViewModel from '../viewmodels/AddProductViewModel';

const AddProductModal = ({ isVisible, onClose, onAddProduct, fetchProducts, setProducts }) => {
  const {
    nombre,
    setNombre,
    precio,
    setPrecio,
    imagen,
    setImagen,
    handleSubmit,
  } = useAddProductViewModel(onAddProduct, fetchProducts, setProducts);

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Agregar Nuevo Producto</Text>
        <TextInput
          placeholder="Nombre del producto"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="URL de la imagen"
          value={imagen}
          onChangeText={setImagen}
          style={styles.input}
        />
        <View style={styles.buttonsContainer}>
          <Button color={'green'} title="Agregar" onPress={handleSubmit} />
          <Button color={'red'} title="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  title: {
    justifyContent: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
});

export default AddProductModal;