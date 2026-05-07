import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Definimos qué componente se carga en cada ruta */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;