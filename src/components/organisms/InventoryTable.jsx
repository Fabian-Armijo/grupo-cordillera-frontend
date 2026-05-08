import { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';

export const InventoryTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
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
            <th>ID</th>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Costo</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><code>{item.sku}</code></td>
                <td className="fw-bold">{item.nombre}</td>
                
                {/* --- SOLUCIÓN APLICADA AQUÍ --- */}
                <td>
                  <div 
                    style={{ 
                      maxHeight: '65px',   // Altura máxima antes de mostrar el scroll
                      overflowY: 'auto',   // Agrega scroll vertical solo si es necesario
                      minWidth: '220px',   // Evita que la columna se comprima demasiado
                      whiteSpace: 'normal',// Permite que el texto baje a la siguiente línea
                      fontSize: '0.9rem'   // Letra ligeramente más pequeña para leer mejor
                    }} 
                    className="pe-2 text-secondary"
                  >
                    {item.descripcion}
                  </div>
                </td>
                {/* ------------------------------- */}

                <td>{item.categoria}</td>
                <td className="text-secondary">{formatCurrency(item.costo)}</td>
                <td className="text-success fw-bold">{formatCurrency(item.precio)}</td>
                <td>
                  <Badge bg={item.activo ? 'success' : 'danger'}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary">Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-muted">
                No se encontraron productos con ese término.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};