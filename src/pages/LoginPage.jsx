/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authService';

export const LoginPage = () => {

    const [credenciales, setCredenciales] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError(null);
        setCargando(true);

        try {

            const data = await loginUsuario(
                credenciales.username,
                credenciales.password
            );

            console.log("TOKEN RECIBIDO:", data.token);
            console.log("LOGIN RESPONSE:", data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user', JSON.stringify(data));

            navigate('/reportes');

            window.location.reload();

        } catch (err) {

            console.error(err);
            setError(err.message);

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">

                    <h3 className="text-center mb-4">
                        🔑 Iniciar Sesión
                    </h3>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">
                            <label className="form-label text-muted fw-bold">
                                Usuario
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="ej: prueba"
                                value={credenciales.username}
                                onChange={(e) =>
                                    setCredenciales({
                                        ...credenciales,
                                        username: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="******"
                                value={credenciales.password}
                                onChange={(e) =>
                                    setCredenciales({
                                        ...credenciales,
                                        password: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={cargando}
                        >
                            {cargando
                                ? 'Verificando...'
                                : 'Entrar al Sistema'}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};