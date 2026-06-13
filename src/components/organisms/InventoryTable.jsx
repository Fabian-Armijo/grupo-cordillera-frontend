import React, { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';

// 🏢 Recibimos esAdmin para saber qué etiquetas e información mostrar
export const InventoryTable = ({ data = [], esAdmin = false }) => {
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
        {/* 🎯 Adaptación de Título según Rol */}
        <h5 className="m-0 text-dark">
          {esAdmin ? '📦 Catálogo Global de Productos' : '🏬 Inventario de Sucursal'}
        </h5>

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
            {/* 🎯 Adaptación de Cabecera según Rol */}
            <th>{esAdmin ? 'Stock Consolidado' : 'Stock Disponible'}</th>

          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              /* 🎯 CORRECCIÓN CLAVE: Combinamos el ID con el Index para asegurar llaves únicas
                 incluso si el backend repite registros por consolidación de datos */
              <tr key={`${item.id || 'prod'}-${index}`}>
                <td><code>{item.sku || 'SIN-SKU'}</code></td>
                <td className="fw-bold text-dark">{item.nombreProducto}</td>
                <td className="text-secondary">{item.nombreCategoria}</td>
                <td className="text-success fw-bold">{formatCurrency(item.precio)}</td>
                <td>
                  {/* 🎯 Nota de arquitectura: Asegúrate de que el backend mande en 'stockTotalDisponible'
                      únicamente el stock filtrado de la sucursal asignada cuando el rol NO sea ADMIN */}
                  <Badge bg={item.stockTotalDisponible > 10 ? 'success' : (item.stockTotalDisponible > 0 ? 'warning' : 'danger')}>
                    {item.stockTotalDisponible} unid.
                  </Badge>
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