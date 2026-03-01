import { useNavigate } from 'react-router-dom';

interface StaticInfoPageProps {
    title: string;
}

const getPageContent = (title: string) => {
    switch (title) {
        case 'Términos y Condiciones':
            return `
                <h3>1. Aceptación de los Términos</h3>
                <p>Al acceder y utilizar Ticketera Cloud, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte, no debes utilizar nuestros servicios.</p>
                <div class="divider"></div>
                <h3>2. Uso del Servicio y Prevención de Bots</h3>
                <p>La plataforma emplea un sistema de <strong>Sala de Espera (Waiting Room) protegida y colas virtuales encoladas</strong>. Cualquier intento de evasión, uso de scripts autorizados o scraping resultará en el baneo automático e irreversible de la cuenta y bloqueo de IP.</p>
                <div class="divider"></div>
                <h3>3. Proceso de Compra "Cero Fricción"</h3>
                <p>Las entradas son vendidas de cuenta a cuenta, confirmando la plaza atómicamente en nuestra base de datos NoSQL mediante la SAGA architecture. Tienes <strong>10 minutos</strong> exactos para completar la reserva una vez tus butacas estén retenidas. Superado el tiempo, las entradas vuelven al mercado público automáticamente.</p>
                <div class="divider"></div>
                <h3>4. Responsabilidad</h3>
                <p>Ticketera Cloud actúa únicamente como agente de ventas para los promotores de eventos. No somos responsables por cancelaciones de eventos, cambios de recinto o reembolsos, los cuales están supeditados 100% a las políticas de la organización productora.</p>
            `;
        case 'Políticas de Privacidad':
            return `
                <h3>Protección de tus Datos</h3>
                <p>En Ticketera Cloud nos tomamos muy en serio la seguridad de tu información personal. Todo tu tráfico está cifrado bajo rigurosos estándares de seguridad SSL TSL 1.3.</p>
                <div class="divider"></div>
                <h3>Información que Recopilamos</h3>
                <p>Para gestionar de forma óptima la entrega de tus E-Tickets o envíos a domicilio físicos, recopilamos únicamente los datos mínimos indispensables: nombre completo, E-mail y la dirección residencial si has seleccionado una entrega a puerta. No almacenamos, bajo ningún concepto, información de tus tarjetas bancarias, la cual transita directamente a través de nuestra pasarela de pagos Tokenizada PCI-DSS.</p>
                <div class="divider"></div>
                <h3>Cookies y Seguimiento</h3>
                <p>Utilizamos cookies esenciales para el correcto funcionamiento de las sesiones transaccionales (como mantener seleccionados tus tickets mientras logueas) y cookies analíticas anónimas para mejorar nuestro tiempo de despacho e índices de fricción en la experiencia de usuario.</p>
            `;
        case 'Política de Cookies':
            return `
                <h3>Uso de Cookies en la Plataforma</h3>
                <p>Las cookies son pequeños fragmentos de información descargados en su navegador. Ticketera Cloud las clasifica en tres propósitos:</p>
                <ul>
                    <li style="margin-bottom: 0.5rem"><strong>🔒 Estrictamente necesarias:</strong> Identificadores de sesión JSON Web Token y enrutadores de Sala de Espera. Sin estas cookies, la página simplemente no puede procesar compras (Ej: balanceadores de carga).</li>
                    <li style="margin-bottom: 0.5rem"><strong>⚡ Rendimiento:</strong> AWS X-Ray Datadog Metrics para ayudarnos a detectar el instante exacto en que un servicio está fallando, mejorando su experiencia global.</li>
                    <li><strong>🎯 Funcionales:</strong> Memoria sobre tus preferencias de tema Oscuro/Claro y categorías favoritas.</li>
                </ul>
                <p>Al utilizar este portal en modo de navegación estándar, nos confirmas que permites la descarga de estos artefactos pasivos en tu dispositivo.</p>
            `;
        case 'Política de Devoluciones':
            return `
                <h3>Reintegros y Reembolsos</h3>
                <p>De acuerdo a las normativas de espectáculos públicos locales, <strong>las entradas no están sujetas a devoluciones, cambios ni reembolsos</strong> salvo en las siguientes condiciones extraordinarias:</p>
                <ul>
                    <li style="margin-bottom: 0.5rem">Cancelación íntegra y oficial por parte de la Banda o Productor.</li>
                    <li style="margin-bottom: 0.5rem">Reprogramación de la fecha y el comprador no puede asistir a la nueva ventana estipulada (tiempo de apelación máximo de 7 días).</li>
                </ul>
                <div class="divider"></div>
                <h3>Tickets Secundarios o Reventa</h3>
                <p>El portal no procesa quejas, reclamos o validaciones sobre códigos QR de tickets que no hayan sido adquiridos directamente por la vía oficial del e-commerce. Los tickts son nominados.</p>
            `;
        case 'Centro de Ayuda':
            return `
                <h3>¿Cómo podemos asistirte?</h3>
                <p>Nuestro equipo de soporte humano está a tu disposición en un sistema centralizado de tickets 24/7 (SLA 48hs). Por favor verifica si tu pregunta ya está respondida:</p>
                <div class="glass-panel" style="padding: 1.5rem; margin-top: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">🎟️ ¿Cómo descargo mi E-Ticket?</h4>
                    <p style="font-size: 0.95rem;">Entra al menú principal, navega hacia la sección "Mi Cuenta -> Mis Entradas" y visualiza allí tanto los tickets vigentes como el histórico. Puedes mostrar el código QR directamente desde la pantalla de tu celular en los controles de acceso del estadio.</p>
                </div>
                <div class="glass-panel" style="padding: 1.5rem; margin-top: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">⏱️ Entré a la Fila Mágica, ¿qué ocurre ahora?</h4>
                    <p style="font-size: 0.95rem;">No refresques ni cierres tu navegador. La carga es en tiempo real y nuestro Web-Socket te colocará en la vista de compra conforme se habiliten cupos seguros para asegurar que tu transacción web nunca colapse.</p>
                </div>
            `;
        default:
            return `
                <div style="text-align: center; padding: 3rem 0;">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">🚧</p>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: white;">Página en revisión</h3>
                    <p style="font-size: 1.1rem; line-height: 1.8;">
                        Estamos redactando actualmente el artículo detallado para esta sección.
                    </p>
                </div>
            `;
    }
};

const StaticInfoPage = ({ title }: StaticInfoPageProps) => {
    const navigate = useNavigate();
    const content = getPageContent(title);

    return (
        <div className="animate-fade-in" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
            <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate(-1)}>
                &larr; Volver
            </button>
            <h1 className="title-glow" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2.5rem' }}>
                {title}
            </h1>
            <div className="glass-panel" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
                {/* Los estilos embebidos afectan el HTML inyectado */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                .static-content h3 {
                    color: white;
                    font-size: 1.4rem;
                    margin-bottom: 1rem;
                    margin-top: 2rem;
                }
                .static-content h3:first-child {
                    margin-top: 0;
                }
                .static-content p {
                    margin-bottom: 1rem;
                    line-height: 1.8;
                    font-size: 1.05rem;
                }
                .static-content ul {
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }
                .static-content .divider {
                    height: 1px;
                    background: var(--glass-border);
                    margin: 2rem 0;
                }
                `}} />
                <div className="static-content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Última actualización: Septiembre 2026.
            </div>
        </div>
    );
};

export default StaticInfoPage;
