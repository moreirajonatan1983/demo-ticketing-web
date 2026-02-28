
import { CreditCard, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Checkout = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { checkoutProcessing: isProcessing, checkoutConfirmed: isConfirmed, processCheckout } = useStore();

    const total = 700.00; // Mock total from 2 tickets of 350
    const totalItems = 2; // Mock

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        // Fire Redux / Zustand action
        await processCheckout(id || "1", ["G4", "G5"]);
    };

    if (isConfirmed) {
        return (
            <div className="animate-fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <Mail size={40} />
                </div>
                <h2 className="section-title title-glow" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Solicitud Recibida</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Tu solicitud de compra por <strong>{totalItems} entradas</strong> está siendo procesada de forma segura por nuestros servidores.
                </p>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', marginBottom: '3rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Recibirás un correo electrónico de confirmación con tus entradas en formato digital cuando el pago y la reserva se completen exitosamente.
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
                                <input type="text" required className="form-input" placeholder="•••• •••• •••• ••••" style={{ paddingLeft: '44px' }} />
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

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Procesando Transacción...' : 'Confirmar y Pagar Orden'}
                        </button>
                    </form>
                </div>

                {/* Right Col - Summary */}
                <div>
                    <div className="summary-panel glass-panel">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '700' }}>Resumen de Compra</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold' }}>COLDPLAY - Music of the Spheres</div>
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
