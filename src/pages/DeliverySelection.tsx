import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Smartphone, ShieldCheck } from 'lucide-react';
import EventHeader from '../components/EventHeader';
import { useStore } from '../store/useStore';

const DeliverySelection = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedDelivery, setSelectedDelivery] = useState('eticket');
    const { selectedEvent, fetchEventDetails } = useStore();

    useEffect(() => {
        if (id) fetchEventDetails(id);
    }, [id, fetchEventDetails]);

    const handleContinue = () => {
        // W-03: Pass through the Virtual Waiting Room before reaching checkout
        navigate(`/event/${id || "1"}/waiting-room`);
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <EventHeader title={selectedEvent?.title || "Cargando evento..."} date={selectedEvent?.date || "Cargando..."} timeRemaining="08:58" />

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                {/* Left - Delivery Options */}
                <div>
                    <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate(-1)}>
                        &larr; Volver a Butacas
                    </button>

                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>Método de Entrega</h2>

                    <div
                        className="glass-panel"
                        style={{
                            border: selectedDelivery === 'eticket' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: selectedDelivery === 'eticket' ? 'rgba(124, 58, 237, 0.1)' : 'var(--glass-bg)',
                            display: 'flex',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: selectedDelivery === 'eticket' ? 'var(--glow)' : 'none'
                        }}
                        onClick={() => setSelectedDelivery('eticket')}
                    >
                        <div style={{ paddingTop: '8px' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: selectedDelivery === 'eticket' ? 'var(--primary)' : 'transparent', border: selectedDelivery === 'eticket' ? 'none' : '2px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {selectedDelivery === 'eticket' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'white' }}></div>}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <Smartphone className="text-gradient" size={28} />
                                <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Ticket Digital (E-Ticket)</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                Tus entradas digitales serán enviadas al email registrado y estarán disponibles en la sección <strong>Mis Entradas</strong> dentro de la plataforma. Presenta el código QR desde tu dispositivo móvil el día del evento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right - Summary */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>Resumen de orden</h3>

                    <div className="summary-panel glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '10px', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🎫</span>
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>Platea Alta</h4>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sector <strong style={{ color: 'white' }}>301</strong></div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fila <strong style={{ color: 'white' }}>G</strong>, Asiento <strong style={{ color: 'white' }}>11</strong></div>
                                </div>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Subtotal (1 entrada)</span>
                                <span>$ 75.000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Cargo por servicio</span>
                                <span>$ 11.250</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Costo de entrega</span>
                                <span style={{ color: 'var(--success)' }}>Gratis</span>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.5rem', marginTop: '8px' }}>
                                <span>Total</span>
                                <span className="text-gradient">$ 86.250</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '2rem' }}
                            onClick={handleContinue}
                        >
                            Continuar al Pago seguro
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.5rem' }}>
                            <ShieldCheck size={14} /> Transacción cifrada de extremo a extremo
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default DeliverySelection;
