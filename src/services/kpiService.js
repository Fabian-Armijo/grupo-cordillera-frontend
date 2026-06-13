const API_URL = import.meta.env.VITE_BFF_URL;

export const kpiService = {

  getDashboardMetrics: async () => {
    try {
      const token = localStorage.getItem('token');

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
  },

  // NUEVO MÉTODO
 getDefiniciones: async () => {
   try {

     const token = localStorage.getItem('token');

     console.log("API_URL:", API_URL);
     console.log("URL completa:", `${API_URL}/api/kpi/definiciones`);

     const response = await fetch(`${API_URL}/api/kpi/definiciones`, {
       method: 'GET',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });

     const data = await response.json();

     console.log("Respuesta KPIs:", data);

     return data;

   } catch (error) {
     console.error(error);
     throw error;
   }
 }
};