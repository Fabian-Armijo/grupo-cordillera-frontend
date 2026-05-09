
## 🏗️ Arquitectura del Sistema

La arquitectura se basa en microservicios utilizando un enfoque por capacidades de negocio. Se implementaron los siguientes patrones de diseño para garantizar escalabilidad y robustez:

* **API Gateway**: Punto de entrada único que centraliza las solicitudes, mejora la seguridad y reduce la latencia.
* **BFF (Backend for Frontend)**: Actúa como una capa de agregación para optimizar la comunicación entre el frontend y los microservicios de Producto, Categoría y Stock.
* **Repository Pattern**: Utilizado en los microservicios para gestionar el acceso a los datos de forma desacoplada.
* **Circuit Breaker**: Previene fallos en cadena, permitiendo que el sistema responda incluso si un servicio está lento o caído.

## 💻 Tecnologías

### Frontend
* **React 18** (Vite)
* **Bootstrap / React-Bootstrap** (Diseño responsivo)
* **Metodología de Diseño Atómico** (Atoms, Molecules, Organisms, Templates, Pages)
* **React Router Dom** (Navegación SPA)

### Backend & DevOps
* **Spring Boot (Java)** y **Django REST Framework (Python)**
* **PostgreSQL** (Base de datos relacional)


## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
Salida de códigoREADME_Completo_Cordillera.md

```bash
1. git clone https://github.com/Fabian-Armijo/grupo-cordillera-frontend.git
2. cd cordillera-frontend
3. Instalar dependenciasBashnpm install
4. Configurar variables de entornoCrea un archivo .env en la raíz del proyecto con la URL de tu API Gateway:Fragmento de códigoVITE_API_GATEWAY_URL=http://localhost:8090/bff
5. Ejecutar el proyectoBashnpm run dev
```
📂 Estructura del Proyecto (Atomic Design)src/components/atoms: Componentes base (Botones, Badges).src/components/molecules: Componentes funcionales simples (KpiCard).src/components/organisms: Componentes complejos y con estado (InventoryTable, SalesTable, Sidebar).src/components/templates: Estructuras de página (DashboardLayout).src/pages: Vistas finales que inyectan datos a los templates.src/hooks: Custom hooks para el consumo de la API (useInventory).src/services: Capa de servicios para peticiones HTTP.

📊 Integración con MicroserviciosEl frontend se comunica con el API Gateway (puerto 8090), el cual redirige las peticiones al BFF (puerto 8084). El flujo de datos principal para el inventario es:GET /bff/catalogo/lista -> Solicitado por el Custom Hook useInventory.El BFF orquesta las llamadas a los microservicios de Productos (8082), Categorías (8083) y Stock (8085).Los datos unificados se muestran en la InventoryTable (Organismo).

👥 Equipo de Trabajo
Gabriel Cuevas
Fabian Armijo
Elias Leon
Joaquin Fuenzalida
Profesor: Eric Bastian Ramirez Santis
Año 2026 - Proyecto de Plataforma de Monitoreo"""
