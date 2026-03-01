import { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Checkout = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [simulateRejected, setSimulateRejected] = useState(false);

    const {
        checkoutProcessing: isProcessing,
        checkoutConfirmed: isConfirmed,
        checkoutRejected: isRejected,
        checkoutError,
        processCheckout,
        selectedEvent,
        fetchEventDetails,
        resetCheckout,
        setPurchaseExpiresAt
    } = useStore();

    const [cardNumber, setCardNumber] = useState('');

    useEffect(() => {
        if (id) fetchEventDetails(id);
    }, [id, fetchEventDetails]);

    const total = 700.00; // Mock total from 2 tickets of 350
    const totalItems = 2; // Mock

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setPurchaseExpiresAt(null); // Stop global timer
        const method = simulateRejected ? 'REJECTED_CARD' : 'CREDIT_CARD';
        await processCheckout(id || "1", ["G4", "G5"], method);
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 16) val = val.substring(0, 16);
        // Add space every 4 digits
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardNumber(formatted);
    };

    // W-02: Pago rechazado - SAGA ejecutó la compensación (seats liberados)
    if (isRejected) {
        return (
            <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <AlertTriangle size={40} />
                </div>
                <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>Pago Rechazado</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Tu pago no pudo procesarse. Los asientos fueron <strong>liberados automáticamente</strong> por el sistema.
                </p>
                <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', fontSize: '0.9rem', color: '#ef4444' }}>
                    {checkoutError || 'Verificá los datos de tu tarjeta e intentá nuevamente.'}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => { resetCheckout(); navigate(-1); }}>Volver al Evento</button>
                    <button className="btn btn-primary" onClick={() => resetCheckout()}>Reintentar Pago</button>
                </div>
            </div>
        );
    }

    if (isConfirmed) {
        return (
            <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <Mail size={40} />
                </div>
                <h2 className="section-title title-glow" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Orden Procesándose</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Estamos procesando tu pago por <strong>{totalItems} entradas</strong>.
                </p>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', marginBottom: '3rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    La compra se confirmará por correo electrónico una vez validado el pago.
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/mytickets')}>
                    Ir a Mis Entradas
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
                &larr; Volver a Entrega
            </button>

            <h2 className="section-title title-glow" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '2rem' }}>Pago Seguro</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>

                {/* Left Col - Payment Form */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700' }}>Información de Pago</h3>

                    <form onSubmit={handlePay}>
                        <div className="form-group">
                            <label className="form-label">Titular de la Tarjeta</label>
                            <input type="text" required className="form-input" placeholder="Nombre completo" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Número de Tarjeta (Mock)</label>
                            <div style={{ position: 'relative' }}>
                                <CreditCard size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="•••• •••• •••• ••••"
                                    style={{ paddingLeft: '44px' }}
                                    value={cardNumber}
                                    onChange={handleCardChange}
                                    maxLength={19}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Vencimiento</label>
                                <input type="text" required className="form-input" placeholder="MM/AA" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">CVV</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                    <input type="password" required className="form-input" placeholder="•••" style={{ paddingLeft: '44px' }} maxLength={4} />
                                </div>
                            </div>
                        </div>

                        {/* Simulate rejected card toggle (W-05) */}
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span>🧪 Simular pago rechazado (SAGA test)</span>
                            <input type="checkbox" checked={simulateRejected} onChange={e => setSimulateRejected(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={isProcessing}
                        >
                            {isProcessing ? '⏳ Procesando SAGA...' : simulateRejected ? '🧪 Pagar (Simular Rechazo)' : 'Confirmar y Pagar Orden'}
                        </button>
                    </form>
                </div>

                {/* Right Col - Summary */}
                <div>
                    <div className="summary-panel glass-panel">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700' }}>Resumen de Compra</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold' }}>{selectedEvent?.title || "Evento"}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sector: VIP Front Stage</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fila G - Asientos 4, 5</div>
                        </div>

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
