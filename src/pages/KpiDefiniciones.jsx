import React, { useState } from 'react';

export const KpiDefiniciones = () => {
  // Estado local provisional para renderizar la tabla mientras conectas tu API
  const [items] = useState([
    { id: 1, nombre: 'Disponibilidad de Planta', descripcion: 'Tiempo operativo sobre tiempo total', valorObjetivo: 95, unidad: '%' },
    { id: 2, nombre: 'Cumplimiento de Ventas', descripcion: 'Ventas reales vs presupuesto', valorObjetivo: 100, unidad: '%' },
    { id: 3, nombre: 'Rotación de Inventario', descripcion: 'Frecuencia de renovación de stock', valorObjetivo: 12, unidad: 'veces' }
  ]);

  return (
    <div style={styles.container}>
      {/* Header de la Página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={styles.title}>Definiciones de KPIs</h1>
          <p style={styles.subtitle}>Gestión y catálogo de indicadores de desempeño corporativo</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => alert('Formulario para nuevo KPI (Próximamente)')}>
          ➕ Nuevo KPI
        </button>
      </div>

      {/* Tabla estilo Dark Mode */}
      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left', backgroundColor: '#0f172a' }}>
              <th style={styles.th}>Nombre del Indicador</th>
              <th style={styles.th}>Descripción u Objetivo</th>
              <th style={styles.th}>Meta / Objetivo</th>
              <th style={styles.th}>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={{ ...styles.td, fontWeight: '600', color: '#f8fafc' }}>{item.nombre}</td>
                <td style={{ ...styles.td, color: '#94a3b8' }}>{item.descripcion}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>{item.valorObjetivo}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{item.unidad}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Segoe UI', Roboto, sans-serif" },
  title: { fontSize: '24px', fontWeight: '600', color: '#f8fafc', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px', margin: 0 },
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' },
  th: { padding: '16px 24px', fontSize: '12px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '16px 24px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  tableRow: { transition: 'background-color 0.15s ease' },
  badge: { backgroundColor: '#1e293b', color: '#cbd5e1', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
  btnPrimary: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }
};