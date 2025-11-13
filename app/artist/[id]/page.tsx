"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { ArtistHeader } from "@/components/artist/artist-header";
import { TopTracksList } from "@/components/artist/top-tracks-list";
import { DurationChart } from "@/components/artist/duration-chart";
import { PopularityChart } from "@/components/artist/popularity-chart";
import { InsightsSection } from "@/components/artist/insights-section";
import type { SpotifyArtist, SpotifyTrack } from "@/lib/api/spotify";

interface ArtistData {
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
}

async function getArtistData(artistId: string): Promise<ArtistData> {
  const response = await fetch(`/api/spotify/artists/${artistId}`);
  if (!response.ok) {
    throw new Error("Error al obtener datos del artista");
  }
  return response.json();
}

export default function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data,
    isLoading,
    error,
  } = useQuery<ArtistData>({
    queryKey: ["artist", id],
    queryFn: () => getArtistData(id),
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando información del artista...</p>
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
              <h2 className="text-xl font-semibold">Error al cargar el artista</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { artist, topTracks } = data;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <ArtistHeader artist={artist} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-lg border bg-card p-6">
              <DurationChart tracks={topTracks} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg border bg-card p-6">
              <PopularityChart tracks={topTracks} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <InsightsSection tracks={topTracks} />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <TopTracksList tracks={topTracks} />
        </div>
      </div>
    </main>
  );
}

