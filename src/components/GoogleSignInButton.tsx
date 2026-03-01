import { buildCognitoAuthUrl, isCognitoConfigured } from '../auth/cognitoConfig';

interface GoogleSignInButtonProps {
    label?: string;
    returnTo?: string;
}

/**
 * GoogleSignInButton — Botón de "Continuar con Google".
 *
 * En MODO REAL (Cognito configurado): redirige al Cognito Hosted UI con Google.
 * En MODO DEV (sin config): simula el flujo mostrando un aviso en consola.
 */
const GoogleSignInButton = ({ label = 'Continuar con Google', returnTo }: GoogleSignInButtonProps) => {

    const handleGoogleLogin = () => {
        // Guardar la ruta de retorno antes de salir a Cognito
        if (returnTo) {
            sessionStorage.setItem('auth_return_to', returnTo);
        }

        if (isCognitoConfigured()) {
            // Modo real: redirigir al Hosted UI de Cognito
            window.location.href = buildCognitoAuthUrl('Google');
        } else {
            // Modo dev: aviso en consola, sin redirigir
            console.info(
                '[DEV] Cognito no configurado.\n' +
                'Configura VITE_COGNITO_DOMAIN y VITE_COGNITO_CLIENT_ID en .env.local\n' +
                'para activar el login real con Google.'
            );
            alert(
                '⚙️ Cognito no configurado\n\n' +
                'Para activar el login con Google, completá las variables\n' +
                'VITE_COGNITO_DOMAIN y VITE_COGNITO_CLIENT_ID en .env.local\n\n' +
                'Ver .env.example para más instrucciones.'
            );
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '13px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.11)';
                el.style.borderColor = 'rgba(255,255,255,0.35)';
                el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.06)';
                el.style.borderColor = 'rgba(255,255,255,0.18)';
                el.style.transform = 'translateY(0)';
            }}
        >
            {/* Google "G" SVG oficial */}
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.2-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.1C9.5 35.6 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2C41.8 35 44 30 44 24c0-1.2-.1-2.2-.4-3.5z" />
            </svg>
            {label}
        </button>
    );
};

export default GoogleSignInButton;
