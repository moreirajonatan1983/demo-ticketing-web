import { ChevronRight, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

const EventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedEvent: event, fetchEventDetails, shows, fetchShows } = useStore();

    useEffect(() => {
        if (id) {
            fetchEventDetails(id);
            fetchShows(id);
        }
    }, [id, fetchEventDetails, fetchShows]);

    if (!event) {
        return <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>Cargando evento...</div>;
    }

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
                &larr; Volver a Cartelera
            </button>

            <p style={{ color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '700' }}>{event.venue}</p>
            <h1 className="title-glow" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '2rem' }}>{event.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Main Hero View */}
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, backgroundImage: `url('http://localhost:3008/media/events/${event.id}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div style={{ padding: '2rem', background: 'rgba(30, 31, 38, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Próximo evento en</p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>9 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Días</span></span>
                                <span style={{ color: 'var(--primary)' }}>|</span>
                                <span>0 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Hrs</span></span>
                                <span style={{ color: 'var(--primary)' }}>|</span>
                                <span>41 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Min</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dates Selection Box */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Seleccionar Fecha</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Elegí la función a la que deseas asistir para ver la disponibilidad de sectores.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>

                        {shows.length === 0 && <p>Cargando funciones...</p>}

                        {shows.map((show) => {
                            const isAvailable = show.status === 'available';

                            return (
                                <div
                                    key={show.id}
                                    style={{
                                        padding: '1.5rem',
                                        border: isAvailable ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: isAvailable ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        opacity: isAvailable ? 1 : 0.6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'var(--transition)'
                                    }}
                                    onClick={() => isAvailable && navigate(`/event/${event.id}/date/${show.id}/sectors`)}
                                    {...(isAvailable ? {
                                        onMouseOver: (e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glow)'; },
                                        onMouseOut: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }
                                    } : {})}
                                >
                                    <div>
                                        <p style={{ color: isAvailable ? 'var(--primary)' : 'var(--error)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            {isAvailable ? 'Disponible' : 'Agotado'}
                                        </p>
                                        <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', textDecoration: isAvailable ? 'none' : 'line-through' }}>{show.date}</h4>
                                        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {show.time}</span>
                                        </div>
                                    </div>
                                    {isAvailable && <ChevronRight color="var(--primary)" size={30} />}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default EventDetails;
