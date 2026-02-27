import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventHeader from '../components/EventHeader';

const MOCK_SECTORS = [
    { id: 'campo', name: 'Campo sentado', price: 135000, blocks: [{ id: 'A', name: 'A' }, { id: 'B', name: 'B' }, { id: 'C', name: 'C' }, { id: 'D', name: 'D' }] },
    { id: 'platea-baja', name: 'Platea Baja', price: 115000, blocks: [{ id: '102', name: '102' }, { id: '103', name: '103' }, { id: '104', name: '104' }, { id: '105', name: '105' }] },
    { id: 'platea-alta', name: 'Platea Alta', price: 70000, blocks: [{ id: '301', name: '301', status: 'available' }, { id: '302', name: '302', status: 'soldout' }, { id: '303', name: '303', status: 'available' }, { id: '304', name: '304', status: 'available' }, { id: '305', name: '305', status: 'available' }] }
];

const StadiumMap = () => {
    const navigate = useNavigate();
    const [expandedSector, setExpandedSector] = useState<string | null>('platea-alta');
    const [selectedBlock, setSelectedBlock] = useState<string>('301');
    const [qty, setQty] = useState(1);

    const handleContinue = () => {
        // Here we simulate picking a block, maybe next step is exact seats if numbered
        navigate(`/event/1/date/1/sector/${expandedSector}/block/${selectedBlock}/seats`);
    };

    return (
        <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' }}>
            <EventHeader title="Ricardo Montaner" date="domingo, 08 marzo 2026 09:00" timeRemaining="09:54" />

            <div className="flow-layout">
                {/* Left - Map Area */}
                <div className="flow-main-content">
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', padding: '12px', background: '#e0e0e0', borderRadius: '8px', maxWidth: '400px' }}>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ma-cyan)' }}></div> Seleccionado</span>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ma-green)' }}></div> Disponible</span>
                        <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#888' }}></div> Agotado</span>
                    </div>

                    <div style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Inline simplified map mimicking the shape */}
                        <svg viewBox="0 0 500 500" width="100%" height="100%">
                            {/* Escenario */}
                            <rect x="180" y="400" width="140" height="40" fill="#000" />
                            <text x="250" y="425" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">ESCENARIO</text>

                            {/* Campo Blocks */}
                            <path d="M 160 380 L 160 320 L 200 320 L 200 380 Z" className={`map-polygon ${selectedBlock === 'D' ? 'selected' : ''}`} fill="var(--ma-green)" />
                            <text x="180" y="355" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">D</text>

                            <path d="M 210 380 L 210 320 L 245 320 L 245 380 Z" className={`map-polygon ${selectedBlock === 'C' ? 'selected' : ''}`} fill="#888" />
                            <text x="227" y="355" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">C</text>

                            <path d="M 255 380 L 255 320 L 290 320 L 290 380 Z" className={`map-polygon ${selectedBlock === 'B' ? 'selected' : ''}`} fill="#888" />
                            <text x="272" y="355" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">B</text>

                            <path d="M 300 380 L 300 320 L 340 320 L 340 380 Z" className={`map-polygon ${selectedBlock === 'A' ? 'selected' : ''}`} fill="#888" />
                            <text x="320" y="355" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">A</text>

                            {/* Platea Alta - specific block 301 */}
                            <path d="M 350 380 L 350 350 L 390 350 L 380 380 Z" className={`map-polygon ${selectedBlock === '301' ? 'selected' : ''}`} fill={selectedBlock === '301' ? 'var(--ma-cyan)' : 'var(--ma-green)'} onClick={() => setSelectedBlock('301')} />
                            <text x="365" y="368" fill="#fff" fontSize="10" textAnchor="middle">301</text>

                            <path d="M 355 340 L 355 310 L 390 310 L 395 340 Z" className={`map-polygon ${selectedBlock === '302' ? 'selected' : ''}`} fill="#888" />
                            <text x="375" y="330" fill="#fff" fontSize="10" textAnchor="middle">302</text>

                            <path d="M 355 300 L 355 260 L 395 260 L 400 300 Z" className={`map-polygon ${selectedBlock === '303' ? 'selected' : ''}`} fill="#888" />
                            <text x="378" y="285" fill="#fff" fontSize="10" textAnchor="middle">303</text>

                            {/* Placeholder for the rest of the map */}
                            <path d="M 120 380 L 120 350 L 150 350 L 150 380 Z" fill="var(--ma-green)" />
                            <path d="M 110 340 L 110 310 L 150 310 L 150 340 Z" fill="var(--ma-green)" />

                            <path d="M 100 300 L 100 260 L 140 260 L 140 300 Z" fill="var(--ma-green)" />
                            <path d="M 110 250 L 130 200 L 170 200 L 150 250 Z" fill="var(--ma-green)" />
                            <path d="M 350 250 L 370 200 L 330 200 L 310 250 Z" fill="var(--ma-green)" />

                            <path d="M 180 190 L 220 150 L 280 150 L 320 190 Z" fill="var(--ma-green)" />
                        </svg>
                    </div>
                </div>

                {/* Right - Sidebar Config */}
                <div className="flow-sidebar">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 'bold' }}>Seleccionar ubicación</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Para continuar elegí tu ubicación desde el listado</p>

                    <div>
                        {MOCK_SECTORS.map(sec => (
                            <div key={sec.id} className="accordion">
                                <div className={`accordion-header ${expandedSector === sec.id ? 'active' : ''}`} onClick={() => setExpandedSector(sec.id)}>
                                    <div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>{sec.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>Desde $ {sec.price.toLocaleString('es-AR')}</div>
                                    </div>
                                    {expandedSector === sec.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>

                                {expandedSector === sec.id && (
                                    <div className="accordion-body">
                                        {/* Block List */}
                                        {sec.blocks.map(block => (
                                            <div key={block.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setSelectedBlock(block.id)}>
                                                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: selectedBlock === block.id ? '5px solid var(--ma-cyan)' : '2px solid #ccc', background: '#fff' }}></div>
                                                    <span style={{ fontWeight: selectedBlock === block.id ? 'bold' : 'normal' }}>{block.name}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span style={{ fontSize: '0.9rem' }}>$ {sec.price.toLocaleString('es-AR')}</span>
                                                    {selectedBlock === block.id && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <button style={{ width: 28, height: 28, background: 'var(--ma-cyan)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                                                            <span style={{ width: 20, textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
                                                            <button style={{ width: 28, height: 28, background: 'var(--ma-cyan)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setQty(qty + 1)}><Plus size={16} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Footer */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#e0e4e8', padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #cdd3d8' }}>
                <button
                    className="btn btn-primary"
                    style={{ width: '250px', padding: '14px', fontSize: '1.1rem' }}
                    onClick={handleContinue}
                >
                    Continuar
                </button>
            </div>

        </div>
    );
};

export default StadiumMap;
