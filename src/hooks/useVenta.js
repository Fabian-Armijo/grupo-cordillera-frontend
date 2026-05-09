import { useState } from 'react';
import { postCrearVenta } from '../services/ventaService';

export const useVenta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ventaExitosa, setVentaExitosa] = useState(false);

  const procesarVenta = async (datos) => {
    setLoading(true);
    setError(null);
    try {
      await postCrearVenta(datos);
      setVentaExitosa(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { procesarVenta, loading, error, ventaExitosa };
};