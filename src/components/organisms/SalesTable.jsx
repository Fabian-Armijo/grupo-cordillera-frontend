import React, { useState } from 'react';
import { Table, Form, InputGroup, Badge } from 'react-bootstrap';
import { SalesDetailModal } from './SalesDetailModal';

// 🎯 RECIBE EL PARÁMETRO "data" DESDE LA PÁGINA PADRE
export const SalesTable = ({ data = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const handleShowDetail = (sale) => {
        setSelectedSale(sale);
        setShowModal(true);
    };

    // 🔍 FILTRADO CORREGIDO: Buscamos usando las propiedades reales del DTO de Ventas
    const filteredData = data.filter(item => {
        const idTx = String(item.id || '');
        const sucursalNom = String(item.nombreSucursal || '');
        const skuProd = String(item.skuProducto || '');

        return idTx.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sucursalNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
               skuProd.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '$0';
        if (typeof value === 'string') return value;
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(value);
    };

    return (
        <>
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">Registro de Transacciones</h5>

                    <InputGroup style={{ width: '320px' }}>
                        <Form.Control
                            placeholder="Buscar por ID, Sucursal o SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </div>

                <Table responsive hover className="align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID Transacción</th>
                            <th>Fecha / Hora</th>
                            <th>Canal / Origen</th>
                            <th>Sucursal Asignada</th>
                            <th>Producto / SKU</th>
                            <th>Monto Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                /* 🎯 Combinamos id con index para romper cualquier duplicado */
                                <tr key={`${item.id || 'tx'}-${index}`}>
                                    <td>
                                        <Badge bg="light" text="dark" className="border px-2 py-1">
                                            #{item.id}
                                        </Badge>
                                    </td>

                                    {/* 🎯 CORREGIDO: Muestra la fecha real del DTO */}
                                    <td>{item.fechaVenta || item.fecha_venta}</td>

                                    <td>
                                        {/* 🎯 CORREGIDO: Muestra el origen/canal real de la venta */}
                                        <Badge bg={item.origen === 'E-Commerce' || item.origen === 'ONLINE' ? 'info' : 'primary'}>
                                            {item.origen || 'Físico'}
                                        </Badge>
                                    </td>

                                    {/* 🎯 CORREGIDO: Muestra el string nominal dinámico proveniente de la BD */}
                                    <td className="fw-semibold text-dark">{item.nombreSucursal}</td>

                                    {/* 🎯 CORREGIDO: Muestra el identificador del producto */}
                                    <td><small className="text-muted">{item.skuProducto}</small></td>

                                    {/* 🎯 CORREGIDO: Formatea el monto real mapeado en VentasPage */}
                                    <td className="fw-bold">{formatCurrency(item.montoTotal)}</td>

                                    <td>
                                        <Badge bg="success">Procesada</Badge>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleShowDetail(item)}
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 text-muted">
                                    No se encontraron transacciones para "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <SalesDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                transaction={selectedSale}
            />
        </>
    );
};

export default SalesTable;