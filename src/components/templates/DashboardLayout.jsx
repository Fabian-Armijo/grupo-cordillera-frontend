import { Sidebar } from '../organisms/Sidebar';
import { Navbar, Container } from 'react-bootstrap';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* El Sidebar ahora es fixed, no ocupa espacio en el flujo normal */}
      <Sidebar />

      {/* Contenedor del contenido: le damos un margen izquierdo de 250px (el ancho del sidebar) */}
      <div 
        className="flex-grow-1 bg-light d-flex flex-column" 
        style={{ 
          marginLeft: '250px', // IMPORTANTE: Mismo ancho que el Sidebar
          minWidth: 0,
          width: 'calc(100% - 250px)' // Asegura que no se pase del ancho de pantalla
        }}
      >
        <Navbar 
          bg="white" 
          className="border-bottom px-4 shadow-sm" 
          style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1040 
          }}
        >
          <Navbar.Brand>Plataforma de Monitoreo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="fw-bold">
              Usuario: Admin Corporativo
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Container fluid className="p-4" style={{ overflowX: 'hidden' }}>
          {children}
        </Container>
      </div>
    </div>
  );
};