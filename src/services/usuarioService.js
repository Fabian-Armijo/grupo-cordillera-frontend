// src/services/usuarioService.js

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8086';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

// Crea un usuario nuevo enviando username, email, password y roles
export const crearUsuario = async ({ username, email, password, roles, sucursalId }) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ username, email, password, roles, sucursalId }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Error al crear el usuario');
    }

    return data;
};

// Lista todos los usuarios (solo disponible para ADMIN)
export const listarUsuarios = async () => {
    const response = await fetch(`${API_URL}/api/auth/users`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Error al obtener la lista de usuarios');
    }

    return response.json();
};