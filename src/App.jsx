import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';

// 🛡️ Guardián de Rutas Avanzado con Validación de Roles
const RutaProtegida = ({ children, rolesPermitidos }) => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) {
        return <Navigate to="/login" replace />;
    }

    try {
        const parsedUser = JSON.parse(userRaw);

        // Manejo ultra seguro por si el backend lo manda como 'roles', 'rol' o 'authorities'
        let rolesUsuario = [];
        if (Array.isArray(parsedUser.roles)) {
            rolesUsuario = parsedUser.roles;
        } else if (parsedUser.rol) {
            rolesUsuario = [parsedUser.rol];
        } else if (Array.isArray(parsedUser.authorities)) {
            // A veces Spring Security inyecta un array de objetos con la propiedad authority
            rolesUsuario = parsedUser.authorities.map(auth => typeof auth === 'string' ? auth : auth.authority);
        }

        // Comprobamos si el usuario tiene al menos uno de los roles con prefijo ROLE_
        const tienePermiso = rolesPermitidos.some(rolRequired => rolesUsuario.includes(rolRequired));

        if (!tienePermiso) {
            // Si no tiene permiso (ej: ROLE_USUARIO queriendo ver reportes), lo mandamos a ventas
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
                {/* --- CONTROL DE ACCESO RAÍZ --- */}
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

                {/* --- RUTAS PROTEGIDAS CON FILTRO DE ROLES REALES (ROLE_...) --- */}
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

                {/* Comodín por si escriben cualquier otra ruta inexistente */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;