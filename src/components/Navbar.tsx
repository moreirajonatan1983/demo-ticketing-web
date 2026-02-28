import { useState } from 'react';
import { Ticket, LogIn, Search, Menu, X, User, List, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Asumiremos que el usuario está "logueado" temporalmente para mostrar el menú
    const isLoggedIn = true;

    return (
        <>
            <nav className="navbar" style={{ zIndex: 100, position: 'relative' }}>
                <Link to="/" className="navbar-brand">
                    <Ticket size={28} color="var(--primary)" />
                    Ticketera<span>Cloud</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Search size={18} /> Cartelera
                        </span>
                    </Link>

                    {!isLoggedIn ? (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            <LogIn size={18} /> Iniciar Sesión
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}
                        >
                            <Menu size={24} color="var(--primary)" />
                            Menú
                        </button>
                    )}
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: isMenuOpen ? 0 : '-100%',
                    width: '350px',
                    height: '100vh',
                    background: 'rgba(15, 20, 30, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: '1px solid var(--glass-border)',
                    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                    transition: 'right 0.3s ease-in-out',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Sidebar Header */}
                <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        <X size={24} /> Menú
                    </button>
                    <div style={{ width: '1px', height: '30px', background: 'var(--glass-border)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.2rem', color: 'white' }}>
                        <Ticket size={24} color="var(--primary)" /> TicketeraCloud
                    </div>
                </div>

                {/* Sidebar Menu Items */}
                <div style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>

                    {/* Sección Principal */}
                    <div style={{ padding: '0.5rem 1.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Tu Cuenta</span>
                    </div>

                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '1.05rem', transition: 'background 0.2s', borderLeft: '3px solid transparent' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderLeft = '3px solid var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; }}>
                            <User size={20} color="var(--primary)" /> Mi Perfil
                        </div>
                    </Link>

                    <Link to="/mytickets" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '1.05rem', transition: 'background 0.2s', borderLeft: '3px solid transparent' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderLeft = '3px solid var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; }}>
                            <Ticket size={20} color="var(--primary)" /> Mis Entradas
                            <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>2</span>
                        </div>
                    </Link>

                    <Link to="/payments" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '1.05rem', transition: 'background 0.2s', borderLeft: '3px solid transparent' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderLeft = '3px solid var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; }}>
                            <List size={20} color="var(--primary)" /> Medios de Pago
                        </div>
                    </Link>

                    <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>

                    {/* Soporte */}
                    <div style={{ padding: '0.5rem 1.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Asistencia</span>
                    </div>

                    <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '1.05rem', transition: 'background 0.2s', color: 'var(--text-secondary)', borderLeft: '3px solid transparent' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <Mail size={20} /> Centro de Ayuda
                    </div>

                    {/* Logout */}
                    <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}
                            onClick={() => {
                                setIsMenuOpen(false);
                                // Lógica de logout simulada
                                window.location.href = '/login';
                            }}
                        >
                            <LogIn size={18} style={{ transform: 'rotate(180deg)' }} /> Cerrar Sesión
                        </button>
                    </div>

                </div>
            </div>

            {/* Backdrop overlay para cerrar cuando clickeas afuera */}
            {isMenuOpen && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9998 }}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Navbar;
