"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, Music, Users, TrendingUp } from "lucide-react";
import type { SpotifyArtist } from "@/lib/api/spotify";

interface PopularArtistsResponse {
  artists: SpotifyArtist[];
}

async function getPopularArtists(): Promise<PopularArtistsResponse> {
  const response = await fetch("/api/spotify/popular-artists?limit=12");
  if (!response.ok) {
    throw new Error("Error al obtener artistas populares");
  }
  return response.json();
}

function ArtistCard({ artist }: { artist: SpotifyArtist }) {
  const imageUrl = artist.images[0]?.url;
  const followers = artist.followers.total.toLocaleString("es-ES");

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group flex flex-col items-center rounded-xl border bg-card p-3 sm:p-4 md:p-5 lg:p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 overflow-hidden rounded-full bg-muted transition-transform duration-300 group-hover:scale-110 ring-2 ring-border group-hover:ring-primary/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Music className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3 sm:mt-4 md:mt-5 space-y-1.5 sm:space-y-2 w-full">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {artist.name}
        </h3>
        {artist.genres.length > 0 && (
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 capitalize">
            {artist.genres[0]}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="font-medium">{followers}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="font-medium">{artist.popularity}/100</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PopularArtistsSection() {
  const {
    data,
    isLoading,
    error,
  } = useQuery<PopularArtistsResponse>({
    queryKey: ["popular-artists"],
    queryFn: getPopularArtists,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-2xl font-bold">Artistas Más Populares</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <h2 className="mb-6 text-2xl font-bold">Artistas Más Populares</h2>
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <AlertCircle className="size-12 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Error al cargar artistas populares</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const artists = data?.artists || [];

  if (artists.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Artistas Más Populares</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Descubre los artistas más populares del momento
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

