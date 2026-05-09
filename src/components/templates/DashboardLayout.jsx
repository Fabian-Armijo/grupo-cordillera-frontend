import { Sidebar } from '../organisms/Sidebar';
import { Navbar, Container } from 'react-bootstrap';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div 
        className="flex-grow-1 bg-light d-flex flex-column" 
        style={{ 
          marginLeft: '250px',
          minWidth: 0,
          width: 'calc(100% - 250px)' 
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