import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

export const ProductCreateModal = ({ show, onHide, onSaveSuccess }) => {
  // Estados para capturar los valores del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); // Guarda el ID numérico por detrás
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estados para almacenar y controlar las categorías dinámicas
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  // Estados de control de UI
  const [submitting, setSubmitting] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  // Variable de entorno unificada
  const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8086';

  // 🎯 EFECTO: Carga las categorías globales usando la ruta correcta del BFF
  useEffect(() => {
    if (!show) return;

    const cargarCategorias = async () => {
      setLoadingCategorias(true);
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/bff/catalogo/categorias`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        } else {
          console.error("⚠️ El BFF respondió con error al traer categorías:", response.status);
          setErrorForm(`No se pudieron cargar las categorías (Código: ${response.status})`);
        }
      } catch (err) {
        console.error("Error de red al traer categorías:", err);
        setErrorForm("Error de conexión al cargar las categorías.");
      } finally {
        setLoadingCategorias(false);
      }
    };

    cargarCategorias();
  }, [show, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm(null);
    setSubmitting(true);

    const token = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');

    let sucursalIdDelUsuario = null;
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser);
        sucursalIdDelUsuario = parsedUser?.sucursalId || parsedUser?.user?.sucursalId || null;
      } catch (err) {
        console.error("Error parseando usuario en modal", err);
      }
    }

    if (!token || !sucursalIdDelUsuario) {
      setErrorForm("❌ No se pudo identificar tu sesión o tu sucursal asignada.");
      setSubmitting(false);
      return;
    }

    if (!categoriaId) {
      setErrorForm("⚠️ Por favor, selecciona una categoría para el producto.");
      setSubmitting(false);
      return;
    }

    const categoriaSeleccionada = PatternCategorias(categoriaId);

    // 🎯 LÓGICA DE GENERACIÓN DE SKU CORPORATIVO REPARADA (Imagen 2)
    // Extrae las primeras 3 letras del input "nombre", las pasa a mayúsculas y añade 3 dígitos aleatorios.
    const prefijoLimpio = nombre.trim().length >= 3
      ? nombre.trim().substring(0, 3).toUpperCase()
      : "PRD";
    const numeroAleatorio = Math.floor(100 + Math.random() * 900);
    const skuFormateado = `COM${prefijoLimpio}-${numeroAleatorio}`;

    const payloadProducto = {
      nombre: nombre.trim(),
      sku: skuFormateado, // 🚀 Resultado estético: COMASD-482, COMQWE-129, etc.
      precio: Number(precio),
      costo: Number(costo),
      categoriaId: Number(categoriaId),
      categoriaNombre: categoriaSeleccionada ? categoriaSeleccionada.nombre : 'CAT',
      cantidadDisponible: cantidadDisponible === '' ? 0 : Number(cantidadDisponible),
      descripcion: descripcion.trim(),
      activo: true,
      sucursalId: Number(sucursalIdDelUsuario)
    };

    try {
      const response = await fetch(`${API_URL}/bff/catalogo/crear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadProducto)
      });

      if (response.ok) {
        // Limpieza profunda de campos
        setNombre('');
        setPrecio('');
        setCosto('');
        setCategoriaId('');
        setCantidadDisponible('');
        setDescripcion('');

        if (onSaveSuccess) onSaveSuccess();
        onHide();
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorForm(errData.message || `⚠️ Error en el servidor (Código: ${response.status})`);
      }
    } catch (err) {
      console.error("Error al registrar producto:", err);
      setErrorForm("No se pudo conectar con el BFF. Revisa las consolas de tus microservicios.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper rápido para buscar la categoría
  const PatternCategorias = (id) => {
    return categorias.find(cat => Number(cat.id) === Number(id));
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-dark">📦 Registrar Nuevo Producto</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorForm && <Alert variant="danger" className="py-2">{errorForm}</Alert>}

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Nombre del Producto (*)</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Ej: ASUS ROG Zephyrus"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Precio de Venta (*)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min="1"
                  placeholder="Monto al público"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Costo Base (*)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min="0"
                  placeholder="Costo de adquisición"
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Stock Inicial (*)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min="0"
                  placeholder="Cantidad en almacén"
                  value={cantidadDisponible}
                  onChange={(e) => setCantidadDisponible(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Categoría (*)</Form.Label>
                <Form.Select
                  required
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  disabled={loadingCategorias}
                >
                  <option value="">
                    {loadingCategorias ? '🔄 Cargando categorías...' : '-- Seleccione una Categoría --'}
                  </option>

                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold small mb-1">Descripción Breve</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Detalles adicionales del producto..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};