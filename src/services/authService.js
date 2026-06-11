// src/services/authService.js
const API_URL = 'http://localhost:8086/api/auth';

export const loginUsuario = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Crucial para que el BFF maneje las cookies HttpOnly
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // 🚨 RETORNAMOS EL JSON COMPLETO:
        // Como el backend ya responde bien, leemos el objeto con el username, roles, etc.
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};

export const logoutUsuario = () => {
    localStorage.removeItem('username');
    window.location.href = '/login';
};