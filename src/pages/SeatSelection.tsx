import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Users, HelpCircle, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import EventHeader from '../components/EventHeader';

const SeatSelection = () => {
    const navigate = useNavigate();
    const { id, sectorId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [simulatedOccupied, setSimulatedOccupied] = useState<string[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const { seatsGrid: grid, fetchSeats, purchaseExpiresAt, setPurchaseExpiresAt } = useStore();
    const MAX_TICKETS = 4;

    useEffect(() => {
        if (id) fetchSeats(id);
    }, [id, fetchSeats]);

    const parseSectorName = (id?: string) => {
        if (!id) return 'Platea Alta';
        return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleSeatClick = (seatId: string, status: string) => {
        if (status === 'occupied' || status === 'processing' || simulatedOccupied.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            const nextSeats = selectedSeats.filter(id => id !== seatId);
            setSelectedSeats(nextSeats);
            if (nextSeats.length === 0) {
                setPurchaseExpiresAt(null);
            }
        } else {
            if (selectedSeats.length === 0 && !purchaseExpiresAt) {
                // Initialize 60s timer
                setPurchaseExpiresAt(Date.now() + 60000);
            }
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

    const handleSimulateConcurrency = () => {
        setIsSimulating(true);
        const allSeatIds = grid.flatMap(row => row.map(s => s.id));

        let attempts = 0;
        const intervalId = setInterval(() => {
            attempts++;
            const randomSeatsToOccupy: string[] = [];
            for (let i = 0; i < 3; i++) {
                const randomIdx = Math.floor(Math.random() * allSeatIds.length);
                const randomId = allSeatIds[randomIdx];
                if (!selectedSeats.includes(randomId)) { // No ocupar los del usuario actual
                    randomSeatsToOccupy.push(randomId);
                }
            }
            setSimulatedOccupied(prev => [...prev, ...randomSeatsToOccupy]);

            if (attempts > 6) {
                clearInterval(intervalId);
                setIsSimulating(false);
            }
        }, 1500); // Cada 1.5s ocupa lugares
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <EventHeader title="Ricardo Montaner" date="Domingo, 08 Marzo 2026 • 21:00 hs" timeRemaining="09:42" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <button className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '6px 16px', fontSize: '0.9rem' }} onClick={() => navigate(-1)}>
                        &larr; Volver a Mapa
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className="section-title title-glow" style={{ fontSize: '1.8rem', margin: 0 }}>Elegí tus Asientos</h2>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center', borderColor: 'var(--warning)', color: 'var(--warning)' }}
                            onClick={handleSimulateConcurrency}
                            disabled={isSimulating}
                        >
                            <Users size={14} />
                            {isSimulating ? 'Simulando...' : 'Simular Concurrencia'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', gap: '6px', alignItems: 'center' }}
                            onClick={() => setShowHelpModal(true)}
                        >
                            <HelpCircle size={14} />
                            Info Arq.
                        </button>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sector: <strong style={{ color: 'white' }}>{parseSectorName(sectorId)}</strong></p>
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

                                    if (seat.status === 'occupied' || simulatedOccupied.includes(seat.id)) {
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

            {/* Modal de Ayuda */}
            {showHelpModal && (
                <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setShowHelpModal(false)}>
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowHelpModal(false)}>
                            <X size={24} />
                        </button>
                        <h2 className="title-glow" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HelpCircle size={28} color="var(--primary)" />
                            Arquitectura y Casos de Uso
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                    🚀 Control de Concurrencia
                                </h3>
                                <p>Este mapa simula un comportamiento en tiempo real usando el patrón <strong>CQRS y Bloqueos Optimistas</strong>. Si haces clic en <em>"Simular Concurrencia"</em>, el sistema emulará a cientos de usuarios reales bloqueando butacas al azar. La base de datos DynamoDB usaría bloqueos optimistas (ConditionExpressions) para garantizar que dos usuarios no puedan comprar el mismo asiento en paralelo.</p>
                            </div>

                            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                    ⚙️ SAGA Coreografía (Step Functions)
                                </h3>
                                <p>Al presionar Continuar iniciarás el StateMachine. Aquí no hay una única transacción ACID, todo el proceso de descontar asientos, validar pagos y generar el ticket se orquesta mediante un workflow en <strong>AWS Step Functions</strong> usando funciones Lambda totalmente escalables. Si el "Pago" falla, las funciones Lambda regresarán y liberarán los asientos automáticamente.</p>
                            </div>

                            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                                    🛡️ Waiting Room Pattern
                                </h3>
                                <p>Previo a esta pantalla y al pagar, tu ingreso fue filtrado por un <strong>Sorting Queue en Redis</strong> en un cluster de Kubernetes. Esto protege a la base de datos de picos de cientos de miles de usuarios intentando hacer requests a la vez (por ejemplo, entradas para grandes recitales).</p>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '2rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowHelpModal(false)}>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;
