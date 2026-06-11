/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authService';

export const LoginPage = () => {
    const [credenciales, setCredenciales] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setCargando(true);

        try {
            // 1. Intentamos el login contra el BFF
            const data = await loginUsuario(credenciales.username, credenciales.password);

            // 2. Guardamos en localStorage en todos los formatos posibles para que cualquier componente lo encuentre
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);

            // Guardamos el objeto plano y también envuelto por si acaso
            localStorage.setItem('user', JSON.stringify(data));

            // 3. Redirigimos a reportes
            navigate('/reportes');

            // 🚨 EL TRUCO MÁGICO: Forzamos una recarga completa del navegador.
            // Al recargar la URL de destino, todo el árbol de React se vuelve a montar
            // limpiando los estados nulos colgados en memoria.
            window.location.reload();

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h3 className="text-center mb-4">🔑 Iniciar Sesión</h3>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label text-muted fw-bold">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ej: prueba"
                                value={credenciales.username}
                                onChange={(e) => setCredenciales({...credenciales, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="******"
                                value={credenciales.password}
                                onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={cargando}
                        >
                            {cargando ? 'Verificando...' : 'Entrar al Sistema'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};