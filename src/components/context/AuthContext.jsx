/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 💡 Al cargar, intentamos rescatar al usuario del localStorage de forma segura
    const [user, setUser] = useState(() => {
        try {
            const localUser = localStorage.getItem('user');
            return localUser ? JSON.parse(localUser) : null;
        } catch (e) {
            console.error("Error inicializando AuthContext:", e);
            return null;
        }
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
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