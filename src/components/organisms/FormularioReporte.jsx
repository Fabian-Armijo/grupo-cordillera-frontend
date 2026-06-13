import React, { useState, useEffect } from 'react';
import { kpiService } from '../../services/kpiService';
import {
    generarYDescargarReporte,
    enviarReportePorCorreo,
    obtenerUrlPrevisualizacion
} from '../../services/reporteService';

export const FormularioReporte = ({
    esAdmin,
    sucursalId,
    alGenerarReporte
}) => {

    const [kpiSeleccionado, setKpiSeleccionado] = useState('');
    const [periodo, setPeriodo] = useState('MENSUAL');
    const [correo, setCorreo] = useState('');
    const [kpis, setKpis] = useState([]);

    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('1');

    const [cargandoDescarga, setCargandoDescarga] = useState(false);
    const [cargandoCorreo, setCargandoCorreo] = useState(false);
    const [cargandoPrevisualizacion, setCargandoPrevisualizacion] = useState(false);

    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {

        const cargarKpis = async () => {

            try {

                const data = await kpiService.getDefiniciones();

                console.log("================================");
                console.log("KPIs recibidos:", data);
                console.log("================================");

                setKpis(data);

                if (data.length > 0) {

                    setKpiSeleccionado(
                        String(data[0].id)
                    );

                }

            } catch (error) {

                console.error("ERROR CARGANDO KPIS:", error);

            }
        };

        cargarKpis();

    }, []);

    const obtenerParametrosSeguros = () => {

        const idKpi = Number(kpiSeleccionado);

        const idSucursal = esAdmin
            ? Number(sucursalSeleccionada)
            : Number(sucursalId);

        return {
            idKpi,
            idSucursal
        };
    };

    const handleDescargar = async () => {



        if (!kpiSeleccionado) {
            alert("Debe seleccionar un KPI");
            return;
        }

        setCargandoDescarga(true);

        try {

            const { idKpi, idSucursal } =
                obtenerParametrosSeguros();

            const rol = esAdmin ? "ADMIN" : "GERENTE";

            await generarYDescargarReporte(
                idKpi,
                idSucursal,
                periodo,
                rol
            );

            alert("¡Reporte descargado con éxito!");

            if (alGenerarReporte) {
                alGenerarReporte();
            }

        } catch (error) {

            console.error(error);
            alert("Hubo un error al descargar el reporte.");

        } finally {

            setCargandoDescarga(false);

        }
    };

    const handleEnviarCorreo = async () => {

        if (!kpiSeleccionado) {
            alert("Debe seleccionar un KPI");
            return;
        }

        if (!correo.trim()) {
            alert("Debe ingresar un correo electrónico.");
            return;
        }

        setCargandoCorreo(true);

        try {

            const { idKpi, idSucursal } =
                obtenerParametrosSeguros();

            const mensaje =
                await enviarReportePorCorreo(
                    idKpi,
                    idSucursal,
                    periodo,
                    correo
                );

            alert(mensaje);

            setCorreo('');

            if (alGenerarReporte) {
                alGenerarReporte();
            }

        } catch (error) {

            console.error(error);
            alert("Hubo un error al enviar el correo.");

        } finally {

            setCargandoCorreo(false);

        }
    };

    const handlePrevisualizar = async () => {

        if (!kpiSeleccionado) {
            alert("Debe seleccionar un KPI");
            return;
        }

        setCargandoPrevisualizacion(true);

        try {

            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }

            const { idKpi, idSucursal } =
                obtenerParametrosSeguros();

            const urlTemporal =
                await obtenerUrlPrevisualizacion(
                    idKpi,
                    idSucursal,
                    periodo
                );

            setPdfUrl(urlTemporal);

        } catch (error) {

            console.error(error);
            alert("Hubo un error al generar la previsualización.");

        } finally {

            setCargandoPrevisualizacion(false);

        }
    };

    return (
        <div>

            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <label className="form-label text-muted fw-bold">
                        Métrica / KPI
                    </label>

                    <select
                        className="form-select"
                        value={kpiSeleccionado}
                        onChange={(e) =>
                            setKpiSeleccionado(e.target.value)
                        }
                    >

                        <option value="">
                            Seleccione un KPI
                        </option>

                        {kpis.map((kpi) => {
                            console.log("KPI:", kpi);

                            return (
                                <option
                                    key={kpi.id}
                                    value={kpi.id}
                                >
                                    {kpi.nombre}
                                </option>
                            );
                        })}

                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label text-muted fw-bold">
                        Sucursal
                    </label>

                    <select
                        className="form-select"
                        value={
                            esAdmin
                                ? sucursalSeleccionada
                                : sucursalId
                        }
                        disabled={!esAdmin}
                        onChange={(e) =>
                            setSucursalSeleccionada(
                                e.target.value
                            )
                        }
                    >
                        {esAdmin ? (
                            <>
                                <option value="1">
                                    Casa Matriz (Santiago)
                                </option>

                                <option value="2">
                                    Sucursal Las Condes
                                </option>

                                <option value="6">
                                    Sucursal Melipilla
                                </option>

                                <option value="7">
                                    Sucursal Viña del Mar
                                </option>
                            </>
                        ) : (
                            <option value={sucursalId}>
                                Mi Sucursal Asignada
                            </option>
                        )}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label text-muted fw-bold">
                        Periodo del Reporte
                    </label>

                    <select
                        className="form-select"
                        value={periodo}
                        onChange={(e) =>
                            setPeriodo(e.target.value)
                        }
                    >
                        <option value="SEMANAL">
                            Semanal
                        </option>

                        <option value="MENSUAL">
                            Mensual
                        </option>

                        <option value="ANUAL">
                            Anual
                        </option>
                    </select>
                </div>

            </div>

            <div className="row g-3 mb-4">

                <div className="col-md-12">

                    <label className="form-label text-muted fw-bold">
                        Enviar por Correo (Opcional)
                    </label>

                    <input
                        type="email"
                        className="form-control"
                        placeholder="ejemplo@grupocordillera.cl"
                        value={correo}
                        onChange={(e) =>
                            setCorreo(e.target.value)
                        }
                    />

                </div>

            </div>

            <div className="d-flex justify-content-end gap-3 mb-4">

                <button
                    className="btn btn-info text-white px-4"
                    onClick={handlePrevisualizar}
                    disabled={cargandoPrevisualizacion}
                >
                    {
                        cargandoPrevisualizacion
                            ? 'Cargando...'
                            : '👁 Previsualizar'
                    }
                </button>

                <button
                    className="btn btn-primary px-4"
                    onClick={handleDescargar}
                    disabled={cargandoDescarga}
                >
                    {
                        cargandoDescarga
                            ? 'Generando...'
                            : '⬇ Descargar'
                    }
                </button>

                <button
                    className="btn btn-outline-secondary px-4"
                    onClick={handleEnviarCorreo}
                    disabled={
                        cargandoCorreo ||
                        !correo.trim()
                    }
                >
                    {
                        cargandoCorreo
                            ? 'Enviando...'
                            : '📧 Enviar por Correo'
                    }
                </button>

            </div>

            {pdfUrl && (

                <div className="card shadow-sm mt-4 border-info">

                    <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            Vista Previa del Documento
                        </h5>

                        <button
                            className="btn btn-sm btn-light"
                            onClick={() => setPdfUrl(null)}
                        >
                            Cerrar
                        </button>

                    </div>

                    <div className="card-body p-0">

                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="500px"
                            style={{ border: 'none' }}
                            title="Previsualización PDF"
                        />

                    </div>

                </div>

            )}

        </div>
    );
};