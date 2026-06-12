import React, { useState } from 'react';
import { generarYDescargarReporte, enviarReportePorCorreo, obtenerUrlPrevisualizacion } from '../../services/reporteService';

// 🏢 Recibimos 'alGenerarReporte' desde ReportesPage.jsx para gatillar la reactividad
export const FormularioReporte = ({ esAdmin, sucursalId, alGenerarReporte }) => {
    const [kpiSeleccionado, setKpiSeleccionado] = useState('1');
    const [periodo, setPeriodo] = useState('MENSUAL');
    const [correo, setCorreo] = useState('');

    // Selectores locales si el Admin desea cambiar de sucursal
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('1');

    const [cargandoDescarga, setCargandoDescarga] = useState(false);
    const [cargandoCorreo, setCargandoCorreo] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [cargandoPrevisualizacion, setCargandoPrevisualizacion] = useState(false);

    // Helper de tipado y mapeo seguro de IDs según roles
    const obtenerParametrosSeguros = () => {
        const idKpi = Number(kpiSeleccionado);
        const idSucursal = esAdmin ? Number(sucursalSeleccionada) : 0;
        return { idKpi, idSucursal };
    };

    const handleDescargar = async () => {
        setCargandoDescarga(true);
        try {
            const { idKpi, idSucursal } = obtenerParametrosSeguros();

            await generarYDescargarReporte(idKpi, idSucursal, periodo);
            alert("¡Reporte descargado con éxito!");

            // 🎯 RECARGA REACTIVA: Le avisa al hook de la página padre que actualice la tabla
            if (alGenerarReporte) alGenerarReporte();
        } catch (error) {
            console.error(error);
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
            const { idKpi, idSucursal } = obtenerParametrosSeguros();

            const mensaje = await enviarReportePorCorreo(idKpi, idSucursal, periodo, correo);
            alert(mensaje);
            setCorreo('');

            // 🎯 RECARGA REACTIVA: El envío por correo también genera historial en BD, refrescamos
            if (alGenerarReporte) alGenerarReporte();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al enviar el correo.");
        } finally {
            setCargandoCorreo(false);
        }
    };

    const handlePrevisualizar = async () => {
        setCargandoPrevisualizacion(true);
        try {
            if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);

            const { idKpi, idSucursal } = obtenerParametrosSeguros();

            const urlTemporal = await obtenerUrlPrevisualizacion(idKpi, idSucursal, periodo);
            setPdfUrl(urlTemporal);

            // 🎯 RECARGA REACTIVA: Actualiza preventivamente por si la previsualización guarda logs
            if (alGenerarReporte) alGenerarReporte();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al generar la previsualización.");
        } finally {
            setCargandoPrevisualizacion(false);
        }
    };

    return (
        <div>
            {/* --- CONTROLES DEL FORMULARIO --- */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label text-muted fw-bold">Métrica / KPI</label>
                    <select
                        className="form-select"
                        value={kpiSeleccionado}
                        onChange={(e) => setKpiSeleccionado(e.target.value)}
                    >
                        <option value="1">Monto Total de Ventas</option>
                        <option value="2">Unidades Totales Vendidas</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label text-muted fw-bold">Sucursal</label>
                    <select
                        className="form-select"
                        value={esAdmin ? sucursalSeleccionada : sucursalId}
                        disabled={!esAdmin}
                        onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    >
                        {esAdmin ? (
                            <>
                                <option value="1">Casa Matriz (Santiago)</option>
                                <option value="2">Sucursal Las Condes</option>
                                <option value="6">Sucursal Melipilla</option>
                                <option value="7">Sucursal Viña del Mar</option>
                            </>
                        ) : (
                            <option value={sucursalId}>Mi Sucursal Asignada</option>
                        )}
                    </select>
                </div>

                <div className="col-md-4">
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
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-12">
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

            {/* --- ACCIONES --- */}
            <div className="d-flex justify-content-end gap-3 mb-4">
                <button
                    className="btn btn-info text-white px-4"
                    onClick={handlePrevisualizar}
                    disabled={cargandoPrevisualizacion}
                >
                    {cargandoPrevisualizacion ? 'Cargando...' : '👁 Previsualizar'}
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
                    {cargandoCorreo ? 'Enviando...' : '📧 Enviar por Correo'}
                </button>
            </div>

            {/* --- VISOR DE PDF --- */}
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