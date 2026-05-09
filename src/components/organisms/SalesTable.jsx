import { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';
import { SalesDetailModal } from './SalesDetailModal'; // Importamos el modal

export const SalesTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- NUEVOS ESTADOS ---
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const handleShowDetail = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };
  // ----------------------

  const filteredData = data.filter(item =>
    item.idTransaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <>
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
            {filteredData.map((item) => (
              <tr key={item.idTransaccion}>
                <td>
                  <Badge bg="light" text="dark" className="border px-2 py-1">
                    {item.idTransaccion}
                  </Badge>
                </td>
                <td>{item.fecha}</td>
                <td><Badge bg={item.canal === 'E-Commerce' ? 'info' : 'primary'}>{item.canal}</Badge></td>
                <td>{item.cliente}</td>
                <td className="fw-bold">{formatCurrency(item.total)}</td>
                <td>
                  <Badge bg={item.estado === 'Completada' ? 'success' : 'warning'}>
                    {item.estado}
                  </Badge>
                </td>
                <td>
                  {/* Al hacer clic, activamos el modal con los datos de esta venta */}
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleShowDetail(item)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Renderizamos el modal y le pasamos los estados */}
      <SalesDetailModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        transaction={selectedSale}
      />
    </>
  );
};