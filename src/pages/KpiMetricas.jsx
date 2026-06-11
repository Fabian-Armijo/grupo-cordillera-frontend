// src/views/KpiMetricas.jsx
import React, { useState } from 'react';
import AllowedTo from '../components/AllowedTo';
import { useAuth } from '../components/context/AuthContext.jsx'; // 1. Importamos el contexto global

export const KpiMetricas = () => {
  const [metricas] = useState([
    { id: 101, fecha: '2026-06-06 14:30', sucursal: 'Planta Central Santiago', valor: 94.2 },
    { id: 102, fecha: '2026-06-05 09:15', sucursal: 'Centro Distribución Norte', valor: 96.8 }
  ]);

  // 👈 2. Extraemos el usuario actual del estado global del sistema
  const { user } = useAuth();
  const userRole = user?.role; // Si no hay usuario, será undefined

  // REGLA DE SEGURIDAD 1: Validar acceso a la pantalla completa
  const rolesConAccesoAVista = ['ADMIN', 'GERENTE'];
  if (!rolesConAccesoAVista.includes(userRole)) {
    return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <h2>🚫 Acceso Denegado</h2>
          <p style={{ color: '#64748b' }}>No tienes los permisos requeridos para ver las métricas KPI.</p>
        </div>
    );
  }

  return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#f8fafc', margin: 0 }}>Historial de Métricas</h1>
          </div>

          {/* 👈 3. El botón se protege automáticamente usando el rol del contexto */}
          <AllowedTo rolesPermitidos={['ADMIN']} userRole={userRole}>
            <button style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
              ➕ Registrar Métrica
            </button>
          </AllowedTo>
        </div>

        {/*... Tu tabla se mantiene abajo ... */}
      </div>
  );
};