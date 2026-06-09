// Obtenemos la URL del Gateway desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_BFF_URL; 

export const getInventoryData = async () => {
  try {
    // 1. Rescatamos el token de la memoria del navegador
    const token = localStorage.getItem('token');

    // 2. Inyectamos el token en las cabeceras
    const response = await fetch(`${API_URL}/bff/catalogo/lista`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }); 
    
    if (!response.ok) {
      throw new Error('Error al obtener los datos del inventario');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};