import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InventoryTable } from '../components/organisms/InventoryTable';
import { Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../components/context/AuthContext.jsx';

export const InventarioPage = () => {
  const authContext = useAuth();
  let user = authContext?.user;

  // Respaldo de sesión
  // 💡 Respaldo de sesión limpio de alertas ESLint
  if (!user) {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        user = JSON.parse(localUser);
      } catch {
        // Ignoramos el error intencionalmente si el json es inválido
        user = null;
      }
    }
  }

  // Extracción segura de roles
  const rolesDelUsuario = user?.roles || (user?.user?.roles) || (user?.role ? [user.role] : []) || [];
  const rolesNormalizados = rolesDelUsuario.map(r => String(r).toUpperCase());
  const esAdminOGerente = rolesNormalizados.some(r => r.includes('ADMIN') || r.includes('GERENTE'));
  const esUsuarioOperativo = !esAdminOGerente;

  // Estados de catálogos
  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8086';

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

        // A. Cargar Sucursales con validación de datos
        const resSuc = await fetch(`${API_URL}/api/sucursales`, { headers });
        if (!resSuc.ok) throw new Error('El servidor no respondió correctamente al pedir sucursales.');
        const dataSuc = await resSuc.json();

        // Validamos que sea un arreglo válido y tenga elementos antes de setear
        if (Array.isArray(dataSuc) && dataSuc.length > 0) {
          setSucursales(dataSuc);
          setSucursalSeleccionada(String(dataSuc[0]?.id || ''));
        } else {
          setSucursales([]);
        }

        // B. Cargar catálogo maestro de productos
        const resProd = await fetch(`${API_URL}/api/productos`, { headers });
        if (!resProd.ok) throw new Error('El servidor no respondió correctamente al pedir catálogo de productos.');
        const dataProd = await resProd.json();
        setProductosCatalogo(Array.isArray(dataProd) ? dataProd : []);

        // C. Cargar Categorías de forma pasiva
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
  }, []);

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

  const productosDisponibles = inventarioFiltrado.filter(p => p.stockTotalDisponible > 0);
  const productosAgotados = inventarioFiltrado.filter(p => p.stockTotalDisponible === 0);

  return (
      <DashboardLayout>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Control de Inventario por Sucursal</h2>
            <p className="text-muted">Mostrando exclusivamente las existencias asignadas a este local.</p>
          </div>

          {!loading && !error && sucursales.length > 0 && (
              <div style={{ minWidth: '240px' }}>
                <Form.Label className="fw-bold text-secondary" style={{ fontSize: '13px' }}>Sucursal Activa</Form.Label>
                <Form.Select
                    value={sucursalSeleccionada}
                    onChange={(e) => setSucursalSeleccionada(e.target.value)}
                    className="bg-dark text-white border-secondary"
                    disabled={esUsuarioOperativo}
                >
                  {sucursales.map(suc => (
                      <option key={suc.id} value={suc.id}>{suc.nombre || `Sucursal ${suc.id}`}</option>
                  ))}
                </Form.Select>
                {esUsuarioOperativo && (
                    <span className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>🔒 Bloqueado por tu rol operativo</span>
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
      </DashboardLayout>
  );
};

export default InventarioPage;