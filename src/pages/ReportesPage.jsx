import { DashboardLayout } from '../components/templates/DashboardLayout';
import { HistorialReportes } from '../components/organisms/HistorialReportes';
import { FormularioReporte } from '../components/organisms/FormularioReporte';

export const ReportesPage = () => {
  return (
    <DashboardLayout>
      <div className="container mt-4">
          <h2 className="mb-4">Generación de Reportes</h2>
          
          <div className="card shadow-sm mb-5">
              <div className="card-body">
                  <h4 className="card-title">Nuevo Reporte</h4>
                  <p className="text-muted">Configura y emite un nuevo documento de cumplimiento.</p>
                  
                  {/* Insertamos el Organismo del Formulario aquí */}
                  <FormularioReporte />
                  
              </div>
          </div>

          <div className="card shadow-sm">
              <div className="card-body">
                  <h4 className="card-title mb-3">Historial de Emisiones</h4>
                  <HistorialReportes />
              </div>
          </div>
      </div>
    </DashboardLayout>
  );
};