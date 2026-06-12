import React from 'react';
import Sidebar from '../organisms/Sidebar';
import { Navbar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx'; // 👈 Importamos tu contexto de autenticación

export const DashboardLayout = ({ children }) => {
  const { user } = useAuth(); // 👈 Extraemos el usuario logueado

  // 👤 Nombre dinámico: Busca la propiedad disponible o deja un fallback limpio
  const nombreUsuarioLogueado = user?.nombre || user?.username || user?.name || 'Usuario';

  return (
    // Flexbox puro: Sidebar a la izquierda y el contenido a la derecha
    <div className="d-flex w-100" style={{ minHeight: '100vh', backgroundColor: '#020617' }}>

      {/* 1. SIDEBAR: Se dibuja en su espacio natural izquierdo */}
      <Sidebar />

      {/* 2. CONTENEDOR DERECHO: Nace pegado al Sidebar y se estira al 100% de la pantalla restante */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>

        {/* Navbar superior completo de lado a lado */}
        <Navbar
          bg="dark"
          variant="dark"
          className="border-bottom border-secondary px-4 py-3 shadow-sm w-100"
          style={{ position: 'sticky', top: 0, zIndex: 1040, backgroundColor: '#0f172a' }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center p-0">
            <Navbar.Brand style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>
              Plataforma de Monitoreo
            </Navbar.Brand>
            <Navbar.Text style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              {/* 🔄 ¡Texto estático eliminado! Ahora renderiza al usuario real */}
              Usuario: <strong style={{ color: '#fff' }}>{nombreUsuarioLogueado}</strong>
            </Navbar.Text>
          </div>
        </Navbar>

        {/* 3. ÁREA DE CONTENIDO: 100% responsiva y fluida */}
        <div
          className="w-100"
          style={{
            padding: '32px',
            flexGrow: 1,
            boxSizing: 'border-box'
          }}
        >
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;