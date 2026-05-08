import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div 
      className="bg-dark text-white p-3 shadow" 
      style={{ 
        width: '250px',
        height: '100vh',      // Ocupa todo el alto de la pantalla
        position: 'fixed',    // Cambiamos a fixed para que sea totalmente independiente del scroll
        left: 0,
        top: 0,
        zIndex: 1050,
        overflowY: 'auto'     // Permite scroll interno si hay muchos enlaces
      }}
    >
      <h4 className="mb-4 text-center mt-2">Grupo Cordillera</h4>
      <hr className="bg-secondary" />
      
      <Nav className="flex-column mt-3">
        <Nav.Link as={NavLink} to="/" className="text-white mb-2">
          Dashboard (KPIs)
        </Nav.Link>
        <Nav.Link as={NavLink} to="/ventas" className="text-white mb-2">
          Ventas
        </Nav.Link>
        <Nav.Link as={NavLink} to="/inventario" className="text-white mb-2">
          Inventario
        </Nav.Link>
        <Nav.Link as={NavLink} to="/reportes" className="text-white mb-2">
          Reportes
        </Nav.Link>
      </Nav>
    </div>
  );
};