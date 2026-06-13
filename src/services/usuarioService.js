// src/services/usuarioService.js

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8086';

const getHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

// Crear usuario
export const crearUsuario = async ({
    username,
    email,
    password,
    roles,
    sucursalId
}) => {

    console.log("TOKEN:", localStorage.getItem('token'));

    console.log("BODY:", JSON.stringify({
        username,
        email,
        password,
        roles,
        sucursalId
    }));

    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
            username,
            email,
            password,
            roles,
            sucursalId
        }),
    });

    console.log("STATUS:", response.status);
    console.log("OK:", response.ok);

    const texto = await response.text();

    console.log("RESPUESTA RAW:", texto);

    if (!response.ok) {
        throw new Error(texto);
    }

    return texto;
};

// Listar usuarios
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