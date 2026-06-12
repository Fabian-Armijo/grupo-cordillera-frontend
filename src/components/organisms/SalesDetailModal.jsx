import React from 'react';
import { Modal, Button, Table, Badge, Row, Col } from 'react-bootstrap';

export const SalesDetailModal = ({ show, onHide, transaction }) => {
  if (!transaction) return null;

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0';
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(value || 0);
  };

  // 🎯 CORREGIDO: Extrae el valor numérico usando la propiedad real "montoTotal"
  const totalNumerico = typeof transaction.montoTotal === 'string'
    ? Number(transaction.montoTotal.replace(/[^0-9]/g, ''))
    : transaction.montoTotal || 0;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        {/* 🎯 CORREGIDO: Muestra el ID real */}
        <Modal.Title>Detalle de Transacción: #{transaction.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <p className="text-muted mb-1">SUCURSAL OPERATIVA</p>
            {/* 🎯 CORREGIDO: Muestra el nombre dinámico reconciliado */}
            <h5 className="fw-bold text-primary">{transaction.nombreSucursal}</h5>

            <p className="text-muted mb-1 mt-3">FECHA Y HORA</p>
            {/* 🎯 CORREGIDO: Muestra la fecha del DTO */}
            <h6>{transaction.fechaVenta || transaction.fecha_venta}</h6>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-1">ESTADO</p>
            <Badge bg="success" className="mb-3">Procesada</Badge>

            <p className="text-muted mb-1">CANAL DE VENTA</p>
            {/* 🎯 CORREGIDO: Lee la propiedad "origen" */}
            <Badge bg={transaction.origen === 'E-Commerce' || transaction.origen === 'ONLINE' ? 'info' : 'primary'}>
                {transaction.origen || 'Físico'}
            </Badge>
          </Col>
        </Row>

        <h6 className="text-secondary fw-bold mb-3">Ítems Registrados</h6>
        <Table responsive className="border">
          <thead className="table-light">
            <tr>
              <th>Descripción / Identificador del Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* 🎯 CORREGIDO: Muestra el SKU o ID del producto */}
                <div className="fw-bold text-dark">{transaction.skuProducto}</div>
              </td>
              {/* 🎯 EXTRA: Agregamos la columna física de cantidad */}
              <td className="text-center">{transaction.cantidad || 1} u.</td>
              <td className="text-end fw-bold">{formatCurrency(totalNumerico)}</td>
            </tr>
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-3">
          <div className="text-end">
            <span className="h5 me-3">TOTAL TRANSACCIÓN:</span>
            <span className="h4 fw-bold text-success">
                {formatCurrency(totalNumerico)}
            </span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          Imprimir Comprobante
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalesDetailModal;