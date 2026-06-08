const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// 1. Exportar la función para crear ventas
export const postCrearVenta = async (datosVenta) => {
  try {
    // Rescatamos el token de la memoria del navegador
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/bff/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Inyectamos el carnet de seguridad
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosVenta),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar la venta');
    }

    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};

// 2. Exportar la función para listar ventas
export const getListaVentas = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Llamamos al endpoint del BFF añadiendo la cabecera
    const response = await fetch(`${API_URL}/bff/ventas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }); 
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar las transacciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};