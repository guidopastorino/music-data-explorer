"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Music, TrendingUp } from "lucide-react";
import { SpotifyIcon } from "@/components/ui/spotify-icon";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { SpotifyArtist } from "@/lib/api/spotify";

interface ArtistHeaderProps {
  artist: SpotifyArtist;
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const imageUrl = artist.images[0]?.url;
  const followers = artist.followers.total.toLocaleString("es-ES");

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{artist.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative mx-auto size-48 shrink-0 sm:mx-0 sm:size-64">
          <div className="relative size-full overflow-hidden rounded-full bg-muted sm:rounded-lg">
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
          <a
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 left-1/2 flex size-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-black shadow-lg transition-transform hover:scale-110 sm:bottom-auto sm:left-auto sm:right-2 sm:top-2 sm:translate-x-0 sm:translate-y-0 sm:size-10"
            aria-label="Abrir en Spotify"
          >
            <SpotifyIcon size={20} className="text-[#1DB954]" />
          </a>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-3xl font-bold text-center sm:text-left sm:text-4xl">{artist.name}</h1>
              {artist.genres.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Seguidores</p>
                <p className="text-xl font-semibold">{followers}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Popularidad</p>
                <p className="text-xl font-semibold">{artist.popularity}/100</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Music className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Géneros</p>
                <p className="text-xl font-semibold">{artist.genres.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

