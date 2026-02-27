
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login integration
        navigate('/mytickets');
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="section-title title-glow" style={{ marginBottom: '8px', fontSize: '2rem' }}>Bienvenido de nuevo</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Ingresa para gestionar tus entradas y compras</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                            <input type="email" required className="form-input" placeholder="usuario@ejemplo.com" style={{ paddingLeft: '44px' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                            <input type="password" required className="form-input" placeholder="••••••••" style={{ paddingLeft: '44px' }} />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500' }}>¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <LogIn size={20} /> Entrar a Ticketera Cloud
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        ¿No tienes cuenta? <a href="#" style={{ color: 'white', fontWeight: '600' }}>Regístrate ahora</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
