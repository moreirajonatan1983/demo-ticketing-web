import { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, QrCode } from 'lucide-react';

interface TicketData {
    id: string; // The Go struct uses ID, but JSON tag might be id
    event_id: string; // The Go struct might map JSON differently, let's just make sure
    user_id: string;
    purchase_date: string;
    status: string;
    seats: string[];
    total_paid: number;
}

const MyTickets = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);

    useEffect(() => {
        fetch('http://localhost:3006/tickets/me?userId=mock_user')
            .then(res => res.json())
            .then(data => setTickets(data))
            .catch(err => console.error("Error fetching tickets:", err));
    }, []);
    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <h2 className="section-title title-glow" style={{ textAlign: 'left', marginBottom: '1rem' }}>Mis Entradas</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Gestiona tus tickets adquiridos. Presenta el código QR en la puerta del evento.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {tickets.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No tienes tickets aún.</p>}
                {tickets.map((t, idx) => (
                    <div key={idx} className="glass-panel" style={{ display: 'flex', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ width: '250px', backgroundImage: 'url("https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>

                        <div style={{ padding: '2rem', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span className="badge badge-success" style={{ marginBottom: '8px' }}>{t.status === 'confirmed' ? 'PAGADO OKEY' : t.status}</span>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Evento #{t.event_id}</h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ticket ID</p>
                                    <p style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{t.id.split('-')[0].toUpperCase()}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '3rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Fecha</span>
                                    <p style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {new Date(t.purchase_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Ubicación</span>
                                    <p style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Estadio Nacional</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Sector / Asientos</span>
                                    <p style={{ color: 'var(--secondary)', fontWeight: '800' }}>{t.seats?.join(', ')}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button className="btn btn-secondary"><Ticket size={18} /> Descargar PDF</button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '6px 12px', borderRadius: '8px', color: 'black' }}>
                                    <QrCode size={24} /> <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Mostrar QR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default MyTickets;
