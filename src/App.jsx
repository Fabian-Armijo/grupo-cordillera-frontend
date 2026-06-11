import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';

// 🛡️ Guardián de Rutas Optimizado
const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Si falta el token o el objeto de usuario, lo mandamos al login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* --- CONTROL DE ACCESO RAÍZ --- */}
                {/* Si entra a "/" decidimos de forma inteligente a dónde mandarlo para evitar pantallas en blanco */}
                <Route
                    path="/"
                    element={
                        localStorage.getItem('token') ? (
                            <Navigate to="/reportes" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Pantalla antigua de inicio (por si la necesitas en otra URL de respaldo) */}
                <Route path="/bienvenida" element={<InicioPage />} />

                {/* La pantalla de inicio de sesión */}
                <Route path="/login" element={<LoginPage />} />

                {/* --- RUTAS PROTEGIDAS (100% Blindadas) --- */}
                <Route
                    path="/kpi"
                    element={
                        <RutaProtegida>
                            <DashboardPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/ventas"
                    element={
                        <RutaProtegida>
                            <VentasPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/inventario"
                    element={
                        <RutaProtegida>
                            <InventarioPage />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/reportes"
                    element={
                        <RutaProtegida>
                            <ReportesPage />
                        </RutaProtegida>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;