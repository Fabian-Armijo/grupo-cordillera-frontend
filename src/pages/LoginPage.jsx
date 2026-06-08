import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos el servicio que acabamos de crear
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
            // 1. Usamos nuestro servicio limpio
            const data = await loginUsuario(credenciales.username, credenciales.password);

            // 2. Guardamos el token en la memoria del navegador
            localStorage.setItem('token', data.token);

            // 3. (Opcional) Podemos guardar también el nombre de usuario para mostrarlo en la navbar
            localStorage.setItem('username', data.username);

            // 4. ¡Acceso concedido! Redirigimos al Dashboard o Reportes
            navigate('/reportes');

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
                                placeholder="ej: gabriel.admin"
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