import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TOTAL_ROWS = 8;
const SEATS_PER_ROW = 12;

// Generate mock seats. Center seats are taken/locked more frequently to simulate concurrency
const MOCK_SEATS = Array.from({ length: TOTAL_ROWS }, (_, rowIndex) => {
    return Array.from({ length: SEATS_PER_ROW }, (_, colIndex) => {
        const id = `${String.fromCharCode(65 + rowIndex)}-${colIndex + 1}`;
        // Center logic
        const isCenter = colIndex >= 4 && colIndex <= 7 && rowIndex <= 3;
        let status = 'available'; // available, reserved (locked by saga), taken

        if (isCenter) {
            const rand = Math.random();
            if (rand > 0.4) status = 'taken';
            else if (rand > 0.1) status = 'reserved';
        } else {
            if (Math.random() > 0.8) status = 'taken';
        }

        return { id, row: String.fromCharCode(65 + rowIndex), number: colIndex + 1, status };
    });
});

const SeatSelection = () => {
    const { id: eventId, sectorId } = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const handleSeatClick = (seat: any) => {
        if (seat.status !== 'available') return;

        if (selectedSeats.includes(seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat.id));
        } else {
            if (selectedSeats.length >= 4) {
                alert("El límite máximo es de 4 entradas por persona para este evento.");
                return;
            }
            setSelectedSeats([...selectedSeats, seat.id]);
        }
    };

    const handleContinue = () => {
        navigate(`/event/${eventId}/checkout`);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '2rem', fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => navigate(-1)}>
                &larr; Volver a Sectores
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title title-glow" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Elegí tus Asientos</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Sector: <strong style={{ color: 'var(--secondary)' }}>{sectorId?.replace('sec-', '').toUpperCase()}</strong></p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>

                {/* Left - Seat Grid */}
                <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(10,10,12,0.9)' }}>
                    <div style={{
                        width: '80%', height: '40px', background: 'linear-gradient(to top, rgba(0, 210, 255, 0.4), transparent)',
                        borderBottom: '4px solid var(--secondary)', borderRadius: '20px 20px 0 0',
                        marginBottom: '4rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '8px',
                        textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold'
                    }}>
                        Escenario
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {MOCK_SEATS.map((row, rIdx) => (
                            <div key={rIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ width: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{String.fromCharCode(65 + rIdx)}</span>

                                {row.map((seat) => {
                                    const isSelected = selectedSeats.includes(seat.id);
                                    let bgColor = 'rgba(255,255,255,0.1)';
                                    let cursor = 'pointer';
                                    let border = '1px solid rgba(255,255,255,0.2)';

                                    if (seat.status === 'taken') {
                                        bgColor = 'rgba(255,255,255,0.02)';
                                        border = '1px solid rgba(255,255,255,0.05)';
                                        cursor = 'not-allowed';
                                    } else if (seat.status === 'reserved') {
                                        bgColor = 'rgba(245, 158, 11, 0.3)'; // Warning orange for locked seats
                                        border = '1px solid var(--warning)';
                                        cursor = 'not-allowed';
                                    } else if (isSelected) {
                                        bgColor = 'var(--secondary)';
                                        border = '1px solid var(--secondary)';
                                    }

                                    return (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat)}
                                            title={seat.status === 'reserved' ? 'Asiento bloqueado temporalmente (Alguien más está comprando)' : `Asiento ${seat.id}`}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '6px',
                                                background: bgColor, border, cursor,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: isSelected ? 'black' : 'var(--text-secondary)',
                                                fontSize: '0.7rem', fontWeight: 'bold',
                                                transition: 'transform 0.1s'
                                            }}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            onMouseEnter={(e) => { if (seat.status === 'available' && !isSelected) e.currentTarget.style.transform = 'scale(1.15)' }}
                                        >
                                            {seat.number}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div> Disponible</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--secondary)' }}></div> Seleccionado</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(245, 158, 11, 0.3)', border: '1px solid var(--warning)' }}></div> En proceso de compra</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}></div> Ocupado</span>
                    </div>

                </div>

                {/* Right - Summary */}
                <div>
                    <div className="summary-panel glass-panel" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700' }}>Tus Asientos</h3>

                        {selectedSeats.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Aún no has seleccionado ningún asiento.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                                {selectedSeats.map(seatId => (
                                    <div key={seatId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                        <span style={{ fontWeight: 'bold' }}>Fila {seatId.split('-')[0]} - Asiento {seatId.split('-')[1]}</span>
                                        <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>$350.00</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1rem', background: 'rgba(255, 153, 0, 0.1)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-sm)', color: 'var(--warning)', marginBottom: '2rem' }}>
                            <AlertCircle size={24} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.85rem' }}>Debido a la alta demanda, los asientos no se bloquean hasta hacer click en Confirmar.</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '800' }}>
                            <span>Total</span>
                            <span className="text-gradient">${(selectedSeats.length * 350).toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', opacity: selectedSeats.length === 0 ? 0.5 : 1, pointerEvents: selectedSeats.length === 0 ? 'none' : 'auto' }}
                            onClick={handleContinue}
                        >
                            Confirmar Entradas
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SeatSelection;
