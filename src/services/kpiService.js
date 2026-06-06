
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const kpiService = {
  getDashboardMetrics: async () => {
    try {

      const response = await fetch(`${API_URL}/kpis/dashboard`);

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