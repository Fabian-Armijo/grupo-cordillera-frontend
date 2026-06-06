import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { InicioPage } from './pages/InicioPage'; // <-- Aseguramos la importación aquí

function App() {
  return (
    <Router>
      <Routes>
        {/* Ahora la raíz "/" es tu pantalla de bienvenida corporativa */}
        <Route path="/" element={<InicioPage />} />

        {/* Tus módulos independientes con sus llamados internos al Layout y sus datos originales */}
        <Route path="/kpi" element={<DashboardPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
      </Routes>
    </Router>
  );
}

export default App;