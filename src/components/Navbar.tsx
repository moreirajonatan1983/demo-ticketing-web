import { useState } from 'react';
import { Ticket, LogIn, Search, Menu, X, User, ChevronDown, List, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(true);

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

                    {/* Mi Cuenta Dropdown */}
                    <div style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <div
                            style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                            onClick={() => setIsAccountOpen(!isAccountOpen)}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><User size={20} color="var(--text-secondary)" /> Mi cuenta</span>
                            <ChevronDown size={18} color="var(--primary)" style={{ transform: isAccountOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>

                        {/* Dropdown Items */}
                        {isAccountOpen && (
                            <div style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ padding: '1rem 1.5rem 1rem 3.5rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => setIsMenuOpen(false)}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}></div>
                                    Datos personales
                                </div>
                                <div style={{ padding: '1rem 1.5rem 1rem 3.5rem', cursor: 'not-allowed', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                                    Historial
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mis compras */}
                    <Link to="/mytickets" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsMenuOpen(false)}>
                        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <List size={20} color="var(--text-secondary)" /> Mis compras
                        </div>
                    </Link>

                    {/* Contacto */}
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Mail size={20} color="var(--text-secondary)" /> Contacto
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
