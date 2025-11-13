"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Users, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotifySearchResponse, SpotifyArtist } from "@/lib/api/spotify";

interface ArtistResultsProps {
  data: SpotifySearchResponse;
}

function ArtistCard({ artist }: { artist: SpotifyArtist }) {
  const imageUrl = artist.images[0]?.url;
  const followers = artist.followers.total.toLocaleString("es-ES");

  return (
    <div className="group rounded-lg border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Music className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg">{artist.name}</h3>
              {artist.genres.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {artist.genres.slice(0, 2).join(", ")}
                </p>
              )}
            </div>
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{followers} seguidores</span>
            </div>
            <div className="flex items-center gap-1">
              <Music className="size-4" />
              <span>Popularidad: {artist.popularity}/100</span>
            </div>
          </div>

          <Link href={`/artist/${artist.id}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados ({data.artists.total})
        </h2>
      </div>
      <div className="grid gap-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

