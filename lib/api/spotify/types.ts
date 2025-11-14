// Spotify API Types

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
  };
}

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyArtistTopTracksResponse {
  tracks: SpotifyTrack[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: {
    display_name: string;
    id: string;
  };
  followers?: {
    total: number;
  };
  public?: boolean;
  tracks?: {
    total: number;
    items: Array<{
      track: SpotifyTrack | null;
    }>;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylistSearchResponse {
  playlists: {
    items: (SpotifyPlaylist | null)[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export interface SpotifyUnifiedSearchResponse {
  artists: SpotifyArtist[];
  playlists: SpotifyPlaylist[];
  total: number;
}

