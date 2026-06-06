import React, { useState } from 'react';

export const KpiMetricas = () => {
  const [metricas] = useState([
    { id: 101, fecha: '2026-06-06 14:30', sucursal: 'Planta Central Santiago', valor: 94.2 },
    { id: 102, fecha: '2026-06-05 09:15', sucursal: 'Centro Distribución Norte', valor: 96.8 }
  ]);

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={styles.title}>Historial de Métricas</h1>
          <p style={styles.subtitle}>Captura de transacciones e ingresos periódicos</p>
        </div>
        <button style={styles.btnPrimary} onClick={() => alert('Formulario para registrar valor (Próximamente)')}>
          ➕ Registrar Métrica
        </button>
      </div>

      {/* Selector de indicador activo */}
      <div style={{ ...styles.card, padding: '20px', marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Seleccionar Indicador Corporativo</label>
        <select style={styles.select}>
          <option>— Disponibilidad de Planta —</option>
          <option>— Cumplimiento de Ventas —</option>
          <option>— Rotación de Inventario —</option>
        </select>
      </div>

      {/* Tabla de registros */}
      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left', backgroundColor: '#0f172a' }}>
              <th style={styles.th}>Fecha y Hora de Registro</th>
              <th style={styles.th}>Sucursal / Origen</th>
              <th style={styles.th}>Valor Capturado</th>
            </tr>
          </thead>
          <tbody>
            {metricas.map((m) => (
              <tr key={m.id} style={styles.tableRow}>
                <td style={{ ...styles.td, fontFamily: 'monospace', color: '#94a3b8' }}>{m.fecha}</td>
                <td style={styles.td}>{m.sucursal}</td>
                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 'bold', color: '#10b981' }}>{m.valor} %</td>
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
  select: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc', width: '100%', maxWidth: '360px', outline: 'none' },
  th: { padding: '16px 24px', fontSize: '12px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '16px 24px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  tableRow: { transition: 'background-color 0.15s ease' },
  btnPrimary: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }
};