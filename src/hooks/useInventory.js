import { useState, useEffect } from 'react';
import { getInventoryData } from '../services/inventoryService';

export const useInventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const result = await getInventoryData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al cargar la página

  // El hook devuelve todo lo que la vista necesita
  return { data, loading, error };
};