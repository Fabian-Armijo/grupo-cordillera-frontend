import React, { useState } from 'react';
import { generarYDescargarReporte, enviarReportePorCorreo, obtenerUrlPrevisualizacion } from '../../services/reporteService';

export const FormularioReporte = () => {
    const [periodo, setPeriodo] = useState('MENSUAL');
    const [correo, setCorreo] = useState('');
    const [cargandoDescarga, setCargandoDescarga] = useState(false);
    const [cargandoCorreo, setCargandoCorreo] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [cargandoPrevisualizacion, setCargandoPrevisualizacion] = useState(false);

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
    const handlePrevisualizar = async () => {
        setCargandoPrevisualizacion(true);
        try {
            // Si ya había un PDF anterior, limpiamos la memoria
            if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
            
            const urlTemporal = await obtenerUrlPrevisualizacion(periodo);
            setPdfUrl(urlTemporal); // Guardamos la URL en el estado para mostrar el iframe
        } catch (error) {
            alert("Hubo un error al generar la previsualización.");
        } finally {
            setCargandoPrevisualizacion(false);
        }
    };

    return (
        <div>
            {/* --- NIVEL 1: LOS CONTROLES --- */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
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

                <div className="col-md-6">
                    <label className="form-label text-muted fw-bold">Enviar por Correo (Opcional)</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="ejemplo@grupocordillera.cl" 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>
            </div>

            {/* --- NIVEL 2: LAS ACCIONES (Alineadas a la derecha) --- */}
            <div className="d-flex justify-content-end gap-3 mb-4">
                

                <button 
                    className="btn btn-info text-white px-4" 
                    onClick={handlePrevisualizar}
                    disabled={cargandoPrevisualizacion}
                >
                    {cargandoPrevisualizacion ? 'Cargando...' : ' Previsualizar'}
                </button>
                
                <button 
                    className="btn btn-primary px-4" 
                    onClick={handleDescargar}
                    disabled={cargandoDescarga}
                >
                    {cargandoDescarga ? 'Generando...' : '⬇ Descargar'}
                </button>
                
                <button 
                    className="btn btn-outline-secondary px-4" 
                    onClick={handleEnviarCorreo}
                    disabled={cargandoCorreo || !correo}
                >
                    {cargandoCorreo ? 'Enviando...' : ' Enviar por Correo'}
                </button>
            </div>

            {/* --- EL VISOR DE PDF (Se mantiene igual) --- */}
            {pdfUrl && (
                <div className="card shadow-sm mt-4 border-info">
                    <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Vista Previa del Documento</h5>
                        <button className="btn btn-sm btn-light" onClick={() => setPdfUrl(null)}>Cerrar</button>
                    </div>
                    <div className="card-body p-0">
                        <iframe 
                            src={pdfUrl} 
                            width="100%" 
                            height="500px" 
                            style={{ border: 'none' }} 
                            title="Previsualización PDF"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};