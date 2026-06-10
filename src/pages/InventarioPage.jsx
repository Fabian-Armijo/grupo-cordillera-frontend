import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InventoryTable } from '../components/organisms/InventoryTable';
import { Spinner, Alert, Form } from 'react-bootstrap';

export const InventarioPage = () => {
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]); // 🌟 Almacén para los nombres de categorías
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8086'; // API Gateway centralizado

  // 1. Carga inicial de Sucursales, Productos y Categorías desde el Gateway
  useEffect(() => {
    const cargarCatalogosIniciales = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // A. Cargar Sucursales
        const resSuc = await fetch(`${API_URL}/api/sucursales`, { headers });
        if (!resSuc.ok) throw new Error('No se pudieron cargar las sucursales');
        const dataSuc = await resSuc.json();
        setSucursales(dataSuc);
        if (dataSuc.length > 0) setSucursalSeleccionada(String(dataSuc[0].id));

        // B. Cargar catálogo maestro de productos
        const resProd = await fetch(`${API_URL}/api/productos`, { headers });
        if (!resProd.ok) throw new Error('No se pudo cargar el catálogo de productos');
        const dataProd = await resProd.json();
        setProductosCatalogo(dataProd);

        // C. 🌟 Cargar las Categorías reales de la Base de Datos
        try {
          const resCat = await fetch(`${API_URL}/api/categorias`, { headers });
          if (resCat.ok) {
            const dataCat = await resCat.json();
            setCategorias(dataCat);
          }
        } catch (catErr) {
          console.warn("ms-categorias no disponible, se usarán IDs por defecto", catErr);
        }

        setError(null);
      } catch (err) {
        console.error("Error al inicializar inventario:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarCatalogosIniciales();
  }, []);

  // 2. Acoplador dinámico por sucursal seleccionada
  const [inventarioFiltrado, setInventarioFiltrado] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  useEffect(() => {
    if (!sucursalSeleccionada || productosCatalogo.length === 0) return;

    const cargarInventarioDeSucursal = async () => {
      try {
        setLoadingStock(true);
        const token = localStorage.getItem('token');

        // Consultamos ms-stock para la sucursal activa
        const resStock = await fetch(`${API_URL}/api/stock/sucursal/${sucursalSeleccionada}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const dataStock = resStock.ok ? await resStock.json() : [];

        // Mapeamos y consolidamos la información
        const productosDeEstaSucursal = dataStock
          .map(itemStock => {
            // Buscamos el producto correspondiente en el catálogo maestro
            const infoProducto = productosCatalogo.find(p => String(p.id) === String(itemStock.productoId));

            // 🌟 Si el producto no existe en el catálogo maestro (registro huérfano), devolvemos null
            if (!infoProducto) return null;

            // 🌟 Buscamos el nombre de la categoría real usando el categoriaId del producto
            const registroCategoria = categorias.find(c => String(c.id) === String(infoProducto.categoriaId));
            const nombreCategoriaReal = registroCategoria ? registroCategoria.nombre : `Categoría ${infoProducto.categoriaId}`;

            const cantidadStock = itemStock.cantidadDisponible !== undefined ? itemStock.cantidadDisponible : 0;

            return {
              id: itemStock.productoId,
              sku: infoProducto.sku,
              nombreProducto: infoProducto.nombre,
              nombreCategoria: nombreCategoriaReal, // 🌟 Ahora sí dirá 'Computación', 'Telefonía', etc.
              precio: infoProducto.precio,
              stockTotalDisponible: cantidadStock,
              activo: infoProducto.activo
            };
          })
          // 🌟 Limpiamos la lista eliminando cualquier producto fantasma (null)
          .filter(p => p !== null);

        setInventarioFiltrado(productosDeEstaSucursal);
      } catch (err) {
        console.error("Error al filtrar por sucursal:", err);
      } finally {
        setLoadingStock(false);
      }
    };

    cargarInventarioDeSucursal();
  }, [sucursalSeleccionada, productosCatalogo, categorias]);

  // Clasificación de las listas limpias
  const productosDisponibles = inventarioFiltrado.filter(p => p.stockTotalDisponible > 0);
  const productosAgotados = inventarioFiltrado.filter(p => p.stockTotalDisponible === 0);

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Control de Inventario por Sucursal</h2>
          <p className="text-muted">Mostrando exclusivamente las existencias asignadas a este local.</p>
        </div>

        {/* SELECTOR SUCURSAL */}
        {!loading && !error && (
          <div style={{ minWidth: '240px' }}>
            <Form.Label className="fw-bold text-secondary" style={{ fontSize: '13px' }}>Sucursal Activa</Form.Label>
            <Form.Select
              value={sucursalSeleccionada}
              onChange={(e) => setSucursalSeleccionada(e.target.value)}
              className="bg-dark text-white border-secondary"
            >
              {sucursales.map(suc => (
                <option key={suc.id} value={suc.id}>{suc.nombre || `Sucursal ${suc.id}`}</option>
              ))}
            </Form.Select>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Sincronizando almacenes y categorías...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger">⚠️ Error de infraestructura: {error}</Alert>
      )}

      {!loading && !error && (
        <div style={{ opacity: loadingStock ? 0.5 : 1, transition: 'opacity 0.2s' }}>

          {/* TABLA 1: PRODUCTOS DISPONIBLES */}
          <div className="mb-5">
            <h4 className="mb-3 text-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📦</span> Productos Disponibles ({productosDisponibles.length})
            </h4>
            {productosDisponibles.length === 0 ? (
              <Alert variant="warning">No hay stock disponible para ningún producto en este local.</Alert>
            ) : (
              <InventoryTable data={productosDisponibles} />
            )}
          </div>

          <hr className="my-5" style={{ borderColor: '#1e293b' }} />

          {/* TABLA 2: PRODUCTOS AGOTADOS */}
          <div className="mb-4">
            <h4 className="mb-3 text-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> Productos Agotados ({productosAgotados.length})
            </h4>
            {productosAgotados.length === 0 ? (
              <Alert variant="dark" className="text-muted bg-opacity-10">Sin quiebres de stock registrados en esta sucursal.</Alert>
            ) : (
              <InventoryTable data={productosAgotados} />
            )}
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default InventarioPage;