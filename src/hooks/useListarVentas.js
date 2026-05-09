import { useState, useEffect } from 'react';
import { getListaVentas } from '../services/ventaService';

export const useListarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const data = await getListaVentas();
      setVentas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return { ventas, loading, error, refrescar: fetchVentas };
};