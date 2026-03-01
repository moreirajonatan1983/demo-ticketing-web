/**
 * cognitoConfig.ts
 *
 * Centraliza la configuración de Amazon Cognito para toda la aplicación.
 * En desarrollo local se usan los valores de .env.local.
 * En producción se inyectan durante el build via las variables VITE_*.
 *
 * Pasos para configurar Cognito con Google:
 * 1. Crear un User Pool en la consola de AWS
 * 2. En "Sign-in experience" → agregar Google como Identity Provider
 * 3. En "App integration" → crear un App Client con Hosted UI
 * 4. Agregar http://localhost:5173/auth/callback como Callback URL
 * 5. Copiar el Client ID y el dominio al .env.local
 */

export const cognitoConfig = {
    domain: import.meta.env.VITE_COGNITO_DOMAIN || '',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    logoutUri: import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin,
    region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
    scopes: ['openid', 'email', 'profile'],
};

/** ¿Cognito está configurado con valores reales? */
export const isCognitoConfigured = (): boolean =>
    !!(cognitoConfig.domain && cognitoConfig.clientId &&
        !cognitoConfig.clientId.includes('REPLACE'));

/**
 * Construye la URL del Cognito Hosted UI para iniciar la autenticación.
 * @param identityProvider - 'Google' | undefined (login normal)
 */
export const buildCognitoAuthUrl = (identityProvider?: 'Google'): string => {
    const params = new URLSearchParams({
        response_type: 'code',                    // Authorization Code + PKCE
        client_id: cognitoConfig.clientId,
        redirect_uri: cognitoConfig.redirectUri,
        scope: cognitoConfig.scopes.join(' '),
        ...(identityProvider && { identity_provider: identityProvider }),
    });

    return `https://${cognitoConfig.domain}/oauth2/authorize?${params.toString()}`;
};

/**
 * Intercambia el authorization code por tokens JWT.
 */
export const exchangeCodeForTokens = async (code: string): Promise<{
    id_token: string;
    access_token: string;
    refresh_token: string;
}> => {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: cognitoConfig.clientId,
        redirect_uri: cognitoConfig.redirectUri,
        code,
    });

    const res = await fetch(`https://${cognitoConfig.domain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Token exchange failed: ${err}`);
    }

    return res.json();
};

/**
 * Decodifica el payload del JWT sin verificar la firma
 * (la verificación real se hace en el backend al validar el token con JWKS).
 */
export const decodeJwtPayload = (token: string): Record<string, any> => {
    try {
        const [, payloadB64] = token.split('.');
        const decoded = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return {};
    }
};

/**
 * Construye la URL de logout del Cognito Hosted UI.
 */
export const buildCognitoLogoutUrl = (): string => {
    const params = new URLSearchParams({
        client_id: cognitoConfig.clientId,
        logout_uri: cognitoConfig.logoutUri,
    });
    return `https://${cognitoConfig.domain}/logout?${params.toString()}`;
};
