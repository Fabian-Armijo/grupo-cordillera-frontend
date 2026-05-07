import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Importamos NavLink

export const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h4 className="mb-4">Grupo Cordillera</h4>
      <Nav className="flex-column">
        {/* Cambiamos href por "to" y le decimos a Nav.Link que se comporte como un NavLink de React Router */}
        <Nav.Link as={NavLink} to="/" className="text-white">
          Dashboard (KPIs)
        </Nav.Link>
        
        <Nav.Link as={NavLink} to="/ventas" className="text-white">
          Ventas
        </Nav.Link>
        
        <Nav.Link as={NavLink} to="/inventario" className="text-white">
          Inventario
        </Nav.Link>
        
        <Nav.Link as={NavLink} to="/reportes" className="text-white">
          Reportes
        </Nav.Link>
      </Nav>
    </div>
  );
};