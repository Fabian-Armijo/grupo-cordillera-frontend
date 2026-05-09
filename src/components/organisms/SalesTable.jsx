import { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';

export const SalesTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    item.idTransaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completada': return 'success';
      case 'Pendiente': return 'warning';
      case 'Cancelada': return 'danger';
      default: return 'secondary';
    }
  };

  const getChannelBadge = (channel) => {
    return channel === 'E-Commerce' ? 'info' : 'primary';
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Registro de Transacciones</h5>
        
        <InputGroup style={{ width: '320px' }}>
          <Form.Control
            placeholder="Buscar por ID o Cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table responsive hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>ID Transacción</th>
            <th>Fecha</th>
            <th>Canal</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.idTransaccion}>
                {/* --- CAMBIO APLICADO AQUÍ --- */}
                <td>
                  <Badge bg="light" text="dark" className="border px-2 py-1" style={{ fontSize: '0.9rem' }}>
                    {item.idTransaccion}
                  </Badge>
                </td>
                {/* ---------------------------- */}
                <td>{item.fecha}</td>
                <td>
                  <Badge bg={getChannelBadge(item.canal)}>
                    {item.canal}
                  </Badge>
                </td>
                <td>{item.cliente}</td>
                <td className="fw-bold">{formatCurrency(item.total)}</td>
                <td>
                  <Badge bg={getStatusBadge(item.estado)}>
                    {item.estado}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary">Ver Detalle</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                No se encontraron ventas con ese término.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};