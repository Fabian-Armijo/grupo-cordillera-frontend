import React, { useState } from 'react';
import { generarYDescargarReporte, enviarReportePorCorreo } from '../../services/reporteService';

export const FormularioReporte = () => {
    const [periodo, setPeriodo] = useState('MENSUAL');
    const [correo, setCorreo] = useState('');
    const [cargandoDescarga, setCargandoDescarga] = useState(false);
    const [cargandoCorreo, setCargandoCorreo] = useState(false);

    const handleDescargar = async () => {
        setCargandoDescarga(true);
        try {
            await generarYDescargarReporte(periodo);
            alert("¡Reporte descargado con éxito!");
            // Opcional: window.location.reload(); para actualizar la tabla de historial
        } catch (error) {
            alert("Hubo un error al descargar el reporte.");
        } finally {
            setCargandoDescarga(false);
        }
    };

    const handleEnviarCorreo = async () => {
        if (!correo) {
            alert("Por favor, ingresa un correo electrónico.");
            return;
        }
        setCargandoCorreo(true);
        try {
            const mensaje = await enviarReportePorCorreo(periodo, correo);
            alert(mensaje); // Mostrará "Reporte enviado con éxito a..."
            setCorreo(''); // Limpiamos el input
        } catch (error) {
            alert("Hubo un error al enviar el correo.");
        } finally {
            setCargandoCorreo(false);
        }
    };

    return (
        <div className="row g-3 align-items-end">
            <div className="col-md-3">
                <label className="form-label text-muted fw-bold">Periodo del Reporte</label>
                <select 
                    className="form-select" 
                    value={periodo} 
                    onChange={(e) => setPeriodo(e.target.value)}
                >
                    <option value="SEMANAL">Semanal</option>
                    <option value="MENSUAL">Mensual</option>
                    <option value="ANUAL">Anual</option>
                </select>
            </div>

            <div className="col-md-4">
                <label className="form-label text-muted fw-bold">Enviar por Correo (Opcional)</label>
                <input 
                    type="email" 
                    className="form-control" 
                    placeholder="ejemplo@grupocordillera.cl" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
            </div>

            <div className="col-md-5 d-flex gap-2">
                <button 
                    className="btn btn-outline-primary w-100" 
                    onClick={handleEnviarCorreo}
                    disabled={cargandoCorreo || !correo}
                >
                    {cargandoCorreo ? 'Enviando...' : 'Enviar Correo'}
                </button>

                <button 
                    className="btn btn-primary w-100" 
                    onClick={handleDescargar}
                    disabled={cargandoDescarga}
                >
                    {cargandoDescarga ? 'Generando...' : 'Descargar PDF'}
                </button>
            </div>
        </div>
    );
};