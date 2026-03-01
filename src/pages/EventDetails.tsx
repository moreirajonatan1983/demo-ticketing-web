import { ChevronRight, Clock, MapPin, Share2, Ticket, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const useCountdown = (targetDateStr: string) => {
    const parseDate = (dateStr: string): Date | null => {
        // Intenta parsear el formato "Sáb 15 Mar 2026" → útil para los eventos mock
        const months: Record<string, number> = {
            'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11,
        };
        const parts = dateStr.split(' ').filter(Boolean);
        if (parts.length >= 4) {
            const day = parseInt(parts[1]);
            const month = months[parts[2]];
            const year = parseInt(parts[3]);
            if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                return new Date(year, month, day, 20, 0, 0);
            }
        }
        return null;
    };

    const getTimeLeft = () => {
        const target = parseDate(targetDateStr);
        if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDateStr]);

    return timeLeft;
};

const EventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedEvent: event, fetchEventDetails, shows, fetchShows } = useStore();
    const [eventLimits, setEventLimits] = useState<{ max_tickets_per_user: number; message: string } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventDetails(id);
            fetchShows(id);
            // Fetch límites desde el nuevo endpoint B-20
            fetch(`http://localhost:3000/events/${id}/limits`)
                .then(r => r.json())
                .then(data => setEventLimits(data))
                .catch(() => setEventLimits({ max_tickets_per_user: 4, message: 'Hasta 4 entradas por usuario.' }));
        }
    }, [id]);

    const countdown = useCountdown(event?.date || '');

    if (!event) {
        return (
            <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Cargando evento...</p>
            </div>
        );
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const CountdownBox = ({ value, label }: { value: number; label: string }) => (
        <div style={{ textAlign: 'center', minWidth: '64px' }}>
            <div style={{
                fontSize: '2.2rem', fontWeight: 800, lineHeight: 1,
                background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
                {String(value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{label}</div>
        </div>
    );

    const Separator = () => (
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, alignSelf: 'flex-start', marginTop: '4px' }}>:</span>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            {/* Barra superior */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    &larr; Volver a Cartelera
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleShare}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Share2 size={16} />
                    {copied ? '¡Copiado!' : 'Compartir'}
                </button>
            </div>

            {/* Tagline y título */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <p style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: 700 }}>
                        {event.venue}
                    </p>
                </div>
                <h1 className="title-glow" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>{event.title}</h1>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${event.status === 'Disponible' ? 'badge-success' : event.status === 'Sold Out' ? 'badge-error' : 'badge-warning'}`}>
                        {event.status}
                    </span>
                    {eventLimits && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '4px 12px', borderRadius: 'var(--radius-full)',
                            background: 'rgba(255,71,71,0.1)', border: '1px solid rgba(255,71,71,0.3)',
                            color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600,
                        }}>
                            <Users size={12} color="var(--primary)" />
                            Máx. {eventLimits.max_tickets_per_user} entradas por persona
                        </span>
                    )}
                </div>
            </div>

            {/* Grid principal */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Imagen del evento */}
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '420px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{
                        flex: 1,
                        backgroundImage: `url('${event.image || `http://localhost:3008/media/events/${event.id}`}')`,
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }} />
                    {/* Countdown overlay */}
                    <div style={{
                        padding: '1.75rem 2rem',
                        background: 'rgba(10, 12, 20, 0.92)',
                        backdropFilter: 'blur(10px)',
                        borderTop: '1px solid var(--glass-border)',
                    }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                            Tiempo restante para el evento
                        </p>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <CountdownBox value={countdown.days} label="Días" />
                            <Separator />
                            <CountdownBox value={countdown.hours} label="Horas" />
                            <Separator />
                            <CountdownBox value={countdown.minutes} label="Min" />
                            <Separator />
                            <CountdownBox value={countdown.seconds} label="Seg" />
                        </div>
                    </div>
                </div>

                {/* Selector de fechas */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <Ticket size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Seleccionar Fecha</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        Elegí la función a la que deseas asistir.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        {shows.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                                <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</p>
                                <p>No hay funciones disponibles</p>
                            </div>
                        )}

                        {shows.map((show) => {
                            const isAvailable = show.status === 'available';
                            return (
                                <div
                                    key={show.id}
                                    style={{
                                        padding: '1.25rem 1.5rem',
                                        border: isAvailable ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: isAvailable ? 'rgba(124, 58, 237, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        opacity: isAvailable ? 1 : 0.55,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => isAvailable && navigate(`/event/${event.id}/date/${show.id}/sectors`)}
                                    {...(isAvailable ? {
                                        onMouseOver: (e) => {
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.15)';
                                        },
                                        onMouseOut: (e) => {
                                            e.currentTarget.style.transform = 'translateX(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    } : {})}
                                >
                                    <div>
                                        <p style={{
                                            color: isAvailable ? 'var(--primary)' : 'var(--error)',
                                            fontWeight: 700, fontSize: '0.75rem',
                                            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'
                                        }}>
                                            {isAvailable ? '● Disponible' : '✕ Agotado'}
                                        </p>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
                                            {show.date}
                                        </h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <Clock size={13} /> {show.time} hs
                                        </div>
                                    </div>
                                    {isAvailable && <ChevronRight color="var(--primary)" size={26} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Info límite */}
                    {eventLimits && (
                        <div style={{
                            marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)',
                            fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <Users size={13} color="var(--primary)" />
                            {eventLimits.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;


