/**
 * Token Manager para Spotify API
 * Maneja la obtención, caché y renovación automática de access tokens
 */

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOKEN_EXPIRY_BUFFER = 60; // Renovamos 60 segundos antes de que expire

// Cache en memoria para el token
let tokenCache: TokenCache | null = null;
let refreshPromise: Promise<string> | null = null;

/**
 * Obtiene un nuevo access token de Spotify usando client credentials
 */
async function fetchNewToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET deben estar configurados en las variables de entorno",
    );
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authString}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al obtener token de Spotify: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };

    return data.access_token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener token de Spotify: ${error.message}`);
    }
    throw new Error("Error desconocido al obtener token de Spotify");
  }
}

/**
 * Obtiene un access token válido.
 * Si el token está en caché y aún no ha expirado, lo retorna.
 * Si está expirado o no existe, obtiene uno nuevo.
 */
export async function getAccessToken(): Promise<string> {
  // Si hay un refresh en progreso, esperar a que termine
  if (refreshPromise) {
    return refreshPromise;
  }

  // Verificar si tenemos un token válido en caché
  if (tokenCache && Date.now() < tokenCache.expiresAt - TOKEN_EXPIRY_BUFFER * 1000) {
    return tokenCache.accessToken;
  }

  // Si no hay token o está expirado, obtener uno nuevo
  refreshPromise = (async () => {
    try {
      const newToken = await fetchNewToken();
      // Spotify devuelve tokens que expiran en 3600 segundos (1 hora)
      const expiresIn = 3600;

      tokenCache = {
        accessToken: newToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      return newToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Fuerza la renovación del token (útil cuando recibimos un 401)
 */
export async function refreshAccessToken(): Promise<string> {
  // Invalidar el caché actual
  tokenCache = null;

  // Si hay un refresh en progreso, cancelarlo y crear uno nuevo
  if (refreshPromise) {
    refreshPromise = null;
  }

  return getAccessToken();
}

/**
 * Limpia el caché de tokens (útil para testing o logout)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  refreshPromise = null;
}

