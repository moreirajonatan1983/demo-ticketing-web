import { Clock } from 'lucide-react';

interface EventHeaderProps {
    title: string;
    date: string;
    timeRemaining: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, date, timeRemaining }) => {
    return (
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '50px', backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' }}></div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{date}</p>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} className="text-gradient" />
                <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', color: 'white' }}>{timeRemaining}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tiempo restante para terminar tu compra</span>
            </div>
        </div>
    );
};

export default EventHeader;
