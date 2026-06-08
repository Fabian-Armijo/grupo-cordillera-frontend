import React from 'react';
import { useNavigate } from 'react-router-dom';

export const InicioPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.heroCard}>
        <div style={styles.badge}>🚀 Grupo Cordillera</div>
        <h1 style={styles.title}>Plataforma de Monitoreo Centralizado</h1>
        <p style={styles.subtitle}>
          Bienvenido al panel de control corporativo. Desde aquí podrás gestionar indicadores clave,
          revisar transacciones de compras/ventas y monitorear el inventario global de la compañía.
        </p>

        {/* --- NUEVO BOTÓN DE INICIO DE SESIÓN --- */}
        <div style={styles.actionContainer}>
          <button style={styles.loginButton} onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>

        <div style={styles.gridAccesos}>
          <div style={styles.accesoCard} onClick={() => navigate('/kpi')}>
            <span style={styles.accesoIcon}>📊</span>
            <div>
              <h3 style={styles.accesoTitle}>Módulo KPIs</h3>
              <p style={styles.accesoDesc}>Ver el dashboard con promedios y objetivos corporativos.</p>
            </div>
          </div>

          <div style={styles.accesoCard} onClick={() => navigate('/ventas')}>
            <span style={styles.accesoIcon}>🛒</span>
            <div>
              <h3 style={styles.accesoTitle}>Compras y Ventas</h3>
              <p style={styles.accesoDesc}>Administrar el catálogo de definiciones de indicadores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '75vh',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  heroCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  title: { fontSize: '32px', fontWeight: '700', color: '#f8fafc', margin: '0 0 16px 0' },
  subtitle: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px auto' },
  
  // --- ESTILOS DEL NUEVO BOTÓN ---
  actionContainer: {
    marginBottom: '40px'
  },
  loginButton: {
    backgroundColor: '#3b82f6', // Un azul corporativo
    color: '#ffffff',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
    transition: 'background-color 0.2s ease',
  },
  
  gridAccesos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' },
  accesoCard: {
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease'
  },
  accesoIcon: { fontSize: '28px' },
  accesoTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: 0 },
  accesoDesc: { fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }
};

export default InicioPage;