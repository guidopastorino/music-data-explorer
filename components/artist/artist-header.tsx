"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users, Music, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotifyArtist } from "@/lib/api/spotify";

interface ArtistHeaderProps {
  artist: SpotifyArtist;
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const imageUrl = artist.images[0]?.url;
  const followers = artist.followers.total.toLocaleString("es-ES");

  return (
    <div className="space-y-6">
      <Link href="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Button>
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative size-48 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-64">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 192px, 256px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Music className="size-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{artist.name}</h1>
              {artist.genres.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {artist.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-5" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
              <Users className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Seguidores</p>
                <p className="text-lg font-semibold">{followers}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
              <TrendingUp className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Popularidad</p>
                <p className="text-lg font-semibold">{artist.popularity}/100</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
              <Music className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Géneros</p>
                <p className="text-lg font-semibold">{artist.genres.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

