// src/hooks/useHistorialReportes.js
import { useState, useEffect } from 'react';
import { obtenerHistorialReportes } from '../services/reporteService';

export const useHistorialReportes = () => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarHistorial = async () => {
        setCargando(true);
        try {
            const datos = await obtenerHistorialReportes();
            setHistorial(datos);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    // Esto hace que se ejecute automáticamente al abrir la pantalla
    useEffect(() => {
        cargarHistorial();
    }, []);

    return { historial, cargando, error, recargarHistorial: cargarHistorial };
};