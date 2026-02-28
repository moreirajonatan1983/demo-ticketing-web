import { ChevronRight, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface EventData {
    id: string;
    title: string;
    date: string;
    venue: string;
    image: string;
    status: string;
}

const EventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState<EventData | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:3000/events/${id}`)
            .then(res => res.json())
            .then(data => setEvent(data))
            .catch(err => console.error("Error fetching event:", err));
    }, [id]);

    if (!event) {
        return <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>Cargando evento...</div>;
    }

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>
                &larr; Volver a Cartelera
            </button>

            <p style={{ color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '700' }}>{event.venue}</p>
            <h1 className="title-glow" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '2rem' }}>{event.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Main Hero View */}
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, backgroundImage: `url('${event.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
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

                        {/* Option 1: Available */}
                        <div
                            style={{ padding: '1.5rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'var(--transition)' }}
                            onClick={() => navigate(`/event/${event.id}/date/1/sectors`)}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glow)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>{event.status}</p>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>{event.date}</h4>
                                <div style={{ display: 'flex', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 21:00 hs</span>
                                </div>
                            </div>
                            <ChevronRight color="var(--primary)" size={30} />
                        </div>

                        {/* Option 2: Sold Out */}
                        <div
                            style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.02)', cursor: 'not-allowed', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div>
                                <p style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Agotado</p>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px', textDecoration: 'line-through' }}>27 Febrero</h4>
                                <div style={{ display: 'flex', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> 21:00 hs</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default EventDetails;
