import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './screens/ProductList';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Nosotros from './screens/Nosotros';
import Contacto from './screens/Contacto';
import BlogScreen from './screens/BlogScreen';
import DetalleBlog from './screens/DetalleBlog';
import CerrarSesion from './screens/CerrarSesion';
import Perfil from './screens/Perfil';

const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="ProductList" component={ProductList}/>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="Nosotros" component={Nosotros}/>
      <Stack.Screen name="Contacto" component={Contacto}/>
      <Stack.Screen name="BlogScreen" component={BlogScreen}/>
      <Stack.Screen name="DetalleBlog" component={DetalleBlog}/>
      <Stack.Screen name="CerrarSesion" component={CerrarSesion}/>
      <Stack.Screen name="Perfil" component={Perfil}/>
    </Stack.Navigator>
  );
};
export default StackNavigator;