"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { ArtistHeader } from "@/components/artist/artist-header";
import { TopTracksList } from "@/components/artist/top-tracks-list";
import { InsightsSection } from "@/components/artist/insights-section";
import { ChartsSection } from "@/components/charts/charts-section";
import { FunFactButton } from "@/components/fun-fact/fun-fact-button";
import { ExportButton } from "@/components/export/export-button";
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

interface ArtistPageClientProps {
  artistId: string;
}

export function ArtistPageClient({ artistId }: ArtistPageClientProps) {
  const {
    data,
    isLoading,
    error,
  } = useQuery<ArtistData>({
    queryKey: ["artist", artistId],
    queryFn: () => getArtistData(artistId),
  });

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

        <ChartsSection tracks={topTracks} columns={2} />

        <div className="rounded-lg md:border md:bg-card md:p-6">
          <InsightsSection tracks={topTracks} />
        </div>

        <div className="rounded-lg md:border md:bg-card md:p-6">
          <TopTracksList tracks={topTracks} />
        </div>
      </div>

      <FunFactButton type="artist" id={artistId} name={artist.name} />
      <ExportButton
        type="artist"
        name={artist.name}
        imageUrl={artist.images[0]?.url}
        artist={artist}
        tracks={topTracks}
      />
    </main>
  );
}

