import { Sidebar } from '../organisms/Sidebar';
import { Navbar, Container } from 'react-bootstrap';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Menú lateral */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-grow-1 bg-light">
        {/* Barra superior sencilla */}
        <Navbar bg="white" className="border-bottom px-4 shadow-sm">
          <Navbar.Brand>Plataforma de Monitoreo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Usuario Logueado
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        {/* Aquí irá el contenido dinámico de cada página */}
        <Container fluid className="p-4">
          {children}
        </Container>
      </div>
    </div>
  );
};