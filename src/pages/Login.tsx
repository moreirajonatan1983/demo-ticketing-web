import { Mail, Lock, LogIn, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStore();
    const [email, setEmail] = useState('');
    const [visible, setVisible] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/';

    // Animación de entrada al montar
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleClose = () => {
        setVisible(false);
        // Pequeño delay para que se vea la animación de salida antes de navegar
        setTimeout(() => navigate(-1), 200);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        navigate(from, { replace: true });
    };

    return (
        /* Backdrop: ocupa toda la pantalla, click afuera cierra el modal */
        <div
            onClick={handleClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: 'rgba(5, 8, 16, 0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.2s ease',
            }}
        >
            {/* Panel: detener propagación para que el click aquí NO cierre */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '3rem 2.5rem',
                    position: 'relative',
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(-24px) scale(0.97)',
                    opacity: visible ? 1 : 0,
                    transition: 'transform 0.25s ease, opacity 0.25s ease',
                }}
            >
                {/* Botón ✕ */}
                <button
                    onClick={handleClose}
                    aria-label="Cerrar"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '6px',
                        transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'white';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="section-title title-glow" style={{ marginBottom: '8px', fontSize: '2rem' }}>
                        Bienvenido de nuevo
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Ingresa para gestionar tus entradas y compras</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                            <input
                                type="email"
                                required
                                className="form-input"
                                placeholder="usuario@ejemplo.com"
                                style={{ paddingLeft: '44px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                            <input type="password" required className="form-input" placeholder="••••••••" style={{ paddingLeft: '44px' }} />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <span
                                onClick={() => navigate('/forgot-password')}
                                style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500', cursor: 'pointer' }}
                            >
                                ¿Olvidaste tu contraseña?
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <LogIn size={20} /> Entrar a Ticketera Cloud
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    {/* Separador */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', flexShrink: 0 }}>O CONTINUAR CON</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    </div>

                    {/* Botón Google */}
                    <GoogleSignInButton returnTo={from} />

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1.25rem' }}>
                        ¿No tienes cuenta?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            style={{ color: 'white', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Regístrate ahora
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
