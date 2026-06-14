// src/__tests__/components/AuthContext.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../components/context/AuthContext';

// Componente auxiliar para exponer el contexto en los tests
const ContextConsumer = ({ onRender }) => {
    const auth = useAuth();
    onRender(auth);
    return <div>OK</div>;
};

// Helper para mockear localStorage
const mockLocalStorage = (valor) => {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: jest.fn(() => valor),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        },
        writable: true,
    });
};

describe('AuthContext - Contexto de autenticación', () => {

    beforeEach(() => {
        mockLocalStorage(null);
    });

    test('useAuth() debe lanzar error si se usa fuera del AuthProvider', () => {
        // Suprimir el error de consola esperado
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<ContextConsumer onRender={() => {}} />)).toThrow(
            'useAuth debe ser utilizado dentro de un AuthProvider'
        );

        consoleSpy.mockRestore();
    });

    test('user debe ser null cuando localStorage está vacío', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        expect(authValue.user).toBeNull();
    });

    test('setUser() debe actualizar el usuario en el contexto', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        act(() => {
            authValue.setUser({
                username: 'admin',
                roles: ['ROLE_ADMIN'],
                token: 'abc.def.ghi',
            });
        });

        expect(authValue.user.username).toBe('admin');
    });

    test('loginWrapper debe normalizar el rol desde el array roles[]', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        act(() => {
            authValue.setUser({ username: 'admin', roles: ['ROLE_ADMIN'] });
        });

        expect(authValue.user.role).toBe('ROLE_ADMIN');
    });

    test('loginWrapper debe normalizar el rol desde el campo rol (string)', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        act(() => {
            authValue.setUser({ username: 'gerente', rol: 'ROLE_GERENTE' });
        });

        expect(authValue.user.role).toBe('ROLE_GERENTE');
    });

    test('loginWrapper debe normalizar el rol desde authorities[]', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        act(() => {
            authValue.setUser({
                username: 'usuario1',
                authorities: [{ authority: 'ROLE_USUARIO' }],
            });
        });

        expect(authValue.user.role).toBe('ROLE_USUARIO');
    });

    test('loginWrapper con null debe dejar user en null', () => {
        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        act(() => {
            authValue.setUser({ username: 'admin', roles: ['ROLE_ADMIN'] });
        });
        act(() => {
            authValue.setUser(null);
        });

        expect(authValue.user).toBeNull();
    });

    test('debe inicializar user desde localStorage si existe', () => {
        const userGuardado = JSON.stringify({
            username: 'admin',
            roles: ['ROLE_ADMIN'],
            token: 'token.guardado',
        });
        mockLocalStorage(userGuardado);

        let authValue;

        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        expect(authValue.user.username).toBe('admin');
        expect(authValue.user.role).toBe('ROLE_ADMIN');
    });

    test('debe retornar null si localStorage tiene JSON inválido', () => {
        mockLocalStorage('esto-no-es-json{{{');

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        let authValue;
        render(
            <AuthProvider>
                <ContextConsumer onRender={(auth) => { authValue = auth; }} />
            </AuthProvider>
        );

        expect(authValue.user).toBeNull();
        consoleSpy.mockRestore();
    });
});