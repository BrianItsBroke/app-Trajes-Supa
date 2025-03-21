import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const usePerfilViewModel = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error al obtener el usuario:', userError);
          return;
        }

        if (user) {
          const { data, error } = await supabase
            .from('usuarios') // Asegúrate de que esta es la tabla correcta
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error al obtener los datos del usuario:', error);
          } else {
            setUserData(data);
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading };
};

export default usePerfilViewModel;
