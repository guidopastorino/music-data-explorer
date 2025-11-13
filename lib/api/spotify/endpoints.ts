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
    const response = await this.client.get<SpotifyPlaylist>(`/playlists/${playlistId}`, {
      params: {
        market: "US",
      },
    });
    return response.data;
  }
}

