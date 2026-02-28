import { useEffect, useState } from 'react';
import { Download, QrCode, Calendar, MapPin, Ticket, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore, TicketData } from '../store/useStore';

const TICKETS_API = 'http://localhost:3006';

// ─── QR Modal ────────────────────────────────────────────────────────────────
const QRModal = ({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) => {
    const qrValue = `TICKET:${ticket.id}|EVENT:${ticket.event_id}|USER:${ticket.user_id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}&bgcolor=ffffff&color=000000&margin=10`;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="glass-panel animate-fade-in"
                style={{ padding: '2.5rem', maxWidth: '360px', width: '100%', textAlign: 'center', position: 'relative' }}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                    <X size={20} />
                </button>

                <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>Código QR</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Mostrá este código en la entrada del evento
                </p>

                <div style={{
                    background: 'white', padding: '1rem', borderRadius: '12px',
                    display: 'inline-block', marginBottom: '1.5rem'
                }}>
                    <img src={qrUrl} alt="QR Code" width={220} height={220} style={{ display: 'block' }} />
                </div>

                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                    #{ticket.id.split('-')[0].toUpperCase()}
                </div>

                <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    ✅ Este código es único e intransferible
                </p>
            </div>
        </div>
    );
};

// ─── Ticket Card ─────────────────────────────────────────────────────────────
const TicketCard = ({ ticket }: { ticket: TicketData }) => {
    const [qrOpen, setQrOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'ok' | 'error'>('idle');

    const handleDownload = async () => {
        setDownloading(true);
        setDownloadStatus('idle');
        try {
            const res = await fetch(`${TICKETS_API}/tickets/${ticket.id}/download`);
            if (!res.ok) throw new Error('No disponible');
            const { downloadUrl } = await res.json();
            // Open in new tab — browser will trigger native PDF download
            window.open(downloadUrl, '_blank');
            setDownloadStatus('ok');
        } catch {
            setDownloadStatus('error');
        } finally {
            setDownloading(false);
            setTimeout(() => setDownloadStatus('idle'), 3000);
        }
    };

    const statusColors: Record<string, string> = {
        PAID: 'var(--success)', CONFIRMED: 'var(--success)',
        PENDING: 'var(--warning)', CANCELLED: 'var(--error)',
    };
    const statusColor = statusColors[ticket.status?.toUpperCase()] || 'var(--text-secondary)';

    return (
        <>
            {qrOpen && <QRModal ticket={ticket} onClose={() => setQrOpen(false)} />}

            <div className="glass-panel" style={{
                display: 'flex', overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                transition: 'var(--transition)',
                border: '1px solid var(--glass-border)',
            }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
            >
                {/* Left stripe accent */}
                <div style={{
                    width: '6px', minHeight: '100%', flexShrink: 0,
                    background: `linear-gradient(180deg, var(--primary), var(--secondary))`
                }} />

                {/* Event image */}
                <div style={{
                    width: '180px', flexShrink: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1540039155733-d7696d819924?auto=format&fit=crop&w=600&q=80")',
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }} />

                {/* Content */}
                <div style={{ padding: '1.75rem 2rem', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <span style={{
                                display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
                                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                                background: `${statusColor}20`, color: statusColor, marginBottom: '8px'
                            }}>
                                {ticket.status || 'CONFIRMADO'}
                            </span>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
                                Evento #{ticket.event_id}
                            </h3>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>ID del Ticket</p>
                            <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>
                                #{ticket.id.split('-')[0].toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Meta info row */}
                    <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Fecha de Compra</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                                <Calendar size={14} />
                                {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Ubicación</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                                <MapPin size={14} />
                                Estadio Nacional
                            </p>
                        </div>
                        {ticket.seats?.length > 0 && (
                            <div>
                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Asientos</p>
                                <p style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                    {ticket.seats.join(', ')}
                                </p>
                            </div>
                        )}
                        {ticket.total_paid && (
                            <div>
                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Pagado</p>
                                <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                                    ${ticket.total_paid.toLocaleString('es-AR')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Dashed separator (ticket stub style) */}
                    <div style={{
                        borderTop: '1.5px dashed rgba(255,255,255,0.12)',
                        marginBottom: '1.25rem',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', left: '-2rem', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <div style={{ position: 'absolute', right: '-2rem', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Download PDF */}
                        <button
                            className="btn btn-secondary"
                            style={{ gap: '8px', fontSize: '0.85rem', padding: '10px 18px' }}
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            {downloading
                                ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                : downloadStatus === 'ok'
                                    ? <CheckCircle size={16} color="var(--success)" />
                                    : downloadStatus === 'error'
                                        ? <AlertCircle size={16} color="var(--error)" />
                                        : <Download size={16} />
                            }
                            {downloading ? 'Generando...' : downloadStatus === 'ok' ? 'Descargado' : downloadStatus === 'error' ? 'No disponible' : 'Descargar PDF'}
                        </button>

                        {/* Show QR */}
                        <button
                            className="btn"
                            style={{
                                background: 'white', color: 'black',
                                gap: '8px', fontSize: '0.85rem', padding: '10px 18px',
                            }}
                            onClick={() => setQrOpen(true)}
                        >
                            <QrCode size={16} />
                            Ver QR
                        </button>

                        <Ticket size={18} color="var(--text-secondary)" style={{ marginLeft: 'auto' }} />
                    </div>
                </div>
            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const MyTickets = () => {
    const navigate = useNavigate();
    const { myTickets: tickets, fetchMyTickets, ticketsFetched } = useStore();

    useEffect(() => {
        fetchMyTickets();
    }, [fetchMyTickets]);

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>
                ← Volver a Inicio
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                <h2 className="section-title title-glow" style={{ textAlign: 'left', marginBottom: 0, fontSize: '2.2rem' }}>
                    Mis Entradas
                </h2>
                {tickets.length > 0 && (
                    <span className="badge badge-success">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
                )}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Gestioná tus entradas. Presentá el código QR o descargá el PDF en la puerta del evento.
            </p>

            {!ticketsFetched && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                    <p>Cargando tus entradas...</p>
                </div>
            )}

            {ticketsFetched && tickets.length === 0 && (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Ticket size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Todavía no tenés entradas</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Explorá los eventos disponibles y comprá tus primeras entradas.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Explorar Eventos
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {tickets.map((t, idx) => (
                    <TicketCard key={t.id || idx} ticket={t} />
                ))}
            </div>
        </div>
    );
};

export default MyTickets;
