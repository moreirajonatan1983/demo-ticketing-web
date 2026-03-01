import { Ticket, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    const links = {
        cartelera: [
            { label: 'Próximos Eventos', path: '/categoria/proximos-eventos' },
            { label: 'Festivales', path: '/categoria/festivales' },
            { label: 'Conciertos', path: '/categoria/conciertos' },
            { label: 'Teatro', path: '/categoria/teatro' },
            { label: 'Deportes', path: '/categoria/deportes' },
        ],
        cuenta: [
            { label: 'Mis Entradas', path: '/mytickets' },
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Registrarse', path: '/register' },
            { label: 'Recuperar Contraseña', path: '/forgot-password' },
        ],
        soporte: [
            { label: 'Centro de Ayuda', path: '/soporte/ayuda' },
            { label: 'Política de Devoluciones', path: '/soporte/devoluciones' },
            { label: 'Términos y Condiciones', path: '/soporte/terminos' },
            { label: 'Privacidad', path: '/soporte/privacidad' },
        ],
    };

    const socials = [
        { icon: <Instagram size={20} />, label: 'Instagram', href: '#' },
        { icon: <Twitter size={20} />, label: 'X / Twitter', href: '#' },
        { icon: <Facebook size={20} />, label: 'Facebook', href: '#' },
        { icon: <Youtube size={20} />, label: 'YouTube', href: '#' },
    ];

    const colStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '0.8rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--primary)',
        marginBottom: '4px',
    };

    const linkStyle: React.CSSProperties = {
        color: 'var(--text-secondary)',
        fontSize: '0.92rem',
        cursor: 'pointer',
        transition: 'color 0.18s',
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'var(--font-main)',
        textAlign: 'left',
    };

    return (
        <footer style={{
            marginTop: '5rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
            {/* Franja superior: logo + redes + contacto */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '3rem 2rem 2rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '3rem',
            }}>
                {/* Columna Marca */}
                <div style={{ ...colStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                        <Ticket size={28} color="var(--primary)" />
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                            Ticketera <span style={{ color: 'var(--primary)' }}>Cloud</span>
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
                        La plataforma de venta de entradas más segura y moderna de Latinoamérica. Fila virtual, compra en segundos.
                    </p>
                    {/* Redes Sociales */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                        {socials.map(s => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.18s, border-color 0.18s, background 0.18s',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.color = 'white';
                                    el.style.borderColor = 'var(--primary)';
                                    el.style.background = 'rgba(255,71,71,0.12)';
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.color = 'var(--text-secondary)';
                                    el.style.borderColor = 'var(--glass-border)';
                                    el.style.background = 'transparent';
                                }}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                    {/* Contacto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.5rem' }}>
                        {[
                            { icon: <Mail size={14} />, text: 'soporte@ticketera.cloud' },
                            { icon: <Phone size={14} />, text: '0800-TICKET (842538)' },
                            { icon: <MapPin size={14} />, text: 'Buenos Aires, Argentina' },
                        ].map(item => (
                            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna Cartelera */}
                <div style={colStyle}>
                    <p style={headingStyle}>Cartelera</p>
                    {links.cartelera.map(l => (
                        <button key={l.label} style={linkStyle} onClick={() => navigate(l.path)}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'white'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}>
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Columna Cuenta */}
                <div style={colStyle}>
                    <p style={headingStyle}>Mi Cuenta</p>
                    {links.cuenta.map(l => (
                        <button key={l.label} style={linkStyle} onClick={() => navigate(l.path)}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'white'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}>
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Columna Soporte */}
                <div style={colStyle}>
                    <p style={headingStyle}>Soporte</p>
                    {links.soporte.map(l => (
                        <button key={l.label} style={linkStyle} onClick={() => navigate(l.path)}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'white'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}>
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Franja inferior: copyright */}
            <div style={{
                borderTop: '1px solid var(--glass-border)',
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                maxWidth: '1280px',
                margin: '0 auto',
            }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    © {year} Ticketera Cloud S.A. — Todos los derechos reservados.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Términos', 'Privacidad', 'Cookies'].map(item => {
                        const path = `/soporte/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
                        return (
                            <button key={item} style={{ ...linkStyle, fontSize: '0.82rem' }}
                                onClick={() => navigate(path)}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'white'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}>
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
