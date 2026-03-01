import { MapPin, Music, Tent, Theater, Trophy, CalendarDays, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

const CATEGORIES = [
    {
        id: 'conciertos', label: 'Conciertos', path: '/categoria/conciertos',
        icon: <Music size={28} />,
        gradient: 'linear-gradient(135deg, rgba(255,71,71,0.25) 0%, rgba(255,71,71,0.05) 100%)',
        border: 'rgba(255,71,71,0.3)',
        color: '#ff4747',
    },
    {
        id: 'festivales', label: 'Festivales', path: '/categoria/festivales',
        icon: <Tent size={28} />,
        gradient: 'linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.05) 100%)',
        border: 'rgba(168,85,247,0.3)',
        color: '#a855f7',
    },
    {
        id: 'teatro', label: 'Teatro', path: '/categoria/teatro',
        icon: <Theater size={28} />,
        gradient: 'linear-gradient(135deg, rgba(234,179,8,0.25) 0%, rgba(234,179,8,0.05) 100%)',
        border: 'rgba(234,179,8,0.3)',
        color: '#eab308',
    },
    {
        id: 'deportes', label: 'Deportes', path: '/categoria/deportes',
        icon: <Trophy size={28} />,
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.05) 100%)',
        border: 'rgba(59,130,246,0.3)',
        color: '#3b82f6',
    },
    {
        id: 'proximos-eventos', label: 'Próximos', path: '/categoria/proximos-eventos',
        icon: <CalendarDays size={28} />,
        gradient: 'linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0.05) 100%)',
        border: 'rgba(20,184,166,0.3)',
        color: '#14b8a6',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { events, fetchEvents } = useStore();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const scrollToEvents = () => {
        document.getElementById('eventos-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="animate-fade-in">
            {/* ─── Hero ─── */}
            <section className="hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533174000228-db3cecc27004?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')` }}>
                <div className="hero-content">
                    <span className="badge badge-error" style={{ marginBottom: '1rem', display: 'inline-block' }}>PREVENTA EXCLUSIVA</span>
                    <h1 className="hero-title title-glow">Siente la Música.<br />Vive el Momento.</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}>
                        Asegura tu lugar en los eventos más esperados del año. Ingresa a la fila virtual o compra directamente tu entrada.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={scrollToEvents}>VER DESTACADOS</button>
                        <button className="btn btn-secondary" onClick={() => navigate('/categoria/proximos-eventos')}>
                            Ver toda la cartelera
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── Destacados ─── */}
            <div id="eventos-section" style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 className="section-title" style={{ margin: 0 }}>Destacados</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Los eventos más esperados del momento</p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                        onClick={() => navigate('/categoria/proximos-eventos')}
                    >
                        Ver todos <ArrowRight size={15} />
                    </button>
                </div>
            </div>

            {/* Grid de eventos */}
            <div className="event-grid">
                {events.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎫</p>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No hay eventos destacados disponibles por el momento.</p>
                    </div>
                ) : (
                    events.map(ev => (
                        <div key={ev.id} className="event-card" onClick={() => navigate(`/event/${ev.id}`)}>
                            <div className="event-card-img" style={{ backgroundImage: `url('${ev.image || `http://localhost:3008/media/events/${ev.id}`}')` }} />
                            <div className="event-card-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <p className="event-date">{ev.date}</p>
                                    <span className={`badge ${ev.status === 'Disponible' ? 'badge-success' : ev.status === 'Sold Out' ? 'badge-error' : 'badge-warning'}`}>
                                        {ev.status}
                                    </span>
                                </div>
                                <h3 className="event-title">{ev.title}</h3>
                                <p className="event-venue">
                                    <MapPin size={16} /> {ev.venue}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ─── Categorías ─── */}
            <div style={{ margin: '4rem 0 2.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Explorar por Categoría</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '1rem' }}>
                    Encontrá el tipo de evento que estás buscando.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '1rem',
                }}>
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(cat.path)}
                            style={{
                                background: cat.gradient,
                                border: `1px solid ${cat.border}`,
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem 1.25rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                textAlign: 'center',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 8px 30px ${cat.border}`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ color: cat.color }}>{cat.icon}</div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.label}</span>
                            <ArrowRight size={14} color={cat.color} style={{ opacity: 0.7 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;


