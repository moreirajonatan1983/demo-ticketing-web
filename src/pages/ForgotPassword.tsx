import { Mail, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState<'form' | 'sent'>('form');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

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
        setLoading(true);

        try {
            const res = await fetch(`${AUTH_API}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok || res.status === 404) {
                // Por seguridad siempre mostramos el mismo mensaje,
                // tanto si el email existe como si no
                setStep('sent');
            } else {
                setError('Error al procesar la solicitud. Intentá nuevamente.');
            }
        } catch {
            // Backend no disponible → simular envío de email
            console.warn('[DEV] Auth backend no disponible — simulando envío de email de recuperación.');
            setStep('sent');
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
                    width: '100%', maxWidth: '440px', padding: '3rem 2.5rem',
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

                {step === 'sent' ? (
                    /* Pantalla de confirmación */
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📧</div>
                        <h2 className="section-title title-glow" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                            ¡Revisá tu correo!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Si el email <strong style={{ color: 'white' }}>{email}</strong> tiene una cuenta asociada,
                            recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                        </p>
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            onClick={() => navigate('/login')}
                        >
                            <ArrowLeft size={18} /> Volver al inicio de sesión
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Botón volver atrás */}
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                                gap: '6px', fontSize: '0.9rem', marginBottom: '1.5rem', padding: 0,
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'white'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}
                        >
                            <ArrowLeft size={16} /> Volver al login
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
                            <h2 className="section-title title-glow" style={{ marginBottom: '8px', fontSize: '1.8rem' }}>
                                Olvidé mi contraseña
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
                            </p>
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
                                <label className="form-label">Correo Electrónico</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input
                                        type="email" required className="form-input"
                                        placeholder="usuario@ejemplo.com"
                                        style={{ paddingLeft: '44px' }}
                                        value={email} onChange={e => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
