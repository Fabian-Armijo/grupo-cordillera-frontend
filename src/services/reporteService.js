// Apuntamos al Gateway, que redirigirá al microservicio de Reportes
const API_URL = import.meta.env.VITE_BFF_URL || 'http://localhost:8086';
const BASE_PATH = `${API_URL}/bff/reportes`;

export const obtenerHistorialReportes = async () => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${BASE_PATH}/historial`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener el historial de reportes');
        }
        return await response.json();
    } catch (error) {
        console.error("Error de conexión:", error);
        throw error;
    }
};

export const descargarReporteAntiguo = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/historial/${id}/descargar`;
        
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al descargar el PDF histórico');
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const enlace = document.createElement('a');
        enlace.href = blobUrl;
        enlace.download = `Reporte_Historico_Grupo_Cordillera_${id}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        
        enlace.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error al descargar el reporte histórico:", error);
        throw error;
    }
};

export const generarYDescargarReporte = async (periodo) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/descargar?kpiId=1&sucursalId=1&periodo=${periodo}`;
        
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al generar el PDF');
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const enlace = document.createElement('a');
        enlace.href = blobUrl;
        enlace.download = `Reporte_Cordillera_${periodo}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        
        enlace.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error al descargar:", error);
        throw error;
    }
};

export const enviarReportePorCorreo = async (periodo, correoDestino) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/enviar?kpiId=1&sucursalId=1&periodo=${periodo}&correoDestino=${correoDestino}`;
        
        const response = await fetch(url, { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al enviar el correo');
        
        return await response.text(); 
    } catch (error) {
        console.error("Error al enviar:", error);
        throw error;
    }
};

export const obtenerUrlPrevisualizacion = async (periodo) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/previsualizar?kpiId=1&sucursalId=1&periodo=${periodo}`;
        
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error al previsualizar el PDF');
        
        const blob = await response.blob();
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error al previsualizar:", error);
        throw error;
    }
};