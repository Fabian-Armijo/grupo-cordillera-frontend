import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InventoryTable } from '../components/organisms/InventoryTable';
import { useInventory } from '../hooks/useInventory';
import { Spinner, Alert } from 'react-bootstrap';

export const InventarioPage = () => {
  // Usamos el hook para extraer los datos reales, si está cargando y si hubo error
  const { data, loading, error } = useInventory();

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2>Control de Inventario</h2>
        <p className="text-muted">
          Catálogo de productos.
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando inventario desde el servidor...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          Ocurrió un error de conexión: {error}
        </Alert>
      )}

      {!loading && !error && (
        <InventoryTable data={data} />
      )}
    </DashboardLayout>
  );
};