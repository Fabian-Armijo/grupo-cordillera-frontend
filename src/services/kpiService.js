const API_URL = import.meta.env.VITE_BFF_URL;

export const kpiService = {
  getDashboardMetrics: async () => {
    try {
      // 1. Rescatamos el token de la memoria del navegador
      const token = localStorage.getItem('token');

      // 2. Inyectamos el token en las cabeceras
      const response = await fetch(`${API_URL}/bff/kpis/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las métricas de KPIs desde el Gateway');
      }

      return await response.json();
    } catch (error) {
      console.error("Error de conexión en kpiService:", error);
      throw error;
    }
  }
};