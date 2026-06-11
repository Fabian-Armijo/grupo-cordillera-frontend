import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext.jsx'; // 1. Importamos el contexto global

export const InicioPage = () => {
  const navigate = useNavigate();

  // 2. Extraemos el usuario y la función de cierre de sesión
  const { user, logout } = useAuth();
  const userRole = user?.role; // 'ADMIN', 'GERENTE' o 'USUARIO'

  return (
      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div style={styles.badge}>🚀 Grupo Cordillera</div>
          <h1 style={styles.title}>Plataforma de Monitoreo Centralizado</h1>
          <p style={styles.subtitle}>
            Bienvenido al panel de control corporativo. Desde aquí podrás gestionar indicadores clave,
            revisar transacciones de compras/ventas y monitorear el inventario global de la compañía.
          </p>

          {/* --- CONTROL INTERACTIVO DE SESIÓN --- */}
          <div style={styles.actionContainer}>
            {!user ? (
                // Si no está logueado, ve el botón tradicional
                <button style={styles.loginButton} onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </button>
            ) : (
                // Si está logueado, le damos la bienvenida y habilitamos el logout
                <div style={styles.welcomeBox}>
                  <p style={styles.welcomeText}>
                    👋 Conectado como: <strong>{user.username}</strong>
                    <span style={styles.roleLabel}>({userRole})</span>
                  </p>
                  <button style={styles.logoutButton} onClick={logout}>
                    Cerrar Sesión
                  </button>
                </div>
            )}
          </div>

          {/* --- GRID DE ACCESOS DIRECTOS INTELIGENTES (Solo visibles con sesión activa) --- */}
          {user && (
              <div style={styles.gridAccesos}>

                {/* ACCESO A KPIs y DASHBOARDS (Solo ADMIN y GERENTE) */}
                {['ADMIN', 'GERENTE'].includes(userRole) && (
                    <div style={styles.accesoCard} onClick={() => navigate('/kpi')}>
                      <span style={styles.accesoIcon}>📊</span>
                      <div>
                        <h3 style={styles.accesoTitle}>Módulo KPIs y Dashboard</h3>
                        <p style={styles.accesoDesc}>Ver el dashboard con promedios, gráficos y objetivos corporativos.</p>
                      </div>
                    </div>
                )}

                {/* ACCESO A VENTAS (Todos los roles autorizados) */}
                {['ADMIN', 'GERENTE', 'USUARIO'].includes(userRole) && (
                    <div style={styles.accesoCard} onClick={() => navigate('/ventas')}>
                      <span style={styles.accesoIcon}>📈</span>
                      <div>
                        <h3 style={styles.accesoTitle}>Historial de Ventas</h3>
                        <p style={styles.accesoDesc}>Supervisar el flujo unificado de transacciones corporativas.</p>
                      </div>
                    </div>
                )}

                {/* ACCESO A INVENTARIOS (Todos los roles autorizados) */}
                {['ADMIN', 'GERENTE', 'USUARIO'].includes(userRole) && (
                    <div style={styles.accesoCard} onClick={() => navigate('/inventario')}>
                      <span style={styles.accesoIcon}>📦</span>
                      <div>
                        <h3 style={styles.accesoTitle}>Control de Inventario</h3>
                        <p style={styles.accesoDesc}>Consultar stock real, quiebres de almacén y categorías por sucursal.</p>
                      </div>
                    </div>
                )}

                {/* ACCESO A INTENTOS DE COMPRAS / OPERACIONES EXCLUSIVAS */}
                {['ADMIN', 'USUARIO', 'GERENTE'].includes(userRole) && (
                    <div style={styles.accesoCard} onClick={() => navigate('/compras')}>
                      <span style={styles.accesoIcon}>🛒</span>
                      <div>
                        <h3 style={styles.accesoTitle}>Módulo de Compras</h3>
                        <p style={styles.accesoDesc}>Operaciones de caja y flujos reactivos condicionados a tu área.</p>
                      </div>
                    </div>
                )}

              </div>
          )}

          {/* Mensaje de resguardo si el usuario es un visitante anónimo */}
          {!user && (
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                🔒 Por motivos de seguridad y auditoría, debes autenticarte para ver los accesos del ecosistema.
              </p>
          )}
        </div>
      </div>
  );
};

// Estilos actualizados con soporte para estados de sesión y botones limpios
const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', fontFamily: "'Segoe UI', Roboto, sans-serif" },
  heroCard: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '40px', maxWidth: '800px', width: '100%', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', textAlign: 'center' },
  badge: { display: 'inline-block', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  title: { fontSize: '32px', fontWeight: '700', color: '#f8fafc', margin: '0 0 16px 0' },
  subtitle: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px auto' },
  actionContainer: { marginBottom: '40px' },
  loginButton: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)', transition: 'background-color 0.2s ease' },

  // Nuevos estilos de sesión activa
  welcomeBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  welcomeText: { color: '#e2e8f0', margin: 0, fontSize: '16px' },
  roleLabel: { color: '#3b82f6', fontWeight: 'bold', marginLeft: '6px', fontSize: '14px', fontFamily: 'monospace' },
  logoutButton: { backgroundColor: 'transparent', color: '#f43f5e', border: '1px solid #f43f5e', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' },

  gridAccesos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' },
  accesoCard: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease' },
  accesoIcon: { fontSize: '28px' },
  accesoTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: 0 },
  accesoDesc: { fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }
};

export default InicioPage;