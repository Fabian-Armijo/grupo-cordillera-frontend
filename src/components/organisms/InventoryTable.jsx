import { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';

export const InventoryTable = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro seguro contra nulos
  const filteredData = data.filter(item => {
    const nombre = item.nombreProducto || '';
    const sku = item.sku || '';

    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0 text-dark">Catálogo de Productos</h5>

        <InputGroup style={{ width: '320px' }}>
          <Form.Control
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table responsive hover className="align-middle m-0">
        <thead className="table-light">
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id || index}>
                <td><code>{item.sku || 'SIN-SKU'}</code></td>
                <td className="fw-bold text-dark">{item.nombreProducto}</td>
                <td className="text-secondary">{item.nombreCategoria}</td>
                <td className="text-success fw-bold">{formatCurrency(item.precio)}</td>
                <td>
                  <Badge bg={item.stockTotalDisponible > 10 ? 'success' : (item.stockTotalDisponible > 0 ? 'warning' : 'danger')}>
                    {item.stockTotalDisponible} unid.
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary">Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No se encontraron productos en esta sección.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};