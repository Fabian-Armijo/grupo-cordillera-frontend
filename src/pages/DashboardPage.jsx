import { DashboardLayout } from '../components/templates/DashboardLayout';
import { KpiCard } from '../components/molecules/KpiCard';
import { Row, Col } from 'react-bootstrap';

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Resumen de Desempeño</h2>
      </div>

      {/* Fila para las tarjetas de métricas */}
      <Row className="g-4 mb-4">
        {/* Usamos Col md={4} para que cada tarjeta ocupe 1/3 del espacio en pantallas medianas/grandes */}
        <Col xs={12} md={4}>
          <KpiCard 
            title="Ventas Totales" 
            value="$45,230,000" 
            colorClass="border-primary"
          />
        </Col>
        
        <Col xs={12} md={4}>
          <KpiCard 
            title="Rentabilidad" 
            value="24.5%" 
            colorClass="border-success"
          />
        </Col>
        
        <Col xs={12} md={4}>
          <KpiCard 
            title="Rotación de Inventario" 
            value="4.2 veces" 
            colorClass="border-warning"
          />
        </Col>
      </Row>

      {/* Aquí podemos agregar Organismos como tablas de datos o gráficos */}
      <div className="bg-white p-4 rounded shadow-sm border text-center text-muted">
        <p className="mb-0">Espacio reservado para el gráfico de tendencias</p>
      </div>

    </DashboardLayout>
  );
};