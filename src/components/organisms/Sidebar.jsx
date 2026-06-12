import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/kpi',       icon: '📈', label: 'Dashboard KPIs',    rolesPermitidos: ['ROLE_ADMIN', 'ROLE_GERENTE'] },
  { to: '/ventas',    icon: '🛒', label: 'Compras / Ventas',   rolesPermitidos: ['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_USUARIO'] },
  { to: '/inventario',icon: '📦', label: 'Inventario',         rolesPermitidos: ['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_USUARIO'] },
  { to: '/reportes',  icon: '📊', label: 'Reportes',           rolesPermitidos: ['ROLE_ADMIN', 'ROLE_GERENTE'] },
  // ✅ NUEVO: Solo visible para ROLE_ADMIN
  { to: '/usuarios',  icon: '👥', label: 'Gestión de Usuarios', rolesPermitidos: ['ROLE_ADMIN'] },
];

export const Sidebar = () => {
  const userRaw = localStorage.getItem('user');
  let rolesUsuario = [];

  try {
    if (userRaw) {
      const parsedUser = JSON.parse(userRaw);
      rolesUsuario = Array.isArray(parsedUser.roles)
        ? parsedUser.roles
        : parsedUser.rol ? [parsedUser.rol] : [];
    }
  } catch (e) {
    console.error("Error al leer los roles del localStorage", e);
  }

  const esAdmin = rolesUsuario.includes('ROLE_ADMIN');

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.flexRowCentered}>
          <div style={styles.logoBadge}>
            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>KC</span>
          </div>
          <div>
            <p style={styles.brandTitle}>KPI Manager</p>
            <p style={styles.brandSubtitle}>Grupo Cordillera</p>
          </div>
        </div>
      </div>

      <nav style={styles.navigation}>
        {links
          .filter(({ rolesPermitidos }) =>
            rolesPermitidos.some(rolRequired => rolesUsuario.includes(rolRequired))
          )
          .map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `custom-sidebar-link ${isActive ? 'active-link' : 'inactive-link'}`}
            >
              {icon && <span style={styles.iconContainer}>{icon}</span>}
              <span>{label}</span>
            </NavLink>
          ))
        }
      </nav>

      {/* Separador y sección de admin al pie del sidebar */}
      {esAdmin && (
        <div style={styles.adminSection}>
          <p style={styles.adminLabel}>ADMINISTRACIÓN</p>
          <div style={styles.adminBadge}>
            <span style={styles.adminDot} />
            Acceso de Administrador
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <p style={styles.footerText}>v1.0.0 · DSY1106</p>
      </div>

      <style>{`
        .custom-sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          margin-bottom: 2px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
        }
        .active-link {
          background-color: rgba(59, 130, 246, 0.15) !important;
          color: #60a5fa !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
        }
        .inactive-link {
          color: #94a3b8 !important;
          background-color: transparent;
          border: 1px solid transparent;
        }
        .inactive-link:hover {
          color: #e2e8f0 !important;
          background-color: #1e293b !important;
        }
      `}</style>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px', minWidth: '240px', flexShrink: 0,
    backgroundColor: '#0f172a', borderRight: '1px solid #1e293b',
    display: 'flex', flexDirection: 'column', height: '100vh',
    fontFamily: "'Segoe UI', Roboto, sans-serif", boxSizing: 'border-box',
  },
  logoContainer: { padding: '20px 24px', borderBottom: '1px solid #1e293b' },
  flexRowCentered: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoBadge: {
    width: '32px', height: '32px', borderRadius: '8px',
    backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandTitle: { fontSize: '14px', fontWeight: '600', color: '#f8fafc', margin: 0, lineHeight: '1.2' },
  brandSubtitle: { fontSize: '12px', color: '#64748b', margin: 0 },
  navigation: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column' },
  iconContainer: { width: '18px', display: 'inline-flex', justifyContent: 'center', fontSize: '14px' },
  adminSection: {
    padding: '12px 16px',
    borderTop: '1px solid #1e293b',
    margin: '0 8px',
  },
  adminLabel: {
    fontSize: '10px', fontWeight: '600', color: '#334155',
    letterSpacing: '0.08em', margin: '0 0 8px 0',
  },
  adminBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '12px', color: '#64748b',
  },
  adminDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    backgroundColor: '#10b981', flexShrink: 0,
    boxShadow: '0 0 4px #10b981',
  },
  footer: { padding: '16px', borderTop: '1px solid #1e293b' },
  footerText: { fontSize: '12px', color: '#475569', fontFamily: 'monospace', margin: 0 },
};

export default Sidebar;