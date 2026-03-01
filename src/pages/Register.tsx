import { Mail, Lock, LogIn, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import GoogleSignInButton from '../components/GoogleSignInButton';

// ── API mock (apunta al auth-backend cuando esté disponible) ──
const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useStore();

    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => navigate(-1), 200);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${AUTH_API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                // Auto-login tras registro exitoso
                login(email);
                setStep('success');
                setTimeout(() => navigate('/'), 2000);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Error al registrar. Intentá con otro email.');
            }
        } catch {
            // Backend no disponible → mock local
            console.warn('[DEV] Auth backend no disponible — simulando registro.');
            login(email);
            setStep('success');
            setTimeout(() => navigate('/'), 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={handleClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                background: 'rgba(5, 8, 16, 0.75)', backdropFilter: 'blur(6px)',
                opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '100%', maxWidth: '460px', padding: '3rem 2.5rem',
                    position: 'relative',
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(-24px) scale(0.97)',
                    opacity: visible ? 1 : 0, transition: 'transform 0.25s ease, opacity 0.25s ease',
                }}
            >
                {/* Botón ✕ */}
                <button
                    onClick={handleClose}
                    aria-label="Cerrar"
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-secondary)', padding: '4px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                    <X size={20} />
                </button>

                {step === 'success' ? (
                    /* Pantalla de éxito */
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 className="section-title title-glow" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                            ¡Cuenta creada!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Te estamos redirigiendo a la cartelera...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 className="section-title title-glow" style={{ marginBottom: '8px', fontSize: '1.9rem' }}>
                                Crear cuenta
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Registrate para comprar entradas y más</p>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
                                color: 'var(--error)', fontSize: '0.9rem', marginBottom: '1.25rem',
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nombre completo</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input type="text" required className="form-input" placeholder="Juan Pérez"
                                        style={{ paddingLeft: '44px' }} value={name} onChange={e => setName(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Correo Electrónico</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input type="email" required className="form-input" placeholder="usuario@ejemplo.com"
                                        style={{ paddingLeft: '44px' }} value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input type="password" required className="form-input" placeholder="Mínimo 6 caracteres"
                                        style={{ paddingLeft: '44px' }} value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirmar contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input type="password" required className="form-input" placeholder="Repetí tu contraseña"
                                        style={{ paddingLeft: '44px' }} value={confirm} onChange={e => setConfirm(e.target.value)} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                                {loading ? 'Creando cuenta...' : <><LogIn size={20} /> Crear mi cuenta</>}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                            {/* Separador */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', flexShrink: 0 }}>O REGISTRARSE CON</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                            </div>

                            {/* Botón Google */}
                            <GoogleSignInButton label="Registrarse con Google" />

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1.25rem' }}>
                                ¿Ya tenés cuenta?{' '}
                                <span onClick={() => navigate('/login')}
                                    style={{ color: 'white', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Iniciá sesión
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
