import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import EventHeader from '../components/EventHeader';

const SeatSelection = () => {
    const navigate = useNavigate();
    const { id, sectorId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [grid, setGrid] = useState<any[][]>([]);
    const MAX_TICKETS = 4;

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:3005/events/${id}/seats`)
            .then(res => res.json())
            .then(data => {
                const rowsObj: Record<string, any[]> = {};
                data.forEach((seat: any) => {
                    if (!rowsObj[seat.row]) rowsObj[seat.row] = [];
                    rowsObj[seat.row].push(seat);
                });
                const sortedRows = Object.keys(rowsObj).sort().map(r => rowsObj[r].sort((a: any, b: any) => a.number - b.number));
                setGrid(sortedRows);
            })
            .catch(err => console.error("Error fetching seats", err));
    }, [id]);

    const parseSectorName = (id?: string) => {
        if (!id) return 'Platea Alta';
        return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleSeatClick = (seatId: string, status: string) => {
        if (status === 'occupied' || status === 'processing') return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= MAX_TICKETS) {
                alert(`Solo se permiten un máximo de ${MAX_TICKETS} tickets por transacción.`);
                return;
            }
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) return;
        navigate(`/event/${id || '1'}/delivery`);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <EventHeader title="Ricardo Montaner" date="Domingo, 08 Marzo 2026 • 21:00 hs" timeRemaining="09:42" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <button className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '6px 16px', fontSize: '0.9rem' }} onClick={() => navigate(-1)}>
                        &larr; Volver a Mapa
                    </button>
                    <h2 className="section-title title-glow" style={{ fontSize: '1.8rem', margin: 0 }}>Elegí tus Asientos</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sector: <strong style={{ color: 'white' }}>{parseSectorName(sectorId)}</strong></p>
                </div>

                <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '4px', border: '1px solid var(--primary)', background: 'rgba(124, 58, 237, 0.2)' }}></div>
                        <span style={{ fontSize: '0.9rem' }}>Disponible</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '4px', background: 'var(--primary)' }}></div>
                        <span style={{ fontSize: '0.9rem' }}>Seleccionado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ fontSize: '0.9rem' }}>Ocupado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '4px', background: 'var(--warning)', cursor: 'help' }} title="Otro usuario está por comprarlo"></div>
                        <span style={{ fontSize: '0.9rem' }}>En Proceso</span>
                    </div>
                </div>
            </div>

            {/* Asientos Workspace - Interfaz Oscura Simulando Cines/Arenas */}
            <div className="glass-panel" style={{ padding: '3rem', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', overflowX: 'auto' }}>

                {/* Pantalla / Escenario Mock (Top) */}
                <div style={{ width: '80%', maxWidth: '600px', height: '40px', background: 'linear-gradient(to top, rgba(124, 58, 237, 0.2), transparent)', borderBottom: '3px solid var(--primary)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '5px', letterSpacing: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>ESCENARIO</div>

                {/* Grilla */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {grid.map((rowSeats, rIdx) => (
                        <div key={`row-${rIdx}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{rowSeats[0].row}</span>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                {rowSeats.map((seat: any) => {
                                    const isSelected = selectedSeats.includes(seat.id);
                                    let bgColor = 'rgba(124, 58, 237, 0.1)';
                                    let borderColor = 'var(--primary)';
                                    let cursor = 'pointer';
                                    let opacity = 1;

                                    if (seat.status === 'occupied') {
                                        bgColor = 'rgba(255,255,255,0.05)';
                                        borderColor = 'transparent';
                                        cursor = 'not-allowed';
                                        opacity = 0.5;
                                    } else if (seat.status === 'processing') {
                                        bgColor = 'var(--warning)';
                                        borderColor = 'transparent';
                                        cursor = 'not-allowed';
                                    } else if (isSelected) {
                                        bgColor = 'var(--primary)';
                                    }

                                    return (
                                        <div
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat.id, seat.status)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px 6px 2px 2px',
                                                background: bgColor,
                                                border: `1px solid ${borderColor}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                cursor,
                                                opacity,
                                                color: isSelected ? 'white' : 'var(--text-secondary)',
                                                transition: 'transform 0.1s',
                                                transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                            }}
                                            title={`Fila ${seat.row} - Asiento ${seat.number}`}
                                        >
                                            {seat.number}
                                        </div>
                                    );
                                })}
                            </div>

                            <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'right' }}>{rowSeats[0].row}</span>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom Panel */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-secondary)', padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {selectedSeats.length > 0 ? selectedSeats.map(s => (
                            <span key={s} style={{ background: 'var(--primary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                                {s}
                            </span>
                        )) : (
                            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} /> Selecciona tus butacas en el mapa
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>Total: <strong className="text-gradient">${(selectedSeats.length * 75000).toLocaleString('es-AR')}</strong></span>
                    <button
                        className="btn btn-primary"
                        disabled={selectedSeats.length === 0}
                        onClick={handleContinue}
                        style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1, padding: '12px 32px' }}
                    >
                        Continuar
                    </button>
                </div>
            </div>

            <div style={{ paddingBottom: '80px' }}></div>
        </div>
    );
};

export default SeatSelection;
