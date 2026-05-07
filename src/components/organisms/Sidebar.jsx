import { Nav } from 'react-bootstrap';

export const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h4 className="mb-4">Grupo Cordillera</h4>
      <Nav className="flex-column">
        <Nav.Link href="#home" className="text-white">Dashboard (KPIs)</Nav.Link>
        <Nav.Link href="#ventas" className="text-white">Ventas</Nav.Link>
        <Nav.Link href="#inventario" className="text-white">Inventario</Nav.Link>
        <Nav.Link href="#reportes" className="text-white">Reportes</Nav.Link>
      </Nav>
    </div>
  );
};