import { Card } from 'react-bootstrap';

// Recibimos title, value y colorClass como "props" (propiedades)
export const KpiCard = ({ title, value, colorClass }) => {
  return (
    // Usamos clases de Bootstrap para dar una sombra suave y un borde de color a la izquierda
    <Card className={`shadow-sm border-0 border-start border-4 ${colorClass} h-100`}>
      <Card.Body>
        <p className="text-muted mb-1 text-uppercase" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
          {title}
        </p>
        <h3 className="mb-0 text-dark fw-bold">
          {value}
        </h3>
      </Card.Body>
    </Card>
  );
};