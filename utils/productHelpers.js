
import { supabase } from '../lib/supabase'; 

export const fetchProducts = async (setProducts) => { 
  try {
    let { data: products, error } = await supabase
      .from('Productos')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(products); 
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};