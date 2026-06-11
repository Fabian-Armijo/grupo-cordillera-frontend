import React, { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useAuth } from '../components/context/AuthContext.jsx'; // 1. Importamos el contexto global

export const ComprasPage = () => {
  // 2. Consumimos el usuario del Contexto Global en lugar del estado local simulado
  const { user } = useAuth();
  const userRole = user?.role; // Retornará: 'ADMIN', 'GERENTE' o 'USUARIO'
  const userName = user?.username || 'Usuario Invitado';

  // Catálogo de productos invariable
  const [productos] = useState([
    { id: 101, nombre: 'Cemento Melón Extra 25kg', precio: 4500, stock: 120 },
    { id: 102, nombre: 'Fierro Estriado 8mm x 6m', precio: 5800, stock: 85 },
    { id: 103, nombre: 'Ladrillo Princesa Estructura', precio: 650, stock: 1500 },
  ]);

  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const ejecutarIntentoCompra = () => {
    alert(`🛒 Intento de Compra Procesado:\nUsuario: ${userName}\nRol: ${userRole}\nArtículos: ${carrito.length}\nTotal: $${carrito.reduce((sum, p) => sum + p.precio, 0)}`);
    setCarrito([]);
  };

  return (
      <DashboardLayout>
        {/* SECCIÓN INFORMATIVA DE SESIÓN ACTUAL (Ocultamos los botones de simulación viejos) */}
        <div style={styles.sessionStatus}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Sesión Activa: <strong style={{ color: '#1e293b' }}>{userName}</strong> |
            Rol Asignado: <span style={styles.roleBadge}>{userRole || 'SIN ROL'}</span>
          </div>
        </div>

        <h1 style={styles.title}>Módulo de Intentos de Compras</h1>
        <p style={styles.subtitle}>Las acciones permitidas cambian dinámicamente según tus permisos en el Grupo Cordillera.</p>

        <div style={styles.mainLayout}>
          {/* PANEL IZQUIERDO: CATÁLOGO DE PRODUCTOS */}
          <div style={styles.panel}>
            <h2>Catálogo Disponible</h2>

            {/* MENSAJES CONTEXTUALES SEGÚN ROL GLOBAL */}
            {userRole === 'GERENTE' && (
                <p style={{ color: '#b45309', backgroundColor: '#fffbeb', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                  ℹ️ Modo Consulta: Como Gerente, visualizas los precios de lista pero no generas transacciones de mostrador.
                </p>
            )}
            {userRole === 'ADMIN' && (
                <p style={{ color: '#4338ca', backgroundColor: '#e0e7ff', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                  🔧 Modo Admin: Tienes acceso total para modificar catálogos e infraestructura.
                </p>
            )}

            <div style={styles.productList}>
              {productos.map(prod => (
                  <div key={prod.id} style={styles.productRow}>
                    <div>
                      <strong>{prod.nombre}</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Stock: {prod.stock} un.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 'bold' }}>${prod.precio}</span>

                      {/* Restricción de botón: Solo el Rol Operativo (USUARIO) añade al carro */}
                      {userRole === 'USUARIO' ? (
                          <button onClick={() => agregarAlCarrito(prod)} style={styles.addBtn}>+ Añadir</button>
                      ) : (
                          <button disabled style={styles.disabledBtn}>Bloqueado</button>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO: ACCIÓN SEGÚN EL ROL AUTENTICADO */}
          <div style={styles.panel}>
            <h2>Resumen del Intento de Operación</h2>

            {/* VISTA OPERATIVA - EXCLUSIVA ROL 'USUARIO' (Carrito de Compras / Caja) */}
            {userRole === 'USUARIO' && (
                <div>
                  <p>Items seleccionados: {carrito.length}</p>
                  <div style={{ minHeight: '100px', border: '1px dashed #cbd5e1', padding: '10px', marginBottom: '12px', borderRadius: '8px' }}>
                    {carrito.map((item, i) => <div key={i} style={{ fontSize: '13px' }}>• {item.nombre} - ${item.precio}</div>)}
                    {carrito.length === 0 && <span style={{ color: '#94a3b8', fontSize: '13px' }}>El carrito está vacío</span>}
                  </div>
                  <button
                      onClick={ejecutarIntentoCompra}
                      disabled={carrito.length === 0}
                      style={carrito.length === 0 ? styles.disabledActionBtn : styles.actionBtn}
                  >
                    Confirmar Transacción en Caja
                  </button>
                </div>
            )}

            {/* VISTA ADMINISTRADOR - EXCLUSIVA ROL 'ADMIN' */}
            {userRole === 'ADMIN' && (
                <div style={styles.adminBox}>
                  <h4>Panel de Control TI</h4>
                  <p style={{ fontSize: '13px' }}>Puedes auditar la pasarela de pagos del BFF, reconfigurar logs o modificar parámetros globales del microservicio de compras.</p>
                  <button style={{ ...styles.actionBtn, backgroundColor: '#475569' }} onClick={() => alert('Abriendo logs del Gateway...')}>Ver Logs del Gateway (8086)</button>
                </div>
            )}

            {/* VISTA GERENTE - EXCLUSIVA ROL 'GERENTE' */}
            {userRole === 'GERENTE' && (
                <div style={styles.gerenteBox}>
                  <h4>Dashboard de Aprobaciones</h4>
                  <p style={{ fontSize: '13px' }}>Actualmente hay <strong>3 solicitudes de crédito comercial</strong> pendientes por sobrepasar el límite financiero de ventas.</p>
                  <button style={{ ...styles.actionBtn, backgroundColor: '#047857' }} onClick={() => alert('Abriendo panel corporativo...')}>Ver Aprobaciones Financieras</button>
                </div>
            )}
          </div>
        </div>
      </DashboardLayout>
  );
};

const styles = {
  container: { padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' },
  title: { fontSize: '26px', color: '#1e293b', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '24px' },
  sessionStatus: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0'
  },
  roleBadge: { backgroundColor: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginLeft: '6px' },
  mainLayout: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  panel: { flex: 1, minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  productList: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  productRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9' },
  addBtn: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#f1f5f9', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'not-allowed' },
  actionBtn: { width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  disabledActionBtn: { width: '100%', backgroundColor: '#cbd5e1', color: '#94a3b8', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'not-allowed' },
  adminBox: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #475569' },
  gerenteBox: { backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #16a34a' }
};

export default ComprasPage;