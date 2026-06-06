import { useState, useEffect } from 'react';
import { kpiService } from '../services/kpiService';

export const useKpis = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoading(true);
        // Aquí es donde fallaba porque no encontraba "kpiService"
        const data = await kpiService.getDashboardMetrics();
        setKpis(data);
      } catch (err) {
        setError(err.message || 'Error al cargar métricas');
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  return { kpis, loading, error };
};