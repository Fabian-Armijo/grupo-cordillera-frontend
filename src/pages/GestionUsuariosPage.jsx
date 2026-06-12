// src/pages/GestionUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useAuth } from '../components/context/AuthContext.jsx';
import { crearUsuario, listarUsuarios } from '../services/usuarioService';
import { Navigate } from 'react-router-dom';

const ROLES_DISPONIBLES = [
    { value: 'admin',   label: 'Administrador',  desc: 'Acceso total al sistema' },
    { value: 'gerente', label: 'Gerente',         desc: 'Reportes y KPIs de su sucursal' },
    { value: 'usuario', label: 'Usuario',         desc: 'Ventas e inventario' },
];

const FORM_INICIAL = {
    username: '',
    email: '',
    password: '',
    rol: 'usuario',
    sucursalId: '',
};

export const GestionUsuariosPage = () => {
    const { user } = useAuth();

    // Solo ADMIN puede ver esta página
    if (!user || user.role !== 'ROLE_ADMIN') {
        return <Navigate to="/ventas" replace />;
    }

    const [form, setForm] = useState(FORM_INICIAL);
    const [usuarios, setUsuarios] = useState([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [feedback, setFeedback] = useState(null); // { tipo: 'exito'|'error', mensaje: string }
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Carga la lista de usuarios al montar
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setCargandoUsuarios(true);
        try {
            const data = await listarUsuarios();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (e) {
            setUsuarios([]);
        } finally {
            setCargandoUsuarios(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setFeedback(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);
        if (form.password.length < 6) {
            setFeedback({ tipo: 'error', mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setEnviando(true);
        try {
            await crearUsuario({
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
                roles: new Set([form.rol]),
                sucursalId: form.sucursalId ? Number(form.sucursalId) : null,
            });

            setFeedback({ tipo: 'exito', mensaje: `Usuario "${form.username}" creado exitosamente.` });
            setForm(FORM_INICIAL);
            cargarUsuarios();
        } catch (err) {
            setFeedback({ tipo: 'error', mensaje: err.message });
        } finally {
            setEnviando(false);
        }
    };

    const rolLabel = (roles) => {
        if (!roles || roles.length === 0) return 'Sin rol';
        const r = roles[0];
        if (r.includes('ADMIN')) return 'Administrador';
        if (r.includes('GERENTE')) return 'Gerente';
        if (r.includes('USUARIO') || r.includes('USER')) return 'Usuario';
        if (r.includes('BUYER')) return 'Usuario';
        return r;
    };

    const rolColor = (roles) => {
        if (!roles || roles.length === 0) return { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
        const r = roles[0];
        if (r.includes('ADMIN'))   return { bg: 'rgba(239,68,68,0.12)',    color: '#f87171' };
        if (r.includes('GERENTE')) return { bg: 'rgba(245,158,11,0.12)',   color: '#fbbf24' };
        return                              { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa' };
    };

    return (
        <DashboardLayout>
            <div style={s.page}>

                {/* Encabezado */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={s.title}>Gestión de Usuarios</h1>
                    <p style={s.subtitle}>Crea y administra las cuentas de acceso al sistema. Solo visible para administradores.</p>
                </div>

                {/* Formulario de creación */}
                <div style={s.card}>
                    <h2 style={s.cardTitle}>➕ Crear nuevo usuario</h2>

                    {feedback && (
                        <div style={{
                            ...s.feedback,
                            backgroundColor: feedback.tipo === 'exito' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            borderColor: feedback.tipo === 'exito' ? '#10b981' : '#ef4444',
                            color: feedback.tipo === 'exito' ? '#34d399' : '#f87171',
                        }}>
                            {feedback.tipo === 'exito' ? '✅ ' : '⚠️ '}{feedback.mensaje}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={s.grid}>
                        {/* Username */}
                        <div style={s.field}>
                            <label style={s.label}>Nombre de usuario *</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="ej: juan.perez"
                                style={s.input}
                                required
                                autoComplete="off"
                            />
                        </div>

                        {/* Email */}
                        <div style={s.field}>
                            <label style={s.label}>Correo electrónico *</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="ej: juan@cordillera.cl"
                                style={s.input}
                                required
                            />
                        </div>

                        {/* Rol */}
                        <div style={s.field}>
                            <label style={s.label}>Rol del usuario *</label>
                            <select name="rol" value={form.rol} onChange={handleChange} style={s.select}>
                                {ROLES_DISPONIBLES.map(r => (
                                    <option key={r.value} value={r.value}>
                                        {r.label} — {r.desc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sucursal */}
                        <div style={s.field}>
                            <label style={s.label}>ID de sucursal asignada</label>
                            <input
                                name="sucursalId"
                                type="number"
                                min="1"
                                value={form.sucursalId}
                                onChange={handleChange}
                                placeholder="ej: 3 (dejar vacío si es admin)"
                                style={s.input}
                            />
                        </div>

                        {/* Password */}
                        <div style={s.field}>
                            <label style={s.label}>Contraseña *</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    name="password"
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres"
                                    style={{ ...s.input, paddingRight: '44px' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(v => !v)}
                                    style={s.eyeBtn}
                                    tabIndex={-1}
                                >
                                    {mostrarPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar password */}


                        {/* Botón */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button type="submit" disabled={enviando} style={enviando ? s.btnDisabled : s.btn}>
                                {enviando ? 'Creando...' : 'Crear usuario'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de usuarios */}
                <div style={{ ...s.card, marginTop: '24px' }}>
                    <h2 style={{ ...s.cardTitle, marginBottom: '20px' }}>
                        👥 Usuarios registrados
                        <span style={s.badge}>{usuarios.length}</span>
                    </h2>

                    {cargandoUsuarios ? (
                        <p style={s.empty}>Cargando usuarios...</p>
                    ) : usuarios.length === 0 ? (
                        <p style={s.empty}>No hay usuarios registrados aún.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['ID', 'Usuario', 'Correo', 'Rol', 'Sucursal'].map(col => (
                                            <th key={col} style={s.th}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u, i) => {
                                        const { bg, color } = rolColor(u.roles);
                                        return (
                                            <tr key={u.id || i} style={{ borderBottom: '1px solid #1e293b' }}>
                                                <td style={s.td}><span style={s.mono}>#{u.id}</span></td>
                                                <td style={s.td}><strong style={{ color: '#f1f5f9' }}>{u.username}</strong></td>
                                                <td style={s.td}><span style={{ color: '#94a3b8' }}>{u.email}</span></td>
                                                <td style={s.td}>
                                                    <span style={{ ...s.rolPill, backgroundColor: bg, color }}>
                                                        {rolLabel(u.roles)}
                                                    </span>
                                                </td>
                                                <td style={s.td}>
                                                    {u.sucursalId && u.sucursalId !== 0
                                                        ? <span style={s.mono}>#{u.sucursalId}</span>
                                                        : <span style={{ color: '#475569' }}>—</span>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

const s = {
    page: {
        backgroundColor: '#020617',
        padding: '12px 0',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: '#f1f5f9',
    },
    title: {
        fontSize: '24px', fontWeight: '600', color: '#f8fafc', margin: 0,
    },
    subtitle: {
        fontSize: '14px', color: '#64748b', marginTop: '6px',
    },
    card: {
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '28px',
    },
    cardTitle: {
        fontSize: '14px', fontWeight: '600', color: '#cbd5e1',
        margin: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px',
    },
    badge: {
        backgroundColor: 'rgba(59,130,246,0.15)',
        color: '#60a5fa',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontFamily: 'monospace',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
    },
    field: {
        display: 'flex', flexDirection: 'column', gap: '6px',
    },
    label: {
        fontSize: '12px', color: '#94a3b8', fontWeight: '500',
    },
    input: {
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 12px',
        fontSize: '14px',
        color: '#f1f5f9',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    },
    select: {
        backgroundColor: '#020617',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 12px',
        fontSize: '14px',
        color: '#f1f5f9',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    eyeBtn: {
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '16px', padding: 0, lineHeight: 1,
    },
    btn: {
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 28px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        height: '42px',
        transition: 'background 0.15s',
    },
    btnDisabled: {
        backgroundColor: '#1e3a6e',
        color: '#64748b',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 28px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'not-allowed',
        height: '42px',
    },
    feedback: {
        border: '1px solid',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
    },
    th: {
        textAlign: 'left',
        padding: '10px 14px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderBottom: '1px solid #1e293b',
    },
    td: {
        padding: '12px 14px',
        verticalAlign: 'middle',
    },
    mono: {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#64748b',
    },
    rolPill: {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
    },
    empty: {
        fontSize: '14px', color: '#475569', textAlign: 'center', padding: '32px 0', margin: 0,
    },
};

export default GestionUsuariosPage;