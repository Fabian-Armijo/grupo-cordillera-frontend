const API_URL = import.meta.env.VITE_BFF_URL || 'http://localhost:8086';
const BASE_PATH = `${API_URL}/api/reportes`;

// 🎯 CORREGIDO: Ahora recibe el rol y sucursal de forma explícita para pasárselos al BFF
export const obtenerHistorialReportes = async (rol, sucursalId) => {
    try {
        const token = localStorage.getItem('token');



        const response = await fetch(`${BASE_PATH}/historial`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-User-Role': rol || '',
                'X-Sucursal-Id': sucursalId ? String(sucursalId) : '0'
            }
        });



        if (!response.ok) {
            throw new Error(
                `Error al obtener el historial de reportes. Status: ${response.status}`
            );
        }

        const data = await response.json();



        return data;

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
            headers: { 'Authorization': `Bearer ${token}` }
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

export const generarYDescargarReporte = async (kpiId, sucursalId, periodo, rol) => {
    try {
        const token = localStorage.getItem('token');

        const url = `${BASE_PATH}/descargar?kpiId=${kpiId}&sucursalId=${sucursalId}&periodo=${periodo}`;
        console.log("ROL ENVIADO:", rol);
        console.log("SUCURSAL ENVIADA:", sucursalId);
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`,
            'X-User-Role': rol,'X-Sucursal-Id': String(sucursalId)
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

export const enviarReportePorCorreo = async (kpiId, sucursalId, periodo, correoDestino) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/enviar?kpiId=${kpiId}&sucursalId=${sucursalId}&periodo=${periodo}&correoDestino=${correoDestino}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al enviar el correo');

        return await response.text();
    } catch (error) {
        console.error("Error al enviar:", error);
        throw error;
    }
};

export const obtenerUrlPrevisualizacion = async (kpiId, sucursalId, periodo) => {
    try {
        const token = localStorage.getItem('token');
        const url = `${BASE_PATH}/previsualizar?kpiId=${kpiId}&sucursalId=${sucursalId}&periodo=${periodo}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al previsualizar el PDF');
        
        const blob = await response.blob();
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error al previsualizar:", error);
        throw error;
    }
};