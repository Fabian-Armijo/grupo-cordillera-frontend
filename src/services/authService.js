// src/services/authService.js

// Apuntamos al API Gateway, que redirigirá la petición al ms-autenticacion
const API_URL = 'http://localhost:8090/api/auth';

export const loginUsuario = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            // Si el backend responde con 401, las credenciales son malas
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Si es un 200 OK, devolvemos el JSON que incluye el token y los roles
        return await response.json();
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};

// Opcional pero muy útil: Una función para cerrar sesión
export const logoutUsuario = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Forzamos la redirección
};