"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Users, Music, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotifyPlaylistSearchResponse, SpotifyPlaylist } from "@/lib/api/spotify";

interface PlaylistResultsProps {
  data: SpotifyPlaylistSearchResponse;
}

function PlaylistCard({ playlist }: { playlist: SpotifyPlaylist }) {
  const imageUrl = playlist.images[0]?.url;
  const followers = playlist.followers?.total ?? 0;
  const followersFormatted = followers.toLocaleString("es-ES");
  const trackCount = playlist.tracks?.total ?? 0;

  return (
    <div className="group rounded-lg border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={playlist.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ListMusic className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg">{playlist.name}</h3>
              {playlist.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {playlist.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Por {playlist.owner.display_name}
              </p>
            </div>
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {playlist.followers && (
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>{followersFormatted} seguidores</span>
              </div>
            )}
            {playlist.tracks && (
              <div className="flex items-center gap-1">
                <Music className="size-4" />
                <span>{trackCount} canciones</span>
              </div>
            )}
          </div>

          <Link href={`/playlist/${playlist.id}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              Ver análisis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PlaylistResults({ data }: PlaylistResultsProps) {
  // Filtrar elementos null que pueden venir de la API de Spotify
  const playlists = data.playlists.items.filter(
    (playlist): playlist is SpotifyPlaylist => playlist !== null,
  );

  if (playlists.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No se encontraron playlists</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados ({data.playlists.total})
        </h2>
      </div>
      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}

