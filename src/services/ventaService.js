const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// 1. Exportar la función para crear ventas
export const postCrearVenta = async (datosVenta) => {
  try {
    const response = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
}; // <--- Aquí cerramos correctamente postCrearVenta

// 2. Exportar la función para listar ventas
export const getListaVentas = async () => {
  try {
    // Llamamos al endpoint del BFF que configuramos antes
    const response = await fetch(`${API_URL}/ventas`); 
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar las transacciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};