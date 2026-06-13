// src/services/authService.js

const API_URL = 'http://localhost:8086/api/auth';

export const loginUsuario = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

        return data;

    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};

export const logoutUsuario = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';
};