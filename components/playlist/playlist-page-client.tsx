"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { PlaylistHeader } from "@/components/playlist/playlist-header";
import { PlaylistInsights } from "@/components/playlist/playlist-insights";
import { DurationChart } from "@/components/artist/duration-chart";
import { PopularityChart } from "@/components/artist/popularity-chart";
import { TopTracksList } from "@/components/artist/top-tracks-list";
import { FunFactButton } from "@/components/fun-fact/fun-fact-button";
import type { SpotifyPlaylist, SpotifyTrack } from "@/lib/api/spotify";

interface PlaylistData {
  playlist: SpotifyPlaylist & {
    tracks: {
      total: number;
      items: SpotifyTrack[];
    };
  };
}

async function getPlaylistData(playlistId: string): Promise<PlaylistData> {
  const response = await fetch(`/api/spotify/playlists/${playlistId}`);
  if (!response.ok) {
    throw new Error("Error al obtener datos de la playlist");
  }
  return response.json();
}

interface PlaylistPageClientProps {
  playlistId: string;
}

export function PlaylistPageClient({ playlistId }: PlaylistPageClientProps) {
  const {
    data,
    isLoading,
    error,
  } = useQuery<PlaylistData>({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistData(playlistId),
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando información de la playlist...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="size-12 text-destructive" />
            <div>
              <h2 className="text-xl font-semibold">Error al cargar la playlist</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { playlist } = data;
  // Asegurar que tracks.items es SpotifyTrack[] (ya procesado por la API)
  const tracks: SpotifyTrack[] = playlist.tracks.items as SpotifyTrack[];

  // Limitar tracks para los gráficos (mostrar solo los primeros 50 para mejor rendimiento)
  const tracksForCharts = tracks.slice(0, 50);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <PlaylistHeader playlist={playlist} />

        {tracks.length > 0 ? (
          <>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="rounded-lg border bg-card p-6">
                  <DurationChart tracks={tracksForCharts} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-lg border bg-card p-6">
                  <PopularityChart tracks={tracksForCharts} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <PlaylistInsights tracks={tracks} />
            </div>

            <div className="rounded-lg border bg-card p-6">
              <TopTracksList tracks={tracks} />
            </div>
          </>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">Esta playlist no tiene canciones disponibles</p>
          </div>
        )}
      </div>

      <FunFactButton type="playlist" id={playlistId} name={playlist.name} />
    </main>
  );
}

