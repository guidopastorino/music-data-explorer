import axios, { type AxiosInstance } from "axios";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export class SpotifyClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("Spotify API: Unauthorized - Token may be expired");
        }
        return Promise.reject(error);
      },
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  updateAccessToken(newToken: string): void {
    this.accessToken = newToken;
    this.client.defaults.headers.Authorization = `Bearer ${newToken}`;
  }
}

// Factory function para crear el cliente
export function createSpotifyClient(accessToken: string): SpotifyClient {
  return new SpotifyClient(accessToken);
}

