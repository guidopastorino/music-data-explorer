import type { SpotifyTrack } from "@/lib/api/spotify";

/**
 * Convierte milisegundos a formato mm:ss
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Calcula el promedio de duración de las canciones
 */
export function calculateAverageDuration(tracks: SpotifyTrack[]): number {
  if (tracks.length === 0) return 0;
  const total = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
  return total / tracks.length;
}

/**
 * Encuentra la canción más larga
 */
export function findLongestTrack(tracks: SpotifyTrack[]): SpotifyTrack | null {
  if (tracks.length === 0) return null;
  return tracks.reduce((longest, track) =>
    track.duration_ms > longest.duration_ms ? track : longest,
  );
}

/**
 * Encuentra la canción más corta
 */
export function findShortestTrack(tracks: SpotifyTrack[]): SpotifyTrack | null {
  if (tracks.length === 0) return null;
  return tracks.reduce((shortest, track) =>
    track.duration_ms < shortest.duration_ms ? track : shortest,
  );
}

/**
 * Calcula el promedio de popularidad
 */
export function calculateAveragePopularity(tracks: SpotifyTrack[]): number {
  if (tracks.length === 0) return 0;
  const total = tracks.reduce((sum, track) => sum + track.popularity, 0);
  return Math.round(total / tracks.length);
}

/**
 * Prepara datos para gráfico de duración
 */
export function prepareDurationChartData(tracks: SpotifyTrack[]) {
  return tracks.map((track) => ({
    name: track.name,
    duration: Math.round(track.duration_ms / 1000), // en segundos
    durationFormatted: formatDuration(track.duration_ms),
    popularity: track.popularity,
  }));
}

/**
 * Prepara datos para gráfico de popularidad
 */
export function preparePopularityChartData(tracks: SpotifyTrack[]) {
  return tracks.map((track) => ({
    name: track.name,
    popularity: track.popularity,
  }));
}

/**
 * Encuentra los artistas más frecuentes en una lista de tracks
 */
export function findMostFrequentArtists(tracks: SpotifyTrack[], limit = 5) {
  const artistCount: Record<string, { name: string; count: number }> = {};

  tracks.forEach((track) => {
    track.artists.forEach((artist) => {
      if (artistCount[artist.id]) {
        artistCount[artist.id].count++;
      } else {
        artistCount[artist.id] = {
          name: artist.name,
          count: 1,
        };
      }
    });
  });

  return Object.values(artistCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

