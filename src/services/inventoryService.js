// Obtenemos la URL del Gateway desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const getInventoryData = async () => {
  try {
    // Al Gateway no le importa si atrás hay 3 microservicios, él nos agrupa todo
    const response = await fetch(`${API_URL}/catalogo/lista`); 
    
    if (!response.ok) {
      throw new Error('Error al obtener los datos del inventario');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};