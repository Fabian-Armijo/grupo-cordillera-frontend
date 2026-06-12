import { useState, useEffect, useCallback } from 'react';
import { obtenerHistorialReportes } from '../services/reporteService';

// 🎯 CORREGIDO: Ahora el hook recibe el rol y sucursal para aislar las consultas en el Back
export const useHistorialReportes = (rol, sucursalId) => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Usamos useCallback para que la referencia de la función no cambie innecesariamente
    const cargarHistorial = useCallback(async () => {
        if (!rol) return; // No disparamos si no se ha leído el rol aún
        setCargando(true);
        try {
            const datos = await obtenerHistorialReportes(rol, sucursalId);
            setHistorial(datos);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }, [rol, sucursalId]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    return { historial, cargando, error, recargarHistorial: cargarHistorial };
};