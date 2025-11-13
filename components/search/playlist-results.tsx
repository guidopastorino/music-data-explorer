"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Users, Music, ListMusic } from "lucide-react";
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
    <Link
      href={`/playlist/${playlist.id}`}
      className="group block rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="flex gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted transition-transform group-hover:scale-105">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={playlist.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ListMusic className="size-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
                {playlist.name}
              </h3>
              {playlist.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {playlist.description}
                </p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Por {playlist.owner.display_name}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(playlist.external_urls.spotify, "_blank", "noopener,noreferrer");
              }}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
              aria-label="Abrir en Spotify"
            >
              <ExternalLink className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {playlist.followers && (
              <div className="flex items-center gap-1.5">
                <Users className="size-4" />
                <span>{followersFormatted} seguidores</span>
              </div>
            )}
            {playlist.tracks && (
              <div className="flex items-center gap-1.5">
                <Music className="size-4" />
                <span>{trackCount} canciones</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
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

