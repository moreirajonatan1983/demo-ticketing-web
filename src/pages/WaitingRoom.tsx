import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Clock, CheckCircle, Wifi } from 'lucide-react';

const WAITING_ROOM_URL = 'http://localhost:8082';
const POLL_INTERVAL_MS = 3000;

type QueueStatus = 'WAITING' | 'ADMITTED' | 'EXPIRED' | 'JOINING' | 'ERROR';

interface WaitingToken {
    tokenId: string;
    status: QueueStatus;
    position: number;
    estimatedWaitSeconds: number;
    canProceed: boolean;
}

const WaitingRoom = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // eventId
    const [token, setToken] = useState<WaitingToken | null>(null);
    const [status, setStatus] = useState<QueueStatus>('JOINING');
    const [dots, setDots] = useState('');

    // Animated dots for "waiting..." text
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 600);
        return () => clearInterval(interval);
    }, []);

    // Join the queue on mount
    useEffect(() => {
        const join = async () => {
            try {
                setStatus('JOINING');
                const res = await fetch(`${WAITING_ROOM_URL}/waiting-room/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: 'mock-user-123', eventId: id || '1' })
                });
                if (!res.ok) throw new Error('Failed to join');
                const data: WaitingToken = await res.json();
                setToken(data);
                setStatus(data.status);
            } catch (err) {
                console.error('[WAITING-ROOM] Failed to join queue:', err);
                setStatus('ERROR');
            }
        };
        join();
    }, [id]);

    // Poll status every 3 seconds
    const pollStatus = useCallback(async () => {
        if (!token?.tokenId || status === 'ADMITTED' || status === 'ERROR') return;
        try {
            const res = await fetch(`${WAITING_ROOM_URL}/waiting-room/status/${token.tokenId}`);
            const data: WaitingToken = await res.json();
            setToken(data);
            setStatus(data.status);
            if (data.canProceed) {
                setTimeout(() => navigate(`/event/${id}/checkout`), 1500);
            }
        } catch (err) {
            console.error('[WAITING-ROOM] Poll error:', err);
        }
    }, [token?.tokenId, status, id, navigate]);

    useEffect(() => {
        if (status !== 'WAITING') return;
        const interval = setInterval(pollStatus, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [status, pollStatus]);

    const formatWait = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    };

    const progressPct = token
        ? Math.max(0, Math.min(100, 100 - (token.position / Math.max(token.position, 1)) * 100))
        : 0;

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                maxWidth: '560px',
                width: '100%',
                padding: '3rem 2.5rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Pulse background glow */}
                <div style={{
                    position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: status === 'ADMITTED'
                        ? 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(0,210,255,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none', transition: 'background 1s ease'
                }} />

                {/* Icon */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: status === 'ADMITTED'
                        ? 'rgba(16,185,129,0.2)'
                        : status === 'ERROR'
                            ? 'rgba(239,68,68,0.2)'
                            : 'rgba(0,210,255,0.15)',
                    border: `2px solid ${status === 'ADMITTED' ? 'rgba(16,185,129,0.4)' : 'rgba(0,210,255,0.2)'}`,
                    animation: status === 'WAITING' ? 'pulse 2s infinite' : 'none'
                }}>
                    {status === 'ADMITTED'
                        ? <CheckCircle size={36} color="#10b981" />
                        : status === 'ERROR'
                            ? <Wifi size={36} color="#ef4444" />
                            : <Users size={36} color="var(--secondary)" />}
                </div>

                {/* Titles per state */}
                {status === 'JOINING' && (
                    <>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Ingresando a la Sala de Espera{dots}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Conectando con el servidor{dots}</p>
                    </>
                )}

                {status === 'WAITING' && token && (
                    <>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Sala de Espera Virtual
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Estás en la fila para comprar tus entradas. Aguardá tu turno.
                        </p>

                        {/* Position badge */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(0,210,255,0.08)',
                            border: '1px solid rgba(0,210,255,0.2)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>
                                #{token.position + 1}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                tu posición en la fila
                            </div>
                        </div>

                        {/* ETA */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem'
                        }}>
                            <Clock size={16} />
                            <span>Tiempo estimado: <strong style={{ color: 'white' }}>
                                {token.estimatedWaitSeconds > 0 ? formatWait(token.estimatedWaitSeconds) : 'menos de 1 min'}
                            </strong></span>
                        </div>

                        {/* Progress bar */}
                        <div style={{
                            height: '6px', background: 'rgba(255,255,255,0.08)',
                            borderRadius: '3px', overflow: 'hidden', marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progressPct}%`,
                                background: 'linear-gradient(90deg, var(--secondary), #7c3aed)',
                                transition: 'width 0.8s ease',
                                borderRadius: '3px'
                            }} />
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            🔄 Actualizando automáticamente cada {POLL_INTERVAL_MS / 1000} segundos
                        </p>
                    </>
                )}

                {status === 'ADMITTED' && (
                    <>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#10b981' }}>
                            ¡Es tu turno!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Tenés <strong style={{ color: 'white' }}>5 minutos</strong> para completar tu compra antes de que el turno expire.
                        </p>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#10b981', fontSize: '0.9rem', marginBottom: '2rem'
                        }}>
                            ✅ Redirigiendo al checkout{dots}
                        </div>
                    </>
                )}

                {status === 'EXPIRED' && (
                    <>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Turno Expirado
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Tu turno expiró. Podés volver a la fila.
                        </p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Reingresar a la Fila
                        </button>
                    </>
                )}

                {status === 'ERROR' && (
                    <>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Sala de Espera no disponible
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            El servicio de sala de espera no está activo. Podés continuar directo al checkout.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Volver</button>
                            <button className="btn btn-primary" onClick={() => navigate(`/event/${id}/checkout`)}>
                                Ir al Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.3); }
                    50% { box-shadow: 0 0 0 16px rgba(0, 210, 255, 0); }
                }
            `}</style>
        </div>
    );
};

export default WaitingRoom;
