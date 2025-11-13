"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users, Music, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              alt={playlist.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 192px, 256px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ListMusic className="size-16 text-muted-foreground" />
            </div>
          )}
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
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-5" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {playlist.followers && (
              <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
                <Users className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                  <p className="text-lg font-semibold">{followersFormatted}</p>
                </div>
              </div>
            )}
            {playlist.tracks && (
              <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
                <Music className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Canciones</p>
                  <p className="text-lg font-semibold">{trackCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

