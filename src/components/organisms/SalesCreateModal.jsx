import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import { postCrearVenta } from '../../services/ventaService';

export const SalesCreateModal = ({ show, onHide, onSaveSuccess }) => {
  const { user } = useAuth();

  // 🏢 1. ID de Sucursal de la sesión activa
  const userSucursalId = user?.sucursalId || user?.sucursal || user?.idSucursal || 7;

  // Estados de datos maestros (Catálogos)
  const [productos, setProductos] = useState([]);
  const [nombreSucursalReal, setNombreSucursalReal] = useState('Cargando sucursal...');

  // Estados del Formulario
  const [productoId, setProductoId] = useState('');
  const [origen, setOrigen] = useState('POS');
  const [cantidad, setCantidad] = useState(1);
  const [precioSeleccionado, setPrecioSeleccionado] = useState(0);
  const [stockMaximo, setStockMaximo] = useState(0);

  // Estados Operativos
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  // 🔄 Resetear el formulario al cerrar o cancelar
  const handleClose = () => {
    setProductoId('');
    setOrigen('POS');
    setCantidad(1);
    setPrecioSeleccionado(0);
    setStockMaximo(0);
    setErrorForm(null);
    onHide();
  };

  // 🔄 Carga dinámica de catálogos al abrir el Modal
  useEffect(() => {
    if (!show) return;

    const cargarCatalogosMaster = async () => {
      setLoadingCatalogos(true);
      setErrorForm(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorForm("❌ Sesión inválida o expirada. Por favor, vuelve a iniciar sesión.");
        setLoadingCatalogos(false);
        return;
      }

      try {
        // A. Traer Nombre de la Sucursal
        const resSuc = await fetch(`${import.meta.env.VITE_BFF_URL}/bff/ventas/sucursales-activas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (resSuc.ok) {
          const listaSucursales = await resSuc.json();
          const miSucursal = listaSucursales.find(s => Number(s.id) === Number(userSucursalId));
          if (miSucursal) setNombreSucursalReal(miSucursal.nombre);
          else setNombreSucursalReal(`Sucursal N° ${userSucursalId}`);
        }

        // B. Traer Catálogo de Productos desde la ruta real de tu BFF
        const resProd = await fetch(`${import.meta.env.VITE_BFF_URL}/bff/catalogo/lista`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (resProd.ok) {
          const listaProductos = await resProd.json();
          setProductos(Array.isArray(listaProductos) ? listaProductos : []);
        } else {
          setProductos([]);
          if (resProd.status === 403) {
            setErrorForm("❌ Error 403 Forbidden: No tienes los roles/permisos necesarios en el BFF.");
          } else {
            setErrorForm(`⚠️ Error del servidor backend (Código: ${resProd.status})`);
          }
        }
      } catch (err) {
        console.error("⚠️ Error cargando catálogos del modal:", err);
        setProductos([]);
        setErrorForm("No se pudieron sincronizar los inventarios debido a un fallo de red.");
      } finally {
        setLoadingCatalogos(false);
      }
    };

    cargarCatalogosMaster();
  }, [show, userSucursalId]);

  // 🎯 Interceptor al cambiar de producto
  const handleProductoChange = (idSeleccionado) => {
    setProductoId(idSeleccionado);
    setErrorForm(null);

    if (!idSeleccionado) {
      setPrecioSeleccionado(0);
      setStockMaximo(0);
      setCantidad(1);
      return;
    }

    const prodEncontrado = productos.find(p => String(p.id) === String(idSeleccionado));
    if (prodEncontrado) {
      setPrecioSeleccionado(prodEncontrado.precio || 0);

      // 🎯 Sincronizado estrictamente con tu CatalogoDashboardDTO real
      const stockReal = prodEncontrado.stockTotalDisponible ?? 0;
      setStockMaximo(stockReal);

      if (stockReal <= 0) {
        setErrorForm(`❌ El producto seleccionado no cuenta con unidades disponibles.`);
        setCantidad(0);
      } else {
        setCantidad(1);
      }
    }
  };

  const handleCantidadChange = (valorIngresado) => {
    const num = parseInt(valorIngresado) || 0;
    if (num > stockMaximo) {
      setErrorForm(`⚠️ Inventario Insuficiente: Solo quedan ${stockMaximo} unidades disponibles.`);
      setCantidad(stockMaximo);
    } else {
      setErrorForm(null);
      setCantidad(Math.max(0, num));
    }
  };

  const montoTotalCalculado = precioSeleccionado * cantidad;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cantidad <= 0 || !productoId) {
      setErrorForm("Por favor, seleccione un producto y una cantidad válida igual o superior a 1.");
      return;
    }

    setErrorForm(null);
    setSubmitting(true);

    const payloadVenta = {
      sucursalId: Number(userSucursalId),
      productoId: Number(productoId),
      origen: origen.trim().toUpperCase(),
      cantidad: Number(cantidad),
      montoTotal: Number(montoTotalCalculado)
    };

    try {
      await postCrearVenta(payloadVenta);
      handleClose(); // Resetea y cierra con éxito
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Error procesando venta:", err);
      setErrorForm(err.message || 'Error al procesar la transacción.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-dark">
          🛒 Registrar Nueva Venta
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorForm && (
            <Alert variant={errorForm.includes('❌') || errorForm.includes('Error') ? 'danger' : 'warning'} className="py-2">
              {errorForm}
            </Alert>
          )}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-muted fw-semibold small mb-1">SUCURSAL OPERATIVA</Form.Label>
                <Form.Control
                  type="text"
                  value={loadingCatalogos ? "Buscando nombre comercial..." : nombreSucursalReal}
                  disabled
                  className="bg-light fw-bold text-primary"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Seleccionar Producto (*)</Form.Label>
                <Form.Select
                  required
                  value={productoId}
                  onChange={(e) => handleProductoChange(e.target.value)}
                  disabled={loadingCatalogos || productos.length === 0}
                >
                  <option value="">
                    {productos.length === 0 ? '-- No hay productos disponibles --' : '-- Seleccione un artículo del catálogo --'}
                  </option>
                  {productos.map((p) => (
                    /* 🎯 CORREGIDO: Reemplazado key={p.sku} por key={p.id} para evitar llaves "S/N" duplicadas */
                    <option key={p.id} value={p.id}>
                      {p.nombreProducto} [{p.sku}] - {new Intl.NumberFormat('es-CL', {style: 'currency', currency: 'CLP'}).format(p.precio)} (Stock: {p.stockTotalDisponible ?? 0} u.)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Origen / Canal</Form.Label>
                <Form.Select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                >
                  <option value="POS">Físico (POS)</option>
                  <option value="WEB">E-Commerce (WEB)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} >
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">
                  Cantidad {productoId && <span className="text-muted font-monospace">({stockMaximo} máx.)</span>}
                </Form.Label>
                <Form.Control
                  type="number"
                  required
                  min="1"
                  max={stockMaximo}
                  disabled={!productoId || stockMaximo <= 0}
                  value={cantidad}
                  onChange={(e) => handleCantidadChange(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="bg-light p-3 rounded border mt-3 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block fw-semibold">VALOR NETO TRANSACCIÓN</span>
                <small className="text-secondary">Precios unitarios con IVA incluído</small>
              </div>
              <div className="h3 fw-bold text-success mb-0">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(montoTotalCalculado)}
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting || !productoId || cantidad <= 0}>
            {submitting ? 'Guardando...' : 'Confirmar Venta'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SalesCreateModal;