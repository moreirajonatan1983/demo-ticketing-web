import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { MapPin, Music, Tent, Theater, Trophy, CalendarDays, Search } from 'lucide-react';

interface CategoryPageProps {
    title: string;
    category?: string;
}

const CategoryPage = ({ title, category }: CategoryPageProps) => {
    const navigate = useNavigate();
    const { events, fetchEvents } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Iconos temáticos dinámicos
    const getCategoryIcon = () => {
        switch (category) {
            case 'concierto': return <Music size={42} />;
            case 'festival': return <Tent size={42} />;
            case 'teatro': return <Theater size={42} />;
            case 'deporte': return <Trophy size={42} />;
            default: return <CalendarDays size={42} />;
        }
    };

    // Color del gradiente dinámico
    const getGradient = () => {
        switch (category) {
            case 'concierto': return 'linear-gradient(135deg, rgba(255, 71, 71, 0.2) 0%, rgba(20, 20, 20, 0) 100%)';
            case 'festival': return 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(20, 20, 20, 0) 100%)';
            case 'teatro': return 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(20, 20, 20, 0) 100%)';
            case 'deporte': return 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(20, 20, 20, 0) 100%)';
            default: return 'linear-gradient(135deg, rgba(255, 71, 71, 0.15) 0%, rgba(20, 20, 20, 0) 100%)';
        }
    };

    // Filtrar eventos por categoría y búsqueda local
    const filteredEvents = events.filter(e => {
        const matchesCategory = category ? e.title.toLowerCase().includes(category.toLowerCase()) || e.id.toLowerCase().includes(category.toLowerCase()) : true;
        const matchesSearch = searchQuery ? e.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', minHeight: '80vh' }}>
            {/* Banner Decorativo */}
            <div style={{
                background: getGradient(),
                padding: '4rem 2rem 3rem',
                margin: '0 -2rem 3rem -2rem',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
            }}>
                <button
                    className="btn btn-secondary"
                    style={{ position: 'absolute', top: '2rem', left: '2rem' }}
                    onClick={() => navigate(-1)}
                >
                    &larr; Volver
                </button>

                <div style={{
                    background: 'var(--glass-bg)',
                    padding: '1.5rem',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    color: 'var(--primary)',
                    boxShadow: '0 0 30px rgba(255,71,71,0.1)'
                }}>
                    {getCategoryIcon()}
                </div>
                <h1 className="title-glow" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>{title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    Explora nuestra cartelera temática. {title} más esperados, 100% garantizados y en los mejores recintos del país.
                </p>
            </div>

            {/* Barra de Búsqueda Local de la Categoría */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                    <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '20px', top: '16px' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder={`Buscar dentro de ${title}...`}
                        style={{ paddingLeft: '54px', height: '52px', borderRadius: 'var(--radius-full)' }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid de Eventos */}
            {filteredEvents.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🎫</p>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'white' }}>No hay eventos disponibles</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        ¡Próximamente anunciaremos nuevas fechas increíbles para la sección de <strong>{title.toLowerCase()}</strong>!<br />
                        Mantente atento a nuestras redes sociales.
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>
                        Ver todos los eventos
                    </button>
                </div>
            ) : (
                <div className="event-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {filteredEvents.map(ev => (
                        <div key={ev.id} className="event-card" onClick={() => navigate(`/event/${ev.id}`)}>
                            <div className="event-card-img" style={{ backgroundImage: `url(${ev.image || `http://localhost:3008/media/events/${ev.id}`})` }} />
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
