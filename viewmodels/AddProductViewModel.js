import { useState } from 'react';

const useAddProductViewModel = (onAddProduct, fetchProducts, setProducts) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');

  const handleSubmit = () => {
    onAddProduct({ nombre, precio, imagen });
    fetchProducts(setProducts);
    setNombre('');
    setPrecio('');
    setImagen('');
  };

  return {
    nombre,
    setNombre,
    precio,
    setPrecio,
    imagen,
    setImagen,
    handleSubmit,
  };
};

export default useAddProductViewModel;