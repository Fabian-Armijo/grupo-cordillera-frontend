// src/services/ventaService.js
const API_URL = import.meta.env.VITE_BFF_URL;

// Parsea la respuesta de forma segura: si no hay body JSON devuelve null en vez de explotar
const parseResponseSafe = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }
    return null;
};

// 1. Crear una venta
export const postCrearVenta = async (datosVenta) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bff/ventas/confirmar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(datosVenta),
    });

    if (!response.ok) {
        // ✅ Manejo seguro: el body puede estar vacío (ej: un 403 sin JSON)
        const errorData = await parseResponseSafe(response);
        const mensaje = errorData?.message || errorData?.error || `Error ${response.status} al procesar la venta`;
        console.error('Error de venta:', response.status, mensaje);
        throw new Error(mensaje);
    }

    return parseResponseSafe(response);
};

// 2. Listar ventas con reconciliación de sucursales
export const getListaVentas = async () => {
    const token = localStorage.getItem('token');

    // Cargamos catálogo de sucursales para enriquecer los datos
    const mapaSucursales = new Map();
    try {
        const resSucursales = await fetch(`${API_URL}/bff/ventas/sucursales-activas`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (resSucursales.ok) {
            const sucursalesBD = await resSucursales.json();
            if (Array.isArray(sucursalesBD)) {
                sucursalesBD.forEach(suc => {
                    if (suc && suc.id) mapaSucursales.set(Number(suc.id), suc.nombre);
                });
            }
        }
    } catch (e) {
        console.error('Falló la carga del catálogo de sucursales:', e);
    }

    const response = await fetch(`${API_URL}/bff/ventas`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('No se pudieron cargar las transacciones');
    }

    const transacciones = await response.json();
    const lista = Array.isArray(transacciones) ? transacciones : [];

    return lista.map(item => {
        let idSucursal = item.sucursalId;
        if (!idSucursal && item.nombreSucursal) {
            const match = item.nombreSucursal.match(/\d+/);
            if (match) idSucursal = Number(match[0]);
        }
        const nombreRealBD = mapaSucursales.get(Number(idSucursal));
        return { ...item, nombreSucursal: nombreRealBD || item.nombreSucursal };
    });
};