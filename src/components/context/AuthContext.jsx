/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 💡 Al cargar, rescatamos y normalizamos el usuario del localStorage
    const [user, setUser] = useState(() => {
        try {
            const localUser = localStorage.getItem('user');
            if (!localUser) return null;

            const parsedUser = JSON.parse(localUser);

            // 🛡️ NORMALIZADOR DE ROLES DE SPRING SECURITY
            // No importa si el BFF manda 'roles', 'rol' o 'authorities', capturamos el primero válido con su prefijo ROLE_
            let rolDetectado = null;

            if (Array.isArray(parsedUser.roles) && parsedUser.roles.length > 0) {
                rolDetectado = parsedUser.roles[0];
            } else if (typeof parsedUser.rol === 'string') {
                rolDetectado = parsedUser.rol;
            } else if (typeof parsedUser.role === 'string') {
                rolDetectado = parsedUser.role;
            } else if (Array.isArray(parsedUser.authorities) && parsedUser.authorities.length > 0) {
                const auth = parsedUser.authorities[0];
                rolDetectado = typeof auth === 'string' ? auth : auth.authority;
            }

            // Inyectamos de forma segura la propiedad .role para que DashboardPage no se rompa
            return {
                ...parsedUser,
                role: rolDetectado // Asegura que 'user.role' SIEMPRE exista con el string 'ROLE_...'
            };

        } catch (e) {
            console.error("Error inicializando AuthContext:", e);
            return null;
        }
    });

    // En el login, cuando hagas setUser(data), también lo normalizamos automáticamente
    const loginWrapper = (userData) => {
        if (!userData) {
            setUser(null);
            return;
        }

        let rolDetectado = null;
        if (Array.isArray(userData.roles) && userData.roles.length > 0) {
            rolDetectado = userData.roles[0];
        } else if (typeof userData.rol === 'string') {
            rolDetectado = userData.rol;
        } else if (typeof userData.role === 'string') {
            rolDetectado = userData.role;
        } else if (Array.isArray(userData.authorities) && userData.authorities.length > 0) {
            const auth = userData.authorities[0];
            rolDetectado = typeof auth === 'string' ? auth : auth.authority;
        }

        setUser({
            ...userData,
            role: rolDetectado
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser: loginWrapper }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};