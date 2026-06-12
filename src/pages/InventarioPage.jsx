import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InventoryTable } from '../components/organisms/InventoryTable';
import { Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../components/context/AuthContext.jsx';
// 🎯 STEP 1: Importamos el Modal de creación que construimos juntos
import { ProductCreateModal } from '../components/organisms/ProductCreateModal';

export const InventarioPage = () => {
  const authContext = useAuth();
  let user = authContext?.user;

  if (!user) {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        user = JSON.parse(localUser);
      } catch {
        user = null;
      }
    }
  }

  const userSucursalId = user?.sucursalId || user?.user?.sucursalId || null;
  const rolesDelUsuario = user?.roles || (user?.user?.roles) || (user?.role ? [user.role] : []) || [];
  const rolesNormalizados = rolesDelUsuario.map(r => String(r).toUpperCase());

  const esAdmin = rolesNormalizados.some(r => r.includes('ADMIN'));
  const esGerente = rolesNormalizados.some(r => r.includes('GERENTE'));
  const tienePaseGlobal = esAdmin;
  const esUsuarioRestringido = !tienePaseGlobal;

  // Estados de catálogos
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 STEP 2: Control de estado booleano para abrir/cerrar el modal
  const [showModalCrear, setShowModalCrear] = useState(false);
  // Un contador simple para forzar la recarga del inventario tras crear un producto
  const [refreshCounter, setRefreshCounter] = useState(0);

  const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8086';

  // 1. Carga inicial ultra-segura
  useEffect(() => {
    const cargarCatalogosIniciales = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const resSuc = await fetch(`${API_URL}/api/sucursales`, { headers });
        if (!resSuc.ok) throw new Error('El servidor no respondió correctamente al pedir sucursales.');
        const dataSuc = await resSuc.json();

        if (Array.isArray(dataSuc) && dataSuc.length > 0) {
          if (tienePaseGlobal) {
            setSucursales(dataSuc);
            if (!sucursalSeleccionada) setSucursalSeleccionada(String(dataSuc[0]?.id || ''));
          } else if (userSucursalId) {
            const miSucursal = dataSuc.find(suc => suc.id === Number(userSucursalId));
            if (miSucursal) {
              setSucursales([miSucursal]);
              setSucursalSeleccionada(String(miSucursal.id));
            } else {
              setSucursalSeleccionada(String(userSucursalId));
            }
          }
        } else {
          setSucursales([]);
        }

        const resProd = await fetch(`${API_URL}/api/productos`, { headers });
        if (!resProd.ok) throw new Error('El servidor no respondió correctamente al pedir catálogo de productos.');
        const dataProd = await resProd.json();
        setProductosCatalogo(Array.isArray(dataProd) ? dataProd : []);

        try {
          const resCat = await fetch(`${API_URL}/api/categorias`, { headers });
          if (resCat.ok) {
            const dataCat = await resCat.json();
            setCategorias(Array.isArray(dataCat) ? dataCat : []);
          }
        } catch (catErr) {
          console.warn("ms-categorias no disponible", catErr);
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
    // 🎯 Añadimos refreshCounter para que si se crea un producto, se vuelva a gatillar este fetch completo
  }, [tienePaseGlobal, userSucursalId, refreshCounter]);

  // 2. Acoplador dinámico blindado contra nulos
  const [inventarioFiltrado, setInventarioFiltrado] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);

  useEffect(() => {
    if (!sucursalSeleccionada || !Array.isArray(productosCatalogo) || productosCatalogo.length === 0) return;

    const cargarInventarioDeSucursal = async () => {
      try {
        setLoadingStock(true);
        const token = localStorage.getItem('token');

        const resStock = await fetch(`${API_URL}/api/stock/sucursal/${sucursalSeleccionada}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const dataStock = resStock.ok ? await resStock.json() : [];
        const seguroStock = Array.isArray(dataStock) ? dataStock : [];

        const productosDeEstaSucursal = seguroStock
            .map(itemStock => {
              if (!itemStock) return null;

              const infoProducto = productosCatalogo.find(p => String(p?.id) === String(itemStock?.productoId));
              if (!infoProducto) return null;

              const registroCategoria = categorias.find(c => String(c?.id) === String(infoProducto?.categoriaId));
              const nombreCategoriaReal = registroCategoria ? registroCategoria.nombre : `Categoría ${infoProducto?.categoriaId}`;
              const cantidadStock = itemStock?.cantidadDisponible !== undefined ? itemStock.cantidadDisponible : 0;

              return {
                id: itemStock.productoId,
                sku: infoProducto.sku || 'S/S',
                nombreProducto: infoProducto.nombre || 'Producto sin nombre',
                nombreCategoria: nombreCategoriaReal,
                precio: infoProducto.precio || 0,
                stockTotalDisponible: cantidadStock,
                activo: infoProducto.activo ?? true
              };
            })
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

  // 🎯 STEP 3: Declaramos las funciones operativas del Modal
  const handleAbrirModalCrearProducto = () => {
    setShowModalCrear(true);
  };

  const handleProductoCreadoConExito = () => {
    // Incrementamos el contador para forzar al useEffect a ir a buscar el nuevo catálogo a la base de datos
    setRefreshCounter(prev => prev + 1);
  };

  const productosDisponibles = inventarioFiltrado.filter(p => p.stockTotalDisponible > 0);
  const productosAgotados = inventarioFiltrado.filter(p => p.stockTotalDisponible === 0);

  return (
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Control de Inventario por Sucursal</h2>
            <p className="text-muted">Mostrando exclusivamente las existencias asignadas a este local.</p>
          </div>

          {/* 🎯 STEP 4: El botón ahora gatilla correctamente la función declarada arriba */}
          <button
              className="btn bg-success text-white btn-lg shadow-sm"
              onClick={handleAbrirModalCrearProducto}
            >
              📦 Añadir Nuevo Producto
          </button>

          {!loading && !error && sucursales.length > 0 && (
              <div style={{ minWidth: '240px' }}>
                <Form.Label className="fw-bold text-secondary" style={{ fontSize: '13px' }}>Sucursal Activa</Form.Label>
                <Form.Select
                    value={sucursalSeleccionada}
                    onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    className="bg-dark text-white border-secondary"
                    disabled={esUsuarioRestringido}
                >
                  {sucursales.map(suc => (
                      <option key={suc.id} value={suc.id}>{suc.nombre || `Sucursal ${suc.id}`}</option>
                  ))}
                </Form.Select>
                {esUsuarioRestringido && (
                    <span className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>🔒 Bloqueado por tu rol de asignación local</span>
                )}
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
            <Alert variant="danger" className="my-4">
              <h4>⚠️ Error de infraestructura detectado</h4>
              <p className="mb-0">{error}</p>
              <small className="d-block mt-2 text-muted">Asegúrate de que tus microservicios y el API Gateway estén encendidos en el puerto 8086.</small>
            </Alert>
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

        {/* 🎯 STEP 5: Inyectamos el componente Modal al final de la vista */}
        <ProductCreateModal
          show={showModalCrear}
          onHide={() => setShowModalCrear(false)}
          onSaveSuccess={handleProductoCreadoConExito}
        />
      </DashboardLayout>
  );
};

export default InventarioPage;