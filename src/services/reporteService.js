// src/services/reporteService.js

// Apuntamos al Gateway, que redirigirá al microservicio de Reportes
const API_URL = 'http://localhost:8090/api/reportes';

export const obtenerHistorialReportes = async () => {
    try {
        const response = await fetch(`${API_URL}/historial`);
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
        const url = `${API_URL}/historial/${id}/descargar`;
        const response = await fetch(url, { method: 'GET' });
        
        if (!response.ok) throw new Error('Error al descargar el PDF histórico');
        
        // 1. Convertimos la respuesta a Blob (archivo binario)
        const blob = await response.blob();
        
        // 2. Creamos la URL temporal
        const blobUrl = window.URL.createObjectURL(blob);
        
        // 3. Forzamos la descarga
        const enlace = document.createElement('a');
        enlace.href = blobUrl;
        enlace.download = `Reporte_Historico_Grupo_Cordillera_${id}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        
        // 4. Limpiamos la memoria
        enlace.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error al descargar el reporte histórico:", error);
        throw error;
    }
};

export const generarYDescargarReporte = async (periodo) => {
    try {
        // Asumiendo que el kpiId y sucursalId son 1 por defecto para esta prueba
        const url = `${API_URL}/descargar?kpiId=1&sucursalId=1&periodo=${periodo}`;
        const response = await fetch(url, { method: 'GET' });
        
        if (!response.ok) throw new Error('Error al generar el PDF');
        
        // 1. Transformamos la respuesta en un archivo binario (Blob)
        const blob = await response.blob();
        
        // 2. Creamos una URL temporal en la memoria del navegador
        const blobUrl = window.URL.createObjectURL(blob);
        
        // 3. Simulamos un clic en un enlace invisible para forzar la descarga
        const enlace = document.createElement('a');
        enlace.href = blobUrl;
        enlace.download = `Reporte_Cordillera_${periodo}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        
        // 4. Limpiamos la memoria
        enlace.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error al descargar:", error);
        throw error;
    }
};

export const enviarReportePorCorreo = async (periodo, correoDestino) => {
    try {
        const url = `${API_URL}/enviar?kpiId=1&sucursalId=1&periodo=${periodo}&correoDestino=${correoDestino}`;
        const response = await fetch(url, { method: 'POST' });
        
        if (!response.ok) throw new Error('Error al enviar el correo');
        
        // El backend devuelve un String, no un JSON, así que usamos .text()
        return await response.text(); 
    } catch (error) {
        console.error("Error al enviar:", error);
        throw error;
    }
};

export const obtenerUrlPrevisualizacion = async (periodo) => {
    try {
        const url = `${API_URL}/previsualizar?kpiId=1&sucursalId=1&periodo=${periodo}`;
        const response = await fetch(url, { method: 'GET' });
        
        if (!response.ok) throw new Error('Error al previsualizar el PDF');
        
        const blob = await response.blob();
        
        // En lugar de descargar, devolvemos esta URL temporal para mostrarla en pantalla
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error al previsualizar:", error);
        throw error;
    }
};