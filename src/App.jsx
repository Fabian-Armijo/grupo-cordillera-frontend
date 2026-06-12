import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';
import { GestionUsuariosPage } from './pages/GestionUsuariosPage';

// Guardián de rutas con validación de roles
const RutaProtegida = ({ children, rolesPermitidos }) => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) {
        return <Navigate to="/login" replace />;
    }

    try {
        const parsedUser = JSON.parse(userRaw);

        let rolesUsuario = [];
        if (Array.isArray(parsedUser.roles)) {
            rolesUsuario = parsedUser.roles;
        } else if (parsedUser.rol) {
            rolesUsuario = [parsedUser.rol];
        } else if (Array.isArray(parsedUser.authorities)) {
            rolesUsuario = parsedUser.authorities.map(auth => typeof auth === 'string' ? auth : auth.authority);
        }

        const tienePermiso = rolesPermitidos.some(rolRequired => rolesUsuario.includes(rolRequired));

        if (!tienePermiso) {
            return <Navigate to="/ventas" replace />;
        }
    } catch (e) {
        console.error("Error validando permisos en RutaProtegida:", e);
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        localStorage.getItem('token') ? (
                            <Navigate to="/ventas" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route path="/bienvenida" element={<InicioPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/kpi"
                    element={
                        <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_GERENTE']}>
                            <DashboardPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/ventas"
                    element={
                        <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_USUARIO']}>
                            <VentasPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/inventario"
                    element={
                        <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_USUARIO']}>
                            <InventarioPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/reportes"
                    element={
                        <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_GERENTE']}>
                            <ReportesPage />
                        </RutaProtegida>
                    }
                />

                {/* ✅ NUEVO: Módulo de gestión de usuarios — solo ROLE_ADMIN */}
                <Route
                    path="/usuarios"
                    element={
                        <RutaProtegida rolesPermitidos={['ROLE_ADMIN']}>
                            <GestionUsuariosPage />
                        </RutaProtegida>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;