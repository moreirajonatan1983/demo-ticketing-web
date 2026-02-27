import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_EVENTS = [
    {
        id: 1,
        title: 'COLDPLAY - Music of the Spheres',
        date: '15 OCT 2026',
        venue: 'Estadio Nacional',
        image: 'https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'Disponible'
    },
    {
        id: 2,
        title: 'THE WEEKND - After Hours Tour',
        date: '22 NOV 2026',
        venue: 'Movistar Arena',
        image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'Pocos Tickets'
    },
    {
        id: 3,
        title: 'DUA LIPA - Radical Optimism',
        date: '04 DIC 2026',
        venue: 'Hipódromo',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'Sold Out'
    }
];

const Home = () => {
    const navigate = useNavigate();

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
                {MOCK_EVENTS.map(ev => (
                    <div key={ev.id} className="event-card" onClick={() => navigate(`/checkout/${ev.id}`)}>
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
