import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { SalesTable } from '../components/organisms/SalesTable';
import { useAuth } from '../components/context/AuthContext.jsx';
import { getListaVentas } from '../services/ventaService';
import { SalesCreateModal } from '../components/organisms/SalesCreateModal';

export const VentasPage = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 CORREGIDO 1: Inicializamos el estado para abrir y cerrar el modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🎯 CORREGIDO 2: Sacamos la función para que sea reutilizable al cargar y al guardar con éxito
  const cargarDatosDesdeBff = async () => {
    try {
      setLoading(true);
      console.log("=== INICIANDO CONEXIÓN SEGURO MULTI-SUCURSAL CON BFF ===");

      const datosUnificados = await getListaVentas();

      const datosAdaptados = datosUnificados.map(v => {
        const idDeLaSucursal = v.sucursalId || v.sucursal_id;

        return {
          ...v,
          id: v.id,
          cantidad: v.cantidad || 0,
          origen: v.origen || 'Físico',
          fechaVenta: v.fechaVenta || v.fecha_venta || 'Sin fecha',
          montoTotal: v.montoTotal || v.monto_total || 0,
          skuProducto: v.skuProducto || v.sku_producto || v.productoId || v.producto_id || 'S/S',
          nombreSucursal: v.nombreSucursal || `Sucursal N° ${idDeLaSucursal || 7}`
        };
      });

      setVentas(datosAdaptados);
      console.log("=== TRANSACCIONES RECUPERADAS Y AISLADAS POR EL BFF CON ÉXITO ===");
    } catch (err) {
      console.error("Error crítico recuperando ventas desde BFF:", err);
      setError(err.message || 'No se pudieron cargar las transacciones comerciales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosDesdeBff();
  }, []);

  return (
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Gestión de Ventas</h2>
            <p className="text-muted mb-0">
              Monitoreo de transacciones unificadas provenientes de comercio electrónico y sucursales físicas.
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg shadow-sm"
            onClick={() => setShowCreateModal(true)} // 🎯 Ahora sí existe el estado
          >
            ➕ Registrar Nueva Venta
          </button>
        </div>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Cargando registros protegidos desde el BFF...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>⚠️ Error en el módulo de ventas:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <SalesTable data={ventas} userRole={userRole} />
        )}

        {/* 🎯 INYECCIÓN DEL MODAL REPARADO */}
        <SalesCreateModal
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            onSaveSuccess={cargarDatosDesdeBff} // 🎯 Apunta a la función real para refrescar la grilla
        />
      </DashboardLayout>
  );
};

export default VentasPage;