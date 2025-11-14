"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Music, ListMusic } from "lucide-react";
import { SpotifyIcon } from "@/components/spotify-icon";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { SpotifyPlaylist } from "@/lib/api/spotify";

interface PlaylistHeaderProps {
  playlist: SpotifyPlaylist;
}

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  const imageUrl = playlist.images[0]?.url;
  const followers = playlist.followers?.total ?? 0;
  const followersFormatted = followers.toLocaleString("es-ES");
  const trackCount = playlist.tracks?.total ?? 0;

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
            <BreadcrumbPage>{playlist.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative mx-auto aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:mx-0 sm:size-64">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={playlist.name}
              fill
              className="object-contain sm:object-cover"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ListMusic className="size-16 text-muted-foreground" />
            </div>
          )}
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 top-2 flex size-10 items-center justify-center rounded-full bg-black shadow-lg transition-transform hover:scale-110"
            aria-label="Abrir en Spotify"
          >
            <SpotifyIcon size={20} className="text-[#1DB954]" />
          </a>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{playlist.name}</h1>
              {playlist.description && (
                <p className="mt-2 text-muted-foreground">{playlist.description}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Por {playlist.owner.display_name}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {playlist.followers && (
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                  <p className="text-xl font-semibold">{followersFormatted}</p>
                </div>
              </div>
            )}
            {playlist.tracks && (
              <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Music className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Canciones</p>
                  <p className="text-xl font-semibold">{trackCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

