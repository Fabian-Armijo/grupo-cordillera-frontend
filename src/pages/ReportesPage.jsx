import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { HistorialReportes } from '../components/organisms/HistorialReportes';
import { FormularioReporte } from '../components/organisms/FormularioReporte';

export const ReportesPage = () => {
    // 1. LEEMOS DIRECTAMENTE DEL LOCALSTORAGE (Sin usar useAuth para que no falle)
    let user = null;
    const localUser = localStorage.getItem('user');

    if (localUser) {
        try {
            user = JSON.parse(localUser);
        } catch (e) {
            console.error("Error al parsear el usuario del localStorage", e);
        }
    }

    // 2. Extraemos los roles buscando en todas las estructuras posibles que devuelva tu backend
    const rolesDelUsuario = user?.roles ||
        (user?.user?.roles) ||
        (user?.role ? [user.role] : []) ||
        (user?.user?.role ? [user.user.role] : []);

    // Convertimos todo a mayúsculas para evitar problemas de minúsculas/mayúsculas
    const rolesNormalizados = rolesDelUsuario.map(r => String(r).toUpperCase());

    // Verificamos si el usuario es Administrador o Gerente
    const esAdmin = rolesNormalizados.some(r => r.includes('ADMIN') || r.includes('COMPR_ADMIN'));
    const esGerente = rolesNormalizados.some(r => r.includes('GERENTE') || r.includes('MANAGE'));

    const tieneAcceso = esAdmin || esGerente;

    // REGLA DE SEGURIDAD 1: Si no tiene privilegios o no está logueado, bloqueamos acceso
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

                {/* REGLA DE SEGURIDAD 2: Solo el ADMINISTRADOR puede ver el formulario */}
                {esAdmin && (
                    <div className="card shadow-sm mb-5">
                        <div className="card-body">
                            <h4 className="card-title">Nuevo Reporte</h4>
                            <p className="text-muted">Configura y emite un nuevo documento de cumplimiento.</p>

                            {/* Formulario de Reporte */}
                            <FormularioReporte />
                        </div>
                    </div>
                )}

                {/* Ambos pueden ver el historial */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Historial de Emisiones</h4>
                        <HistorialReportes />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};