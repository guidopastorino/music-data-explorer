import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, refreshAccessToken } from "./token-manager";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export class SpotifyClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
      timeout: 10000, // 10 segundos de timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor de request: agrega el token actual antes de cada petición
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Interceptor de response: maneja errores y refresh automático de token
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Si es un error 401 (token expirado), intentar refrescar el token
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Si ya hay un refresh en progreso, esperar a que termine
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                // Reintentar la petición original con el nuevo token
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Obtener un nuevo token
            const newToken = await refreshAccessToken();

            // Actualizar el token en el header de la petición original
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Procesar la cola de peticiones fallidas
            this.processQueue(null);

            // Reintentar la petición original con el nuevo token
            return this.client(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, rechazar todas las peticiones en cola
            this.processQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Manejar otros tipos de errores
        if (error.code === "ECONNABORTED") {
          console.error("Spotify API: Timeout - La petición tardó demasiado");
        } else if (error.response?.status === 404) {
          // 404 puede ser normal para algunos endpoints que requieren autenticación de usuario
          // Solo loguear en desarrollo o si es crítico
          if (process.env.NODE_ENV === "development") {
            console.warn("Spotify API: Not Found - El recurso no existe (puede requerir autenticación de usuario)");
          }
        } else if (error.response?.status && error.response.status >= 500) {
          console.error("Spotify API: Server Error - Error del servidor de Spotify");
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: unknown): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

// Factory function para crear el cliente (ahora sin necesidad de pasar token)
export function createSpotifyClient(): SpotifyClient {
  return new SpotifyClient();
}