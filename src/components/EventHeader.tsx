import { Clock } from 'lucide-react';

interface EventHeaderProps {
    title: string;
    date: string;
    timeRemaining: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, date, timeRemaining }) => {
    return (
        <div className="flow-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '50px', backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' }}></div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{date}</p>
                </div>
            </div>

            <div className="timer-box">
                <Clock size={20} color="var(--ma-green)" />
                <div className="time">{timeRemaining}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tiempo restante para terminar tu compra</span>
            </div>
        </div>
    );
};

export default EventHeader;
