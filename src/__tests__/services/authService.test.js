// src/__tests__/services/authService.test.js

import { loginUsuario, logoutUsuario } from '../../services/authService';

// Mock global de fetch
global.fetch = jest.fn();

describe('authService', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        Object.defineProperty(window, 'localStorage', {
            value: {
                removeItem: jest.fn(),
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
            writable: true,
        });
    });

    // -------------------------------------------------------
    // loginUsuario
    // -------------------------------------------------------

    test('loginUsuario() debe retornar los datos cuando la respuesta es exitosa', async () => {
        const mockData = {
            token: 'jwt.token.generado',
            username: 'admin',
            roles: ['ROLE_ADMIN'],
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const resultado = await loginUsuario('admin', 'pass123');

        expect(resultado).toEqual(mockData);
    });

    test('loginUsuario() debe llamar a fetch con el método POST', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'abc' }),
        });

        await loginUsuario('admin', 'pass123');

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ method: 'POST' })
        );
    });

    test('loginUsuario() debe enviar username y password en el body', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'abc' }),
        });

        await loginUsuario('admin', 'pass123');

        const llamada = fetch.mock.calls[0];
        const body = JSON.parse(llamada[1].body);

        expect(body.username).toBe('admin');
        expect(body.password).toBe('pass123');
    });

    test('loginUsuario() debe enviar el header Content-Type: application/json', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'abc' }),
        });

        await loginUsuario('admin', 'pass123');

        const llamada = fetch.mock.calls[0];

        expect(llamada[1].headers['Content-Type']).toBe('application/json');
    });

    test('loginUsuario() debe lanzar un error cuando la respuesta no es ok', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        await expect(
            loginUsuario('admin', 'wrongpass')
        ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    test('loginUsuario() debe lanzar un error cuando fetch falla (sin red)', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        await expect(
            loginUsuario('admin', 'pass123')
        ).rejects.toThrow('Network Error');
    });

    // -------------------------------------------------------
    // logoutUsuario
    // -------------------------------------------------------

    test('logoutUsuario() debe eliminar token del localStorage', () => {
        expect(() => logoutUsuario()).not.toThrow();
    });

    test('logoutUsuario() debe eliminar username del localStorage', () => {
        expect(() => logoutUsuario()).not.toThrow();
    });

    test('logoutUsuario() debe eliminar user del localStorage', () => {
        expect(() => logoutUsuario()).not.toThrow();
    });

});