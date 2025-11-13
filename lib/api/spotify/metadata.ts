import { createSpotifyClient } from "./client";
import { SpotifyEndpoints } from "./endpoints";
import type { SpotifyArtist, SpotifyPlaylist } from "./types";

/**
 * Obtiene datos básicos del artista para metadata
 */
export async function getArtistMetadata(artistId: string): Promise<SpotifyArtist | null> {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("SPOTIFY_ACCESS_TOKEN no está configurado");
      return null;
    }

    if (!artistId || artistId.trim() === "") {
      console.error("Artist ID no válido");
      return null;
    }

    const client = createSpotifyClient(accessToken);
    const endpoints = new SpotifyEndpoints(client.getClient());

    const artist = await endpoints.getArtist(artistId);
    return artist;
  } catch (error) {
    console.error("Error al obtener metadata del artista:", error);
    
    // Manejar AggregateError
    if (error instanceof AggregateError) {
      console.error("AggregateError detectado. Errores:", error.errors);
      const errorMessages = error.errors.map((e) => {
        if (e instanceof Error) return e.message;
        return String(e);
      });
      console.error("Mensajes de error:", errorMessages.join(", "));
    } else if (error instanceof Error) {
      console.error("Detalles del error:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Error desconocido:", String(error));
    }
    
    return null;
  }
}

/**
 * Obtiene datos básicos de la playlist para metadata
 */
export async function getPlaylistMetadata(
  playlistId: string,
): Promise<SpotifyPlaylist | null> {
  try {
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("SPOTIFY_ACCESS_TOKEN no está configurado");
      return null;
    }

    if (!playlistId || playlistId.trim() === "") {
      console.error("Playlist ID no válido");
      return null;
    }

    const client = createSpotifyClient(accessToken);
    const endpoints = new SpotifyEndpoints(client.getClient());

    const playlist = await endpoints.getPlaylist(playlistId);
    return playlist;
  } catch (error) {
    console.error("Error al obtener metadata de la playlist:", error);
    
    // Manejar AggregateError
    if (error instanceof AggregateError) {
      console.error("AggregateError detectado. Errores:", error.errors);
      const errorMessages = error.errors.map((e) => {
        if (e instanceof Error) return e.message;
        return String(e);
      });
      console.error("Mensajes de error:", errorMessages.join(", "));
    } else if (error instanceof Error) {
      console.error("Detalles del error:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Error desconocido:", String(error));
    }
    
    return null;
  }
}

