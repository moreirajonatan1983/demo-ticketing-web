import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForTokens, decodeJwtPayload } from '../auth/cognitoConfig';
import { useStore } from '../store/useStore';

/**
 * AuthCallback — Maneja el redirect de Cognito Hosted UI.
 *
 * Cognito redirige aquí con: /auth/callback?code=AUTHORIZATION_CODE
 * 1. Extraemos el `code` de la URL
 * 2. Lo intercambiamos por tokens JWT en el endpoint /oauth2/token de Cognito
 * 3. Decodificamos el id_token para obtener email y nombre
 * 4. Guardamos la sesión en el store de Zustand
 * 5. Redirigimos al destino original (o a Home)
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const { loginWithCognito } = useStore();
    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const error = params.get('error');
            const errorDescription = params.get('error_description');

            if (error) {
                setErrorMsg(errorDescription || error);
                setStatus('error');
                return;
            }

            if (!code) {
                setErrorMsg('No se recibió el código de autorización.');
                setStatus('error');
                return;
            }

            try {
                const tokens = await exchangeCodeForTokens(code);

                // Decodificar el id_token para obtener datos del usuario
                const payload = decodeJwtPayload(tokens.id_token);
                const email: string = payload.email || '';
                const name: string = payload.name || payload['cognito:username'] || email.split('@')[0];
                const sub: string = payload.sub || '';

                // Guardar tokens de forma segura
                sessionStorage.setItem('id_token', tokens.id_token);
                sessionStorage.setItem('access_token', tokens.access_token);
                if (tokens.refresh_token) {
                    localStorage.setItem('refresh_token', tokens.refresh_token);
                }

                // Actualizar el store con la sesión Cognito
                loginWithCognito({ id: sub, name, email, idToken: tokens.id_token });

                // Redirigir al destino guardado antes del login (o Home)
                const returnTo = sessionStorage.getItem('auth_return_to') || '/';
                sessionStorage.removeItem('auth_return_to');
                navigate(returnTo, { replace: true });

            } catch (err) {
                console.error('[Auth] Error en callback de Cognito:', err);
                setErrorMsg('Error al procesar el inicio de sesión. Por favor intentá de nuevo.');
                setStatus('error');
            }
        };

        handleCallback();
    }, []);

    if (status === 'error') {
        return (
            <div style={{
                minHeight: '60vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem' }}>❌</div>
                <h2 style={{ color: 'var(--error)' }}>Error al iniciar sesión</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>{errorMsg}</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Volver al login
                </button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '60vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1.5rem'
        }}>
            {/* Spinner */}
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--primary)',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: 'var(--text-secondary)' }}>Verificando tu cuenta con Google...</p>
        </div>
    );
};

export default AuthCallback;
