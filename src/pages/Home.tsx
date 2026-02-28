import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface EventData {
    id: string;
    title: string;
    date: string;
    venue: string;
    image: string;
    status: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventData[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Error fetching events:", err));
    }, []);

    return (
        <div className="animate-fade-in">
            <section className="hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533174000228-db3cecc27004?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')` }}>
                <div className="hero-content">
                    <span className="badge badge-error" style={{ marginBottom: '1rem', display: 'inline-block' }}>PREVENTA EXCLUSIVA</span>
                    <h1 className="hero-title title-glow">Siente la Música.<br />Vive el Momento.</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}>
                        Asegura tu lugar en los eventos más esperados del año. Ingresa a la fila virtual o compra directamente tu entrada.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary">Ver Destacados</button>
                    </div>
                </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Próximos Eventos</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                    <input type="text" className="form-input" placeholder="Buscar artista o recinto..." style={{ paddingLeft: '48px' }} />
                </div>
            </div>

            <div className="event-grid">
                {events.map(ev => (
                    <div key={ev.id} className="event-card" onClick={() => navigate(`/event/${ev.id}`)}>
                        <div className="event-card-img" style={{ backgroundImage: `url(${ev.image})` }} />
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
        </div>
    );
};

export default Home;
