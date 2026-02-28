import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import EventHeader from '../components/EventHeader';
import { useStore } from '../store/useStore';

const MOCK_SECTORS = [
    { id: 'campo', name: 'Campo Sentado', price: 135000, status: 'available', blocks: [{ id: 'A', name: 'Bloque A' }, { id: 'B', name: 'Bloque B' }] },
    { id: 'platea-baja', name: 'Platea Baja', price: 115000, status: 'few', blocks: [{ id: '102', name: 'Sector 102' }, { id: '103', name: 'Sector 103' }] },
    { id: 'platea-alta', name: 'Platea Alta', price: 70000, status: 'available', blocks: [{ id: '301', name: 'Sector 301' }, { id: '304', name: 'Sector 304' }] },
    { id: 'vip', name: 'Premium Lounge', price: 250000, status: 'soldout', blocks: [] }
];

const StadiumMap = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const { selectedEvent, fetchEventDetails } = useStore();

    useEffect(() => {
        if (id) fetchEventDetails(id);
    }, [id, fetchEventDetails]);

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <EventHeader title={selectedEvent?.title || "Cargando evento..."} date={selectedEvent?.date || "Cargando..."} timeRemaining="09:54" />

            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem', marginTop: '1rem' }} onClick={() => navigate(-1)}>
                &larr; Volver al Evento
            </button>

            <h2 className="section-title title-glow" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Seleccionar Sector</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Left - Visual Map Placeholder */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', position: 'relative' }}>

                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '10px 15px', borderRadius: 'var(--radius-full)' }}>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }}></div> Disponible</span>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--warning)' }}></div> Pocos tickets</span>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--glass-border)' }}></div> Agotado</span>
                    </div>

                    <div style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        {/* Escenario */}
                        <div style={{ width: '200px', height: '40px', background: 'linear-gradient(to right, #2a2a35, #3f3f5a)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '4px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -5px 20px rgba(124, 58, 237, 0.3)' }}>ESCENARIO</div>

                        {/* Fake SVG Map styled in dark mode */}
                        <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                            {/* Campo Blocks */}
                            <path d="M 120 320 L 120 200 L 220 200 L 220 320 Z" className="map-polygon" fill="var(--primary)" opacity={selectedSector === 'campo' ? 1 : 0.6} onClick={() => setSelectedSector('campo')} style={{ cursor: 'pointer', transition: 'var(--transition)' }} />
                            <text x="170" y="265" fill="#fff" fontSize="20" fontWeight="bold" textAnchor="middle" pointerEvents="none">CAMPO</text>

                            <path d="M 280 320 L 280 200 L 380 200 L 380 320 Z" className="map-polygon" fill="var(--primary)" opacity={selectedSector === 'campo' ? 1 : 0.6} onClick={() => setSelectedSector('campo')} style={{ cursor: 'pointer', transition: 'var(--transition)' }} />
                            <text x="330" y="265" fill="#fff" fontSize="20" fontWeight="bold" textAnchor="middle" pointerEvents="none">CAMPO</text>

                            {/* Platea Baja */}
                            <path d="M 70 340 L 100 200 L 100 150 L 50 150 L 20 340 Z" fill="var(--warning)" opacity={selectedSector === 'platea-baja' ? 1 : 0.6} onClick={() => setSelectedSector('platea-baja')} style={{ cursor: 'pointer', transition: 'var(--transition)' }} />
                            <path d="M 430 340 L 400 200 L 400 150 L 450 150 L 480 340 Z" fill="var(--warning)" opacity={selectedSector === 'platea-baja' ? 1 : 0.6} onClick={() => setSelectedSector('platea-baja')} style={{ cursor: 'pointer', transition: 'var(--transition)' }} />

                            {/* Platea Alta - specific block 301 */}
                            <path d="M 150 100 L 350 100 L 400 20 L 100 20 Z" fill="var(--primary)" opacity={selectedSector === 'platea-alta' ? 1 : 0.6} onClick={() => setSelectedSector('platea-alta')} style={{ cursor: 'pointer', transition: 'var(--transition)' }} />
                            <text x="250" y="65" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle" pointerEvents="none">PLATEA ALTA</text>
                        </svg>
                    </div>
                </div>

                {/* Right - Sector List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MOCK_SECTORS.map(sec => (
                        <div
                            key={sec.id}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                cursor: sec.status === 'soldout' ? 'not-allowed' : 'pointer',
                                border: selectedSector === sec.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                opacity: sec.status === 'soldout' ? 0.5 : 1,
                                transition: 'var(--transition)',
                                transform: selectedSector === sec.id ? 'translateY(-2px)' : 'none',
                                boxShadow: selectedSector === sec.id ? 'var(--glow)' : 'none'
                            }}
                            onClick={() => {
                                if (sec.status !== 'soldout') {
                                    if (selectedSector === sec.id) {
                                        navigate(`/event/${id || "1"}/date/1/sector/${sec.id}/block/1/seats`);
                                    } else {
                                        setSelectedSector(sec.id);
                                    }
                                }
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>{sec.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Desde <span style={{ color: 'white', fontWeight: 'bold' }}>$ {sec.price.toLocaleString('es-AR')}</span></div>
                                </div>
                                <div>
                                    {sec.status === 'soldout' && <span style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Agotado</span>}
                                    {sec.status === 'few' && <span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Pocos</span>}
                                    {sec.status === 'available' && <span style={{ padding: '4px 8px', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Disponible</span>}
                                </div>
                            </div>

                            {/* Expanded State (Preview of continue block) */}
                            {selectedSector === sec.id && sec.status !== 'soldout' && (
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><Info size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Toca nuevamente para ver asientos</span>
                                    <button className="btn btn-primary" onClick={() => navigate(`/event/${id || "1"}/date/1/sector/${sec.id}/block/1/seats`)}>
                                        Ver Butacas
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default StadiumMap;
