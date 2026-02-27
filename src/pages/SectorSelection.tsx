import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const MOCK_SECTORS = [
    { id: 'sec-vip', name: 'VIP Front Stage', price: 350.00, status: 'Disponible', color: 'var(--secondary)' },
    { id: 'sec-platea-baja', name: 'Platea Baja Preferencial', price: 250.00, status: 'Pocos Asientos', color: 'var(--primary)' },
    { id: 'sec-campo', name: 'Campo General', price: 150.00, status: 'Disponible', color: 'var(--success)' },
    { id: 'sec-platea-alta', name: 'Platea Alta', price: 90.00, status: 'Sold Out', color: 'var(--text-secondary)' }
];

const SectorSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '2rem', fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => navigate(-1)}>
                &larr; Volver a Cartelera
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem' }}>

                {/* Left Col - Map */}
                <div>
                    <h2 className="section-title title-glow" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '1rem' }}>COLDPLAY - Music of the Spheres</h2>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> 15 OCT 2026 - 21:00 HS</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Estadio Nacional</span>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', background: 'var(--bg-secondary)' }}>
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                borderRadius: '50% 50% 10px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'radial-gradient(ellipse at bottom, rgba(0,210,255,0.1) 0%, transparent 60%)'
                            }}>
                                <h3>Escenario (Mapa Virtual)</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Sectors */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Selecciona tu Sector</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {MOCK_SECTORS.map((sector) => (
                            <div
                                key={sector.id}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    cursor: sector.status === 'Sold Out' ? 'not-allowed' : 'pointer',
                                    opacity: sector.status === 'Sold Out' ? 0.5 : 1,
                                    borderLeft: `4px solid ${sector.color}`,
                                    transition: 'transform 0.2s ease, background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (sector.status !== 'Sold Out') e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--glass-bg)';
                                }}
                                onClick={() => {
                                    if (sector.status !== 'Sold Out') navigate(`/event/${id}/sector/${sector.id}/seats`);
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{sector.name}</h4>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: sector.color }}>${sector.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Numerado</span>
                                    <span className={`badge ${sector.status === 'Disponible' ? 'badge-success' : sector.status === 'Sold Out' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                                        {sector.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SectorSelection;
