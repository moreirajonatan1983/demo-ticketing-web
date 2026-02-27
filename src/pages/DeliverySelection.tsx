import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventHeader from '../components/EventHeader';

const DeliverySelection = () => {
    const navigate = useNavigate();
    const [selectedDelivery, setSelectedDelivery] = useState('eticket');

    const handleContinue = () => {
        // Proceed to payment checkout
        navigate('/event/1/checkout');
    };

    return (
        <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' }}>
            <EventHeader title="Ricardo Montaner" date="domingo, 08 marzo 2026 09:00" timeRemaining="08:58" />

            <div className="flow-layout">
                {/* Left - Delivery Options */}
                <div className="flow-main-content">
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--ma-cyan)', fontWeight: 'bold', marginBottom: '2rem' }}>Para continuar, seleccioná como recibir tus entradas</h3>

                    <div
                        style={{ border: selectedDelivery === 'eticket' ? '2px solid var(--ma-green)' : '1px solid #ddd', background: selectedDelivery === 'eticket' ? '#f0f4f0' : 'white', borderRadius: '4px', padding: '1.5rem', display: 'flex', gap: '1.5rem', cursor: 'pointer' }}
                        onClick={() => setSelectedDelivery('eticket')}
                    >
                        <div style={{ paddingTop: '8px' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: selectedDelivery === 'eticket' ? 'var(--ma-green)' : 'transparent', border: selectedDelivery === 'eticket' ? 'none' : '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {selectedDelivery === 'eticket' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ fontSize: '1.5rem' }}>📱</div>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--ma-red)' }}>e-ticket</span>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                                Los e-tickets serán enviados al mail con el cual te registraste. Vas a ver tus entradas <strong>5 días antes del show en la sección "Mis entradas"</strong>. Para el ingreso podés mostrarlas desde tu teléfono o descargarlas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right - Summary */}
                <div className="flow-sidebar">
                    <button className="btn" style={{ background: 'transparent', color: 'var(--ma-cyan)', padding: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate(-1)}>
                        &larr; Cambiar asientos
                    </button>

                    <h3 style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Resumen de compra</h3>

                    <div style={{ padding: '1.5rem', border: '1px solid #eee', background: '#fcfcfc', borderRadius: '8px', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--ma-cyan)' }}>🎟️</span>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Platea Alta</h4>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Sector <strong>301</strong></div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Fila <strong>g</strong>, Asiento <strong>11</strong></div>
                                </div>
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>$ 75.000</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '2px solid #ccc', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                            <span>Subtotal</span>
                            <span>$ 75.000</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                            <span>Service charge</span>
                            <span>$ 11.250</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                            <span>Entrega</span>
                            <span>$ 0</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '8px' }}>
                            <span>Total</span>
                            <span>$ 86.250</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Sticky Footer */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#e0e4e8', padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #cdd3d8' }}>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', maxWidth: '400px', padding: '14px', fontSize: '1.1rem' }}
                    onClick={handleContinue}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default DeliverySelection;
