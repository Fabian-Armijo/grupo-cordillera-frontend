import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { HistorialReportes } from '../components/organisms/HistorialReportes';
import { FormularioReporte } from '../components/organisms/FormularioReporte';
import { useHistorialReportes } from '../hooks/useHistorialReportes';

export const ReportesPage = () => {
    // 1. LEEMOS DIRECTAMENTE DEL LOCALSTORAGE
    let user = null;
    const localUser = localStorage.getItem('user');

    if (localUser) {
        try {
            user = JSON.parse(localUser);
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage", e);
        }
    }

    // 🏢 EXTRAEMOS EL SUCURSAL ID
    const userSucursalId = user?.sucursalId || user?.user?.sucursalId || null;

    // 2. Extraemos y normalizamos los roles
    const rolesDelUsuario = user?.roles ||
        (user?.user?.roles) ||
        (user?.role ? [user.role] : []) ||
        (user?.user?.role ? [user.user.role] : []);

    const rolesNormalizados = rolesDelUsuario.map(r => String(r).toUpperCase());

    const esAdmin = rolesNormalizados.some(r => r.includes('ADMIN') || r.includes('COMPR_ADMIN'));
    const esGerente = rolesNormalizados.some(r => r.includes('GERENTE') || r.includes('MANAGE'));
    const tieneAcceso = esAdmin || esGerente;

    // Determinamos un string de rol limpio para mandarle a la cabecera HTTP
    const rolPrincipal = esAdmin ? 'ADMIN' : (esGerente ? 'GERENTE' : '');

    // 🔄 🎯 CORREGIDO: Le pasamos el rol y la sucursal al hook para levantar el estado reactivo con seguridad
    const { historial, cargando, error, recargarHistorial } = useHistorialReportes(rolPrincipal, userSucursalId);

    // REGLA DE SEGURIDAD 1: Bloqueo de acceso total
    if (!tieneAcceso) {
        return (
            <DashboardLayout>
                <div className="container mt-5 text-center text-danger">
                    <h3>🚫 Acceso Denegado</h3>
                    <p className="text-muted">No tienes los privilegios necesarios para acceder a la sección de reportes.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mt-4">
                <h2 className="mb-4">Generación de Reportes</h2>

                {tieneAcceso && (
                    <div className="card shadow-sm mb-5">
                        <div className="card-body">
                            <h4 className="card-title">Nuevo Reporte</h4>
                            <p className="text-muted">
                                {esAdmin
                                    ? "Configura y emite un nuevo documento de cumplimiento a nivel corporativo."
                                    : "Configura y emite el reporte de cumplimiento correspondiente a tu sucursal."}
                            </p>

                            <FormularioReporte
                                esAdmin={esAdmin}
                                sucursalId={userSucursalId}
                                alGenerarReporte={recargarHistorial}
                            />
                        </div>
                    </div>
                )}

                <div className="card shadow-sm">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Historial de Emisiones</h4>
                        <HistorialReportes
                            historial={historial}
                            cargando={cargando}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportesPage;