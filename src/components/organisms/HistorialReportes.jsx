import React from 'react';
// Ajusta la cantidad de "../" dependiendo de qué tan profundo esté tu hook
import { useHistorialReportes } from '../../hooks/useHistorialReportes';
import { descargarReporteAntiguo } from '../../services/reporteService';


export const HistorialReportes = () => {
    const { historial, cargando, error } = useHistorialReportes();
    
    const handleDescargarAntiguo = async (id) => {
        try {
            await descargarReporteAntiguo(id);
        } catch (error) {
            alert("Hubo un error al intentar descargar este reporte histórico.");
        }
    };

    if (cargando) return <p>Cargando el historial de reportes...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>KPI</th>
                        <th>Periodo</th>
                        <th>Ventas Reales</th>
                        <th>Estado</th>
                        <th>Fecha de Generación</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.map((reporte) => (
                        <tr key={reporte.id}>
                            <td>{reporte.id}</td>
                            <td>{reporte.nombreKpi}</td>
                            <td>{reporte.periodo}</td>
                            {/* Formateamos a peso chileno para que se vea profesional */}
                            <td>${reporte.ventasReales.toLocaleString('es-CL')}</td>
                            <td>
                                <span className={reporte.estadoFinal === 'SUPERADO' ? 'badge bg-success' : 'badge bg-danger'}>
                                    {reporte.estadoFinal}
                                </span>
                            </td>
                            <td>{new Date(reporte.fechaGeneracion).toLocaleDateString('es-CL')}</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleDescargarAntiguo(reporte.id)}
                                >
                                    Descargar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {historial.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center">No hay reportes generados aún.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};