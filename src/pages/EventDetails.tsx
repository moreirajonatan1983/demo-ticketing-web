import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem', background: 'transparent', color: 'var(--ma-cyan)', border: 'none', padding: 0 }} onClick={() => navigate('/')}>
                &larr; Volver
            </button>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>El ultimo regreso tour</p>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2rem' }}>Ricardo Montaner</h1>

            <div className="event-hero">
                <div className="event-hero-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-d7696d819924?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')` }}>
                    <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '2rem' }}>
                        {/* Logos mockup */}
                        <div style={{ width: 80, height: 30, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}></div>
                        <div style={{ width: 100, height: 30, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}></div>
                    </div>
                </div>

                <div className="event-hero-sidebar">
                    <div className="event-hero-price">
                        <h3>Entradas desde</h3>
                        <span className="price">$ 70.000</span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Date 1 */}
                        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ border: '1px solid var(--ma-cyan)', borderRadius: '4px', padding: '8px 16px', textAlign: 'center', minWidth: '80px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>08</div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Marzo</div>
                            </div>
                            <div style={{ flex: 1, padding: '0 1.5rem' }}>
                                <p style={{ fontSize: '0.7rem', color: '#ff3b30', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Horarios</p>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div><span style={{ fontWeight: 'bold' }}>19:00 hs</span><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Puertas</span></div>
                                    <div><span style={{ fontWeight: 'bold' }}>21:00 hs</span><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show</span></div>
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate('/event/1/date/1/sectors')}>Comprar</button>
                        </div>

                        {/* Date 2 */}
                        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ border: '1px solid var(--ma-cyan)', borderRadius: '4px', padding: '8px 16px', textAlign: 'center', minWidth: '80px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>27</div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Febrero</div>
                            </div>
                            <div style={{ flex: 1, padding: '0 1.5rem' }}>
                                <p style={{ fontSize: '0.7rem', color: '#ff3b30', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Horarios</p>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <div><span style={{ fontWeight: 'bold' }}>19:00 hs</span><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Puertas</span></div>
                                    <div><span style={{ fontWeight: 'bold' }}>21:00 hs</span><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show</span></div>
                                </div>
                            </div>
                            <button className="btn" style={{ background: '#ccc', color: '#666', cursor: 'not-allowed' }}>Agotado</button>
                        </div>

                        {/* Accordions */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--ma-green)" /> Medios de pago</span>
                                <ChevronDown size={18} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', cursor: 'pointer' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--ma-green)" /> Estacionamiento</span>
                                <ChevronDown size={18} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div style={{ background: 'linear-gradient(to right, #cf4984, #e67657)', padding: '1rem 2rem', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '-10px', position: 'relative', zIndex: -1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '600' }}><Calendar size={20} /> Faltan</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem' }}>
                    <span><strong style={{ fontSize: '1.5rem' }}>9</strong> Días |</span>
                    <span><strong style={{ fontSize: '1.5rem' }}>0</strong> Horas |</span>
                    <span><strong style={{ fontSize: '1.5rem' }}>41</strong> Minutos |</span>
                    <span><strong style={{ fontSize: '1.5rem' }}>15</strong> Segundos</span>
                </div>
            </div>

            <h2 style={{ color: 'var(--ma-cyan)', fontSize: '2.5rem', fontWeight: '800', marginTop: '4rem', marginBottom: '2rem' }}>Acerca del evento</h2>
        </div>
    );
};

export default EventDetails;
