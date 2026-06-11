// src/components/AllowedTo.jsx
import React from 'react';

/**
 * Componente Wrapper para mostrar u ocultar elementos basados en el rol del usuario.
 * @param {string[]} rolesPermitidos - Array de roles que pueden ver el contenido (ej. ['ADMIN', 'GERENTE'])
 * @param {string} userRole - El rol del usuario actualmente logueado
 */
const AllowedTo = ({ rolesPermitidos, userRole, children }) => {
    // Si el rol del usuario está en la lista de permitidos, mostramos los hijos (children)
    if (rolesPermitidos.includes(userRole)) {
        return <>{children}</>;
    }

    // Si no tiene permiso, no renderiza absolutamente nada en el HTML
    return null;
};

export default AllowedTo;