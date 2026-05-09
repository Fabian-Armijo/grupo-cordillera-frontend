import { DashboardLayout } from '../components/templates/DashboardLayout';
import { SalesTable } from '../components/organisms/SalesTable';

// Simulamos los datos provenientes del microservicio de gestión
const mockSalesData = [
  { 
    idTransaccion: 'TRX-9821', 
    fecha: '08-05-2026 14:30', 
    canal: 'E-Commerce', 
    cliente: 'Empresa Alpha SpA', 
    total: 1250000, 
    estado: 'Completada' 
  },
  { 
    idTransaccion: 'TRX-9822', 
    fecha: '08-05-2026 15:45', 
    canal: 'Punto de Venta', 
    cliente: 'Juan Pérez', 
    total: 45000, 
    estado: 'Completada' 
  },
  { 
    idTransaccion: 'TRX-9823', 
    fecha: '09-05-2026 09:15', 
    canal: 'E-Commerce', 
    cliente: 'Consultora Sur', 
    total: 850000, 
    estado: 'Pendiente' 
  },
  { 
    idTransaccion: 'TRX-9824', 
    fecha: '09-05-2026 11:20', 
    canal: 'Punto de Venta', 
    cliente: 'Cliente Mostrador', 
    total: 120000, 
    estado: 'Cancelada' 
  },
  { 
    idTransaccion: 'TRX-9825', 
    fecha: '09-05-2026 16:00', 
    canal: 'E-Commerce', 
    cliente: 'Tecnologías Globales', 
    total: 3200000, 
    estado: 'Completada' 
  },
];

export const VentasPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2>Gestión de Ventas</h2>
        <p className="text-muted">
          Monitoreo de transacciones unificadas provenientes de comercio electrónico y sucursales físicas.
        </p>
      </div>

      <SalesTable data={mockSalesData} />
    </DashboardLayout>
  );
};