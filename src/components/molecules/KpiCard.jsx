import { Card } from 'react-bootstrap';

export const KpiCard = ({ title, value, colorClass }) => {
  return (
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