const API_URL = import.meta.env.VITE_BFF_URL;

// 1. Exportar la función para crear ventas
export const postCrearVenta = async (datosVenta) => {
  try {
    const token = localStorage.getItem('token');
    // 🎯 CORREGIDO: Ahora apunta a /bff/ventas/confirmar tal como pide tu controlador
    const response = await fetch(`${API_URL}/bff/ventas/confirmar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

// 2. Exportar la función para listar ventas (Mapeo Dinámico por Catálogo de BD)
export const getListaVentas = async () => {
  try {
    const token = localStorage.getItem('token');

    // 🏢 1. Traemos el catálogo maestro de sucursales desde el BFF de forma dinámica
    const mapaSucursales = new Map();
    try {
      // 🎯 CORREGIDO: Cambiado de /bff/sucursales a /bff/ventas/sucursales-activas para matar el 403 Forbidden
      const resSucursales = await fetch(`${API_URL}/bff/ventas/sucursales-activas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resSucursales.ok) {
        const sucursalesBD = await resSucursales.json();
        if (Array.isArray(sucursalesBD)) {
          sucursalesBD.forEach(suc => {
            if (suc && suc.id) {
              mapaSucursales.set(Number(suc.id), suc.nombre);
            }
          });
        }
      }
    } catch (e) {
      console.error("⚠️ Falló la carga dinámica del catálogo de sucursales:", e);
    }

    // 🔒 2. Llamamos al endpoint de ventas del BFF
    const response = await fetch(`${API_URL}/bff/ventas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('No se pudieron cargar las transacciones');
    }

    const transacciones = await response.json();
    const listaFiltro = Array.isArray(transacciones) ? transacciones : [];

    // 🎯 3. RECONCILIACIÓN DINÁMICA: Reemplazamos el parámetro usando los datos reales de la BD
    return listaFiltro.map(item => {
      // Extraemos el ID numérico de la sucursal (vía sucursalId o procesando el String)
      let idSucursal = item.sucursalId;
      if (!idSucursal && item.nombreSucursal) {
        const match = item.nombreSucursal.match(/\d+/);
        if (match) idSucursal = Number(match[0]);
      }

      // Buscamos el NOMBRE real correspondiente en el mapa que trajimos de la BD
      const nombreRealBD = mapaSucursales.get(Number(idSucursal));

      return {
        ...item,
        // PISAMOS el parámetro con el nombre real de la BD. Si no existe, mantiene el del backend.
        nombreSucursal: nombreRealBD || item.nombreSucursal
      };
    });

  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};