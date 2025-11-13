"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Users, Music } from "lucide-react";
import type { SpotifySearchResponse, SpotifyArtist } from "@/lib/api/spotify";

interface ArtistResultsProps {
  data: SpotifySearchResponse;
}

function ArtistCard({ artist }: { artist: SpotifyArtist }) {
  const imageUrl = artist.images[0]?.url;
  const followers = artist.followers.total.toLocaleString("es-ES");

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group block w-full border-b border-border/50 bg-card px-4 py-4 transition-all hover:bg-accent/50 sm:px-6 sm:py-5 lg:px-8 last:border-b-0"
    >
      <div className="flex gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted transition-transform group-hover:scale-105">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Music className="size-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
                {artist.name}
              </h3>
              {artist.genres.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {artist.genres.slice(0, 2).join(", ")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(artist.external_urls.spotify, "_blank", "noopener,noreferrer");
              }}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              aria-label="Abrir en Spotify"
            >
              <ExternalLink className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{followers} seguidores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Music className="size-4" />
              <span>Popularidad: {artist.popularity}/100</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArtistResults({ data }: ArtistResultsProps) {
  const artists = data.artists.items;

  if (artists.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No se encontraron artistas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h2 className="text-xl font-semibold">
          Resultados ({data.artists.total})
        </h2>
      </div>
      <div className="grid gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

