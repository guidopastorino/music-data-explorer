import type { AxiosInstance } from "axios";
import type {
  SpotifySearchResponse,
  SpotifyArtist,
  SpotifyArtistTopTracksResponse,
  SpotifyPlaylistSearchResponse,
  SpotifyPlaylist,
  SpotifyUnifiedSearchResponse,
} from "./types";

export class SpotifyEndpoints {
  constructor(private client: AxiosInstance) {}

  /**
   * Buscar artistas en Spotify
   */
  async searchArtists(query: string, limit = 20, offset = 0): Promise<SpotifySearchResponse> {
    const response = await this.client.get<SpotifySearchResponse>("/search", {
      params: {
        q: query,
        type: "artist",
        limit,
        offset,
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
  async searchPlaylists(query: string, limit = 20, offset = 0): Promise<SpotifyPlaylistSearchResponse> {
    const response = await this.client.get<SpotifyPlaylistSearchResponse>("/search", {
      params: {
        q: query,
        type: "playlist",
        limit,
        offset,
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

  /**
   * Búsqueda unificada de artistas y playlists
   */
  async searchUnified(query: string, limit = 10): Promise<SpotifyUnifiedSearchResponse> {
    const artistsLimit = Math.ceil(limit / 2);
    const playlistsLimit = Math.floor(limit / 2);

    const [artistsResponse, playlistsResponse] = await Promise.all([
      this.client.get<SpotifySearchResponse>("/search", {
        params: {
          q: query,
          type: "artist",
          limit: artistsLimit,
        },
      }),
      this.client.get<SpotifyPlaylistSearchResponse>("/search", {
        params: {
          q: query,
          type: "playlist",
          limit: playlistsLimit,
        },
      }),
    ]);

    const artists = artistsResponse.data.artists.items;
    const playlists = playlistsResponse.data.playlists.items.filter(
      (p): p is SpotifyPlaylist => p !== null,
    );

    return {
      artists,
      playlists,
      total: artists.length + playlists.length,
    };
  }

  /**
   * Obtener artistas populares
   * Busca artistas usando términos comunes y los ordena por popularidad
   */
  async getPopularArtists(limit = 20): Promise<SpotifyArtist[]> {
    // Buscar artistas populares con términos comunes de búsqueda
    const searchTerms = ["a", "the", "artist", "music", "pop", "rock"];
    const allArtists: SpotifyArtist[] = [];
    const artistIds = new Set<string>();

    for (const term of searchTerms) {
      try {
        const response = await this.searchArtists(term, 20);
        for (const artist of response.artists.items) {
          if (!artistIds.has(artist.id)) {
            artistIds.add(artist.id);
            allArtists.push(artist);
          }
        }
      } catch (error) {
        console.error(`Error buscando con término ${term}:`, error);
        // Continuar con el siguiente término
      }
    }

    // Ordenar por popularidad (mayor primero)
    allArtists.sort((a, b) => b.popularity - a.popularity);

    return allArtists.slice(0, limit);
  }
}

