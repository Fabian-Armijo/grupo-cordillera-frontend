import { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';

export const InventoryTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FILTRO SEGURO: Usamos los nombres del DTO de Java y evitamos nulos
  const filteredData = data.filter(item => {
    // Si viene nombreProducto lo usa, si no, usa string vacío para que toLowerCase no falle
    const nombre = item.nombreProducto || '';
    const sku = item.sku || '';

    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (value) => {
    // Si el valor es null o undefined, mostramos $0
    if (value === null || value === undefined) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Catálogo de Productos</h5>
        
        <InputGroup style={{ width: '320px' }}>
          <Form.Control
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table responsive hover className="align-middle">
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
              // Usamos index como key por si el DTO no trae ID todavía
              <tr key={item.id || index}>
                <td><code>{item.sku || 'SIN-SKU'}</code></td>
                <td className="fw-bold">{item.nombreProducto}</td>
                
                {/* Usamos el nombre exacto del DTO: nombreCategoria */}
                <td>{item.nombreCategoria}</td>
                
                <td className="text-success fw-bold">{formatCurrency(item.precio)}</td>
                
                {/* Mostramos el stock consolidado del BFF */}
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
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};