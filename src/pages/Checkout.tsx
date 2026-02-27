
import { useState } from 'react';
import { Calendar, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [qtyStall, setQtyStall] = useState(0);
    const [qtyVip, setQtyVip] = useState(0);

    const total = (qtyStall * 150) + (qtyVip * 350);
    const totalItems = qtyStall + qtyVip;

    const handlePay = () => {
        alert("¡Pago simulado procesado exitosamente! Circuit Breaker y SAGA cerrados.");
        navigate('/mytickets');
    };

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>

                {/* Left Col - Select Tickets */}
                <div>
                    <h2 className="section-title title-glow" style={{ textAlign: 'left', fontSize: '2rem' }}>COLDPLAY - Music of the Spheres</h2>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> 15 OCT 2026 - 21:00 HS</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Estadio Nacional</span>
                    </div>

                    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                        <div className="ticket-row">
                            <div className="ticket-info">
                                <h4>Campo General / Platea Alta</h4>
                                <p>Ubicación por orden de llegada.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <span className="ticket-price">$150.00</span>
                                <div className="quantity-selector">
                                    <button className="qty-btn" onClick={() => setQtyStall(Math.max(0, qtyStall - 1))}>-</button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{qtyStall}</span>
                                    <button className="qty-btn" onClick={() => setQtyStall(qtyStall + 1)}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className="ticket-row">
                            <div className="ticket-info">
                                <h4>VIP Front Stage - Meet & Greet</h4>
                                <p>Acceso anticipado, merchandising oficial.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <span className="ticket-price" style={{ color: 'var(--secondary)' }}>$350.00</span>
                                <div className="quantity-selector">
                                    <button className="qty-btn" onClick={() => setQtyVip(Math.max(0, qtyVip - 1))}>-</button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{qtyVip}</span>
                                    <button className="qty-btn" onClick={() => setQtyVip(qtyVip + 1)}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(255, 71, 71, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: '#ffb3b3' }}>
                        <Calendar size={20} /> Estas entradas tienen una retención temporal de 5:00 minutos. Completa el pago antes de que expiren.
                    </div>
                </div>

                {/* Right Col - Summary */}
                <div>
                    <div className="summary-panel glass-panel">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Resumen de Compra</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            <span>Entradas ({totalItems})</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            <span>Cargo por Servicio (10%)</span>
                            <span>${(total * 0.1).toFixed(2)}</span>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800' }}>
                            <span>Total</span>
                            <span className="text-gradient">${(total * 1.1).toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem', opacity: total === 0 ? 0.5 : 1, pointerEvents: total === 0 ? 'none' : 'auto' }}
                            onClick={handlePay}
                        >
                            <CreditCard size={20} /> Pagar Orden
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <ShieldCheck size={14} /> Pago Seguro 256-bit SSL
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
