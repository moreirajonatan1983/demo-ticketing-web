import { Ticket, LogIn, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
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
                <Link to="/mytickets" className={location.pathname === '/mytickets' ? 'active' : ''}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Ticket size={18} /> Mis Entradas
                    </span>
                </Link>
                <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                    <LogIn size={18} /> Iniciar Sesión
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
