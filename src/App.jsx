import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { InicioPage } from './pages/InicioPage'; 
// <-- 1. Importamos la nueva página de Login (Asegúrate de que la ruta sea correcta)
import { LoginPage } from './pages/LoginPage'; 

// 🛡️ 2. Componente Guardián (Protected Route)
// Revisa silenciosamente si el usuario tiene el "carnet" (token) en la memoria
const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, lo mandamos expulsado al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Si hay token, lo dejamos renderizar el componente original
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- RUTAS PÚBLICAS (No requieren token) --- */}
        {/* Tu pantalla de bienvenida corporativa original */}
        <Route path="/" element={<InicioPage />} />
        
        {/* La nueva pantalla de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />


        {/* --- RUTAS PROTEGIDAS (Requieren inicio de sesión) --- */}
        {/* Tus módulos independientes ahora envueltos en el Guardián */}
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