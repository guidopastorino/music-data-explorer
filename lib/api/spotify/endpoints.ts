import type { AxiosInstance } from "axios";
import type {
  SpotifySearchResponse,
  SpotifyArtist,
  SpotifyArtistTopTracksResponse,
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
    const response = await this.client.get<SpotifyArtist>(`/artists/${artistId}`);
    return response.data;
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
}

