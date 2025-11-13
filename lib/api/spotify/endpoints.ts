import type { AxiosInstance } from "axios";
import type {
  SpotifySearchResponse,
  SpotifyArtist,
  SpotifyArtistTopTracksResponse,
  SpotifyPlaylistSearchResponse,
  SpotifyPlaylist,
} from "./types";

export class SpotifyEndpoints {
  constructor(private client: AxiosInstance) {}

  /**
   * Buscar artistas en Spotify
   */
  async searchArtists(query: string, limit = 20): Promise<SpotifySearchResponse> {
    const response = await this.client.get<SpotifySearchResponse>("/search", {
      params: {
        q: query,
        type: "artist",
        limit,
      },
    });
    return response.data;
  }

  /**
   * Obtener información de un artista por ID
   */
  async getArtist(artistId: string): Promise<SpotifyArtist> {
    try {
      const response = await this.client.get<SpotifyArtist>(`/artists/${artistId}`);
      return response.data;
    } catch (error) {
      // Manejar AggregateError
      if (error instanceof AggregateError) {
        const errors = error.errors || [];
        const errorMessages = errors.map((e) => {
          if (e instanceof Error) return e.message;
          return String(e);
        });
        throw new Error(
          `Error al obtener artista (AggregateError): ${errorMessages.join(", ")}`,
        );
      }

      // Manejar errores de Axios
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
          message?: string;
        };
        const status = axiosError.response?.status;
        const statusText = axiosError.response?.statusText;
        const data = axiosError.response?.data;
        throw new Error(
          `Error al obtener artista: ${status ?? "Unknown"} ${statusText ?? ""} - ${JSON.stringify(data ?? {})}`,
        );
      }

      // Manejar otros errores
      if (error instanceof Error) {
        throw new Error(`Error al obtener artista: ${error.message}`);
      }

      throw new Error(`Error desconocido al obtener artista: ${String(error)}`);
    }
  }

  /**
   * Obtener top tracks de un artista
   */
  async getArtistTopTracks(
    artistId: string,
    market = "US",
  ): Promise<SpotifyArtistTopTracksResponse> {
    const response = await this.client.get<SpotifyArtistTopTracksResponse>(
      `/artists/${artistId}/top-tracks`,
      {
        params: {
          market,
        },
      },
    );
    return response.data;
  }

  /**
   * Buscar playlists en Spotify
   */
  async searchPlaylists(query: string, limit = 20): Promise<SpotifyPlaylistSearchResponse> {
    const response = await this.client.get<SpotifyPlaylistSearchResponse>("/search", {
      params: {
        q: query,
        type: "playlist",
        limit,
      },
    });
    return response.data;
  }

  /**
   * Obtener información de una playlist por ID
   */
  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    try {
      const response = await this.client.get<SpotifyPlaylist>(`/playlists/${playlistId}`, {
        params: {
          market: "US",
        },
      });
      return response.data;
    } catch (error) {
      // Manejar AggregateError
      if (error instanceof AggregateError) {
        const errors = error.errors || [];
        const errorMessages = errors.map((e) => {
          if (e instanceof Error) return e.message;
          return String(e);
        });
        throw new Error(
          `Error al obtener playlist (AggregateError): ${errorMessages.join(", ")}`,
        );
      }

      // Manejar errores de Axios
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
          message?: string;
        };
        const status = axiosError.response?.status;
        const statusText = axiosError.response?.statusText;
        const data = axiosError.response?.data;
        throw new Error(
          `Error al obtener playlist: ${status ?? "Unknown"} ${statusText ?? ""} - ${JSON.stringify(data ?? {})}`,
        );
      }

      // Manejar otros errores
      if (error instanceof Error) {
        throw new Error(`Error al obtener playlist: ${error.message}`);
      }

      throw new Error(`Error desconocido al obtener playlist: ${String(error)}`);
    }
  }
}

