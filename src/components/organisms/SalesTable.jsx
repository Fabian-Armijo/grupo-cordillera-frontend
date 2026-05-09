import { useState } from 'react';
import { Table, Form, InputGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useListarVentas } from '../../hooks/useListarVentas'; // Importamos tu hook de conexión
import { SalesDetailModal } from './SalesDetailModal';

export const SalesTable = () => {
    // 1. Conectamos con el Backend usando el Hook
    const { ventas, loading, error } = useListarVentas();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const handleShowDetail = (sale) => {
        setSelectedSale(sale);
        setShowModal(true);
    };

    // 2. Filtramos sobre los datos reales (ventas) que vienen del microservicio
    const filteredData = ventas.filter(item =>
        // Buscamos por el ID (que es numérico en el backend) o por el nombre de la sucursal
        item.id.toString().includes(searchTerm) || 
        item.nombreSucursal?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: 'CLP' 
        }).format(value);
    };

    // Manejo de estados de carga y error
    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando transacciones desde el servidor...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">Error al conectar con el microservicio: {error}</Alert>;
    }

    return (
        <>
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">Registro de Transacciones</h5>
                    <InputGroup style={{ width: '320px' }}>
                        <Form.Control
                            placeholder="Buscar por ID o Sucursal..."
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
                            <th>Sucursal (Cliente)</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <Badge bg="light" text="dark" className="border px-2 py-1">
                                        TRX-{item.id}
                                    </Badge>
                                </td>
                                {/* Usamos el campo fechaFormateada que viene de tu VentaResponseDto */}
                                <td>{item.fechaFormateada || item.fechaVenta}</td>
                                <td>
                                    <Badge bg={item.origen === 'E-Commerce' ? 'info' : 'primary'}>
                                        {item.origen}
                                    </Badge>
                                </td>
                                {/* Mostramos el nombre de la sucursal en el campo cliente */}
                                <td>{item.nombreSucursal}</td>
                                <td className="fw-bold">{formatCurrency(item.montoTotal)}</td>
                                <td>
                                    {/* Hardcodeamos "Completada" por ahora ya que no está en el DTO */}
                                    <Badge bg="success">Completada</Badge>
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
                        ))}
                    </tbody>
                </Table>
                
                {filteredData.length === 0 && (
                    <div className="text-center p-4 text-muted">
                        No se encontraron transacciones para "{searchTerm}"
                    </div>
                )}
            </div>

            <SalesDetailModal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                transaction={selectedSale}
            />
        </>
    );
};