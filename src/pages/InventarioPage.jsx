import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InventoryTable } from '../components/organisms/InventoryTable';

// Estructura adaptada a las entidades que manejará el backend
const mockInventoryData = [
  { 
    id: 1, 
    sku: 'NOTE-001', 
    nombre: 'Notebook Corporativo i7', 
    descripcion: 'Notebook 16GB RAM, 512GB SSD ideal para desarrollo y áreas de gerencia.', 
    precio: 850000, 
    costo: 600000, 
    categoria: 'Electrónica', 
    activo: true 
  },
  { 
    id: 2, 
    sku: 'MON-027', 
    nombre: 'Monitor 27" 4K', 
    descripcion: 'Monitor IPS con ajuste de altura y filtro de luz azul.', 
    precio: 250000, 
    costo: 180000, 
    categoria: 'Electrónica', 
    activo: true 
  },
  { 
    id: 3, 
    sku: 'SIL-ERG', 
    nombre: 'Silla Ergonómica Pro', 
    descripcion: 'Silla con soporte lumbar, malla transpirable y reposabrazos ajustables 3D.', 
    precio: 120000, 
    costo: 75000, 
    categoria: 'Mobiliario', 
    activo: false 
  },
  { 
    id: 4, 
    sku: 'ESC-AJU', 
    nombre: 'Escritorio Ajustable', 
    descripcion: 'Escritorio standing desk eléctrico con memoria de posiciones.', 
    precio: 300000, 
    costo: 210000, 
    categoria: 'Mobiliario', 
    activo: true 
  },
  { 
    id: 5, 
    sku: 'TEC-MEC', 
    nombre: 'Teclado Mecánico', 
    descripcion: 'Teclado con switches rojos silenciosos, formato TKL.', 
    precio: 45000, 
    costo: 25000, 
    categoria: 'Accesorios', 
    activo: true 
  },
];

export const InventarioPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2>Control de Inventario</h2>
        <p className="text-muted">
          Catálogo maestro de productos. Los datos reflejan la estructura de las entidades del microservicio de gestión.
        </p>
      </div>

      <InventoryTable data={mockInventoryData} />
    </DashboardLayout>
  );
};