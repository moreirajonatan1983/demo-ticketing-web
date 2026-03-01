import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface EventHeaderProps {
    title: string;
    date: string;
    timeRemaining?: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, date, timeRemaining }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { purchaseExpiresAt, setPurchaseExpiresAt } = useStore();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!purchaseExpiresAt) {
            setTimeLeft(null);
            return;
        }

        const tick = () => {
            const now = Date.now();
            const diff = purchaseExpiresAt - now;
            if (diff <= 0) {
                setTimeLeft(0);
                setTimeout(() => {
                    alert('⏳ El tiempo de reserva de 1 minuto ha expirado. Por la alta concurrencia, las butacas han sido liberadas para otros usuarios.');
                    setPurchaseExpiresAt(null);
                    navigate(`/event/${id || '1'}/map`);
                }, 100);
            } else {
                setTimeLeft(Math.floor(diff / 1000));
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [purchaseExpiresAt, navigate, id, setPurchaseExpiresAt]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const displayTime = timeLeft !== null
        ? formatTime(timeLeft)
        : (timeRemaining || "01:00");

    const isUrgent = timeLeft !== null && timeLeft <= 15;

    return (
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '50px', backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px' }}></div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{date}</p>
                </div>
            </div>

            <div style={{ background: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'var(--glass-border)'}`, padding: '10px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s' }}>
                <Clock size={20} className={isUrgent ? "" : "text-gradient"} color={isUrgent ? "#ef4444" : undefined} style={{ animation: isUrgent ? 'pulse 1s infinite' : 'none' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', color: isUrgent ? '#ef4444' : 'white' }}>{displayTime}</div>
                <span style={{ fontSize: '0.8rem', color: isUrgent ? '#ef4444' : 'var(--text-secondary)' }}>Tiempo restante para terminar tu compra</span>
            </div>
        </div>
    );
};

export default EventHeader;
