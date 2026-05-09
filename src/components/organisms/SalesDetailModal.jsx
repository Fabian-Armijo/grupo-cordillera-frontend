import { Modal, Button, Table, Badge, Row, Col } from 'react-bootstrap';

export const SalesDetailModal = ({ show, onHide, transaction }) => {
  // 1. Si no hay transacción seleccionada, no renderizamos nada
  if (!transaction) return null;

  // 2. Función para formatear moneda (puedes moverla a un helper)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP' 
    }).format(value || 0);
  };

  // 3. Cálculo de precio unitario (ya que en el DTO tenemos el total)
  // Evitamos el NaN verificando que la cantidad sea mayor a 0
  const precioUnitario = transaction.cantidad > 0 
    ? transaction.montoTotal / transaction.cantidad 
    : 0;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de Transacción: TRX-{transaction.id}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <p className="text-muted mb-1">CLIENTE / SUCURSAL</p>
            <h6 className="fw-bold">{transaction.nombreSucursal}</h6>
            
            <p className="text-muted mb-1 mt-3">FECHA Y HORA</p>
            <h6>{transaction.fechaFormateada || transaction.fechaVenta}</h6>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-1">ESTADO</p>
            <Badge bg="success" className="mb-3">Completada</Badge>
            
            <p className="text-muted mb-1">CANAL DE VENTA</p>
            <Badge bg={transaction.origen === 'E-Commerce' ? 'info' : 'primary'}>
                {transaction.origen}
            </Badge>
          </Col>
        </Row>

        <h6 className="text-primary fw-bold mb-3">Productos Adquiridos</h6>
        <Table responsive className="border">
          <thead className="table-light">
            <tr>
              <th>Producto</th>
              <th className="text-center">Cant.</th>
              <th className="text-end">Precio Unit.</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="fw-bold">{transaction.nombreProducto}</div>
                <small className="text-muted">SKU: {transaction.skuProducto}</small>
              </td>
              <td className="text-center">{transaction.cantidad}</td>
              <td className="text-end">{formatCurrency(precioUnitario)}</td>
              <td className="text-end">{formatCurrency(transaction.montoTotal)}</td>
            </tr>
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-3">
          <div className="text-end">
            <span className="h5 me-3">TOTAL:</span>
            <span className="h4 fw-bold text-primary">
                {formatCurrency(transaction.montoTotal)}
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