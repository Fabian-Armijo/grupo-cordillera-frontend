import React, { useEffect, useState } from 'react';
import { useKpis } from '../hooks/useKpis';
import { DashboardLayout } from '../components/templates/DashboardLayout';

export const DashboardPage = () => {
  const respuestaHook = useKpis() || {};
  const kpisIniciales = respuestaHook.kpis || respuestaHook.data || [];
  const loading = respuestaHook.loading || false;
  const error = respuestaHook.error || null;

  // Estados locales para manejar la lista dinámica de KPIs y el formulario
  const [listaKpis, setListaKpis] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Campos del nuevo formulario de creación
  const [nombre, setNombre] = useState('');
  const [valorActual, setValorActual] = useState('');
  const [meta, setMeta] = useState('');

  // Sincroniza los datos iniciales que vienen del Hook
  useEffect(() => {
    if (kpisIniciales && Array.isArray(kpisIniciales) && kpisIniciales.length > 0) {
      setListaKpis(kpisIniciales);
    }
  }, [kpisIniciales]);

  // Actualiza los gráficos nativos cada vez que muta o se añade un elemento a 'listaKpis'
  useEffect(() => {
    if (listaKpis && Array.isArray(listaKpis) && listaKpis.length > 0) {
      const data = listaKpis.map(kpi => {
        
        // 🌟 LA MAGIA: Buscamos el valor en el arreglo de métricas que manda el BFF
        let valorCalculado = 0;
        if (kpi.metricas && kpi.metricas.length > 0) {
          // Viene del Backend (PostgreSQL / BFF)
          valorCalculado = kpi.metricas[0].valorActual || 0;
        } else if (kpi.valorActual) {
          // Viene del formulario local recién creado en la vista
          valorCalculado = kpi.valorActual; 
        }

        return {
          nombre: kpi.nombre || kpi.name || 'Indicador',
          promedio: Number(valorCalculado),
          objetivo: Number(kpi.meta || kpi.valorObjetivo || 0),
        };
      });
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [listaKpis]);

  // Función asíncrona para guardar la nueva métrica en la base de datos real
  const handleCrearKpi = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !meta) {
      alert("Por favor rellena al menos el Nombre y la Meta para definir la métrica.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Aseguramos apuntar al Gateway, si la variable de entorno no existe, usamos el puerto 8090 por defecto
      const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8086/bff/kpis';

      // 1. Enviamos primero la Definición del KPI al backend
      const responseDefinicion = await fetch(`${API_URL}/api/kpi/definiciones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          descripcion: `Meta global de ${nombre}`,
          valorObjetivo: Number(meta),
          unidad: "U"
        })
      });

      if (!responseDefinicion.ok) {
        throw new Error('No se pudo guardar la definición del KPI en el servidor');
      }

      const nuevaDefinicionGuardada = await responseDefinicion.json();

      // 2. Si el usuario también ingresó un "Valor Actual", registramos su primera métrica
      if (valorActual && Number(valorActual) > 0) {
        await fetch(`${API_URL}/api/kpi/metricas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            definicion: {
              id: nuevaDefinicionGuardada.id // Vinculamos la métrica al ID real de la BD
            },
            sucursalId: null, // Dato global
            valorActual: Number(valorActual)
          })
        });
      }

      // 3. Éxito: Limpiamos los inputs del formulario
      setNombre('');
      setValorActual('');
      setMeta('');
      
      // 4. Forzamos una recarga para que el hook 'useKpis' consulte de nuevo la base de datos
      window.location.reload();

    } catch (err) {
      console.error("Error al crear el KPI en el ecosistema:", err);
      alert("Hubo un error al comunicar con el microservicio de KPIs: " + err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.centerContainer}>
          <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}></div>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '12px' }}>Cargando métricas...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={styles.centerContainer}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '16px 24px', borderRadius: '8px' }}>
            <strong>⚠️ Error:</strong> {String(error)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalKpis = Array.isArray(listaKpis) ? listaKpis.length : 0;
  const conObjetivo = Array.isArray(listaKpis) ? listaKpis.filter(d => d.meta || d.valorObjetivo).length : 0;

  const stats = [
    { label: 'KPIs Definidos', value: totalKpis, icon: '🎯', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Con Objetivo', value: conObjetivo, icon: '📈', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Estado del Sistema', value: 'Activo', icon: '⚡', color: '#c084fc', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.container}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={styles.title}>Dashboard de KPIs</h1>
          <p style={styles.subtitle}>Resumen general y definición de indicadores de desempeño en tiempo real</p>
        </div>

        {/* FORMULARIO DE CREACIÓN DE MÉTRICAS */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h2 style={styles.cardTitle}>➕ Definir Nueva Métrica / KPI</h2>
          <form onSubmit={handleCrearKpi} style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre de la Métrica</label>
              <input
                type="text"
                placeholder="Ej: Retención de Clientes"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Valor Actual</label>
              <input
                type="number"
                placeholder="0"
                value={valorActual}
                onChange={(e) => setValorActual(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Meta / Objetivo</label>
              <input
                type="number"
                placeholder="100"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.inputGroup, justifyContent: 'flex-end' }}>
              <button type="submit" style={styles.button}>
                Crear Métrica
              </button>
            </div>
          </form>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map(({ label, value, icon, color, bg }) => (
            <div key={label} style={styles.card}>
              <div style={{ ...styles.iconBadge, backgroundColor: bg, color: color }}>{icon}</div>
              <div>
                <p style={styles.statValue}>{value}</p>
                <p style={styles.statLabel}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row de Contenedores Visuales */}
        <div style={styles.chartsGrid}>

          {/* GRÁFICO DE BARRAS NATIVO CON CSS */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Promedio vs Objetivo por KPI</h2>
            {chartData.length === 0 ? (
              <p style={styles.emptyText}>Sin datos disponibles</p>
            ) : (
              <div style={styles.nativeChartWrapper}>
                {chartData.map((kpi, index) => {
                  const maxValor = Math.max(...chartData.map(k => Math.max(k.promedio, k.objetivo)), 1);
                  const alturaPromedio = Math.min(100, Math.max(10, (kpi.promedio / maxValor) * 100));
                  const alturaObjetivo = Math.min(100, Math.max(10, (kpi.objetivo / maxValor) * 100));

                  return (
                    <div key={index} style={styles.chartColumn}>
                      <div style={styles.barsContainer}>
                        {/* Barra Promedio (Azul) */}
                        <div
                          title={`Promedio actual: ${kpi.promedio}`}
                          style={{ ...styles.nativeBar, height: `${alturaPromedio}%`, backgroundColor: '#3b82f6' }}
                        />
                        {/* Barra Objetivo (Verde) */}
                        <div
                          title={`Valor objetivo: ${kpi.objetivo}`}
                          style={{ ...styles.nativeBar, height: `${alturaObjetivo}%`, backgroundColor: '#10b981' }}
                        />
                      </div>
                      <span style={styles.chartLabel} title={kpi.nombre}>
                        {kpi.nombre.length > 10 ? `${kpi.nombre.substring(0, 8)}..` : kpi.nombre}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Leyenda simple */}
            {chartData.length > 0 && (
              <div style={styles.legendContainer}>
                <div style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#3b82f6'}} /> Promedio actual</div>
                <div style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#10b981'}} /> Valor objetivo</div>
              </div>
            )}
          </div>

          {/* Lista de progreso de estados */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Estado de KPIs</h2>
            {chartData.length === 0 ? (
              <p style={styles.emptyText}>No hay KPIs registrados para calcular progreso</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {chartData.map((kpi, i) => {
                  const metaKpi = kpi.objetivo > 0 ? kpi.objetivo : 100;
                  const pct = Math.min(100, Math.round((kpi.promedio / metaKpi) * 100));
                  const barColor = pct >= 100 ? '#10b981' : pct >= 60 ? '#3b82f6' : '#f59e0b';

                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: '500', textAlign: 'left' }}>{kpi.nombre}</span>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                          {kpi.promedio} / {kpi.objetivo}
                        </span>
                      </div>
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressBar, width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// MAPA DE ESTILOS INLINE
const styles = {
  container: { backgroundColor: '#020617', padding: '12px 0', fontFamily: "'Segoe UI', Roboto, sans-serif", color: '#f1f5f9', boxSizing: 'border-box' },
  centerContainer: { minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: '24px', fontWeight: '600', color: '#f8fafc', margin: 0, textAlign: 'left' },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px', margin: 0, textAlign: 'left' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '20px', margin: 0, textAlign: 'left' },
  iconBadge: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px', flexShrink: 0 },
  statValue: { fontSize: '24px', fontWeight: '600', fontFamily: 'monospace', color: '#f8fafc', margin: 0, textAlign: 'left' },
  statLabel: { fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0, textAlign: 'left' },
  progressTrack: { width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: '9999px', transition: 'width 0.5s ease-in-out' },
  emptyText: { fontSize: '14px', color: '#475569', textAlign: 'center', padding: '32px 0', margin: 0 },
  nativeChartWrapper: { display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', padding: '10px 0', borderBottom: '1px solid #1e293b', gap: '12px' },
  chartColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barsContainer: { display: 'flex', alignItems: 'flex-end', gap: '6px', width: '100%', height: '100%', justifyContent: 'center', marginBottom: '8px' },
  nativeBar: { width: '16px', borderRadius: '4px 4px 0 0', transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)' },
  chartLabel: { fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '4px', whiteSpace: 'nowrap' },
  legendContainer: { display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' },
  legendItem: { fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  legendDot: { width: '10px', height: '10px', borderRadius: '3px', display: 'inline-block' },
  formRow: { display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', alignItems: 'flex-end' },
  inputGroup: { display: 'flex', flexDirection: 'column', flex: '1 1 200px', gap: '6px' },
  label: { fontSize: '12px', color: '#94a3b8', fontWeight: '500', textAlign: 'left' },
  input: { backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '10px 12px', fontSize: '14px', color: '#f1f5f9', outline: 'none', width: '100%', boxSizing: 'border-box' },
  button: { backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', height: '42px', transition: 'background-color 0.2s' }
};

export default DashboardPage;