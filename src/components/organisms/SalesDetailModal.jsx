import { Modal, Button, Table, Row, Col, Badge } from 'react-bootstrap';

export const SalesDetailModal = ({ show, onHide, transaction }) => {
  // Si no hay transacción seleccionada aún, no renderizamos nada
  if (!transaction) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Detalle de Transacción: {transaction.idTransaccion}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Información General de la Venta */}
        <Row className="mb-4">
          <Col md={6}>
            <p className="text-muted mb-1 small">CLIENTE</p>
            <h5 className="mb-3">{transaction.cliente}</h5>
            <p className="text-muted mb-1 small">FECHA Y HORA</p>
            <p className="fw-bold">{transaction.fecha}</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-1 small">ESTADO</p>
            <Badge bg={transaction.estado === 'Completada' ? 'success' : 'warning'} className="mb-3">
              {transaction.estado}
            </Badge>
            <p className="text-muted mb-1 small">CANAL DE VENTA</p>
            <p className="fw-bold">{transaction.canal}</p>
          </Col>
        </Row>

        {/* Tabla de Productos dentro de la venta (Mock Data interna) */}
        <h6 className="border-bottom pb-2 mb-3 text-primary">Productos Adquiridos</h6>
        <Table responsive borderless className="align-middle">
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
              <td>Notebook Corporativo i7</td>
              <td className="text-center">1</td>
              <td className="text-end">{formatCurrency(850000)}</td>
              <td className="text-end">{formatCurrency(850000)}</td>
            </tr>
            <tr>
              <td>Monitor 27" 4K</td>
              <td className="text-center">1</td>
              <td className="text-end">{formatCurrency(250000)}</td>
              <td className="text-end">{formatCurrency(250000)}</td>
            </tr>
          </tbody>
          <tfoot className="border-top">
            <tr>
              <td colSpan="3" className="text-end fw-bold py-3">TOTAL:</td>
              <td className="text-end fw-bold py-3 text-primary" style={{ fontSize: '1.2rem' }}>
                {formatCurrency(transaction.total)}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        <Button variant="primary">Imprimir Comprobante</Button>
      </Modal.Footer>
    </Modal>
  );
};