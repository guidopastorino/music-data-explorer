"use client";

import Image from "next/image";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";
import type { SpotifyTrack } from "@/lib/api/spotify";
import { formatDuration } from "@/lib/utils/data-processing";

interface TopTracksListProps {
  tracks: SpotifyTrack[];
}

export function TopTracksList({ tracks }: TopTracksListProps) {
  if (tracks.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No hay canciones disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Top Canciones</h3>
        <p className="text-sm text-muted-foreground">
          Las canciones más populares del artista
        </p>
      </div>
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const albumImage = track.album.images[0]?.url;
          // Usar combinación de id e index para keys únicas (las playlists pueden tener canciones duplicadas)
          const uniqueKey = `${track.id}-${index}`;

          return (
            <div
              key={uniqueKey}
              className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted font-bold">
                {index + 1}
              </div>

              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {albumImage ? (
                  <Image
                    src={albumImage}
                    alt={track.album.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <TrendingUp className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="truncate font-semibold">{track.name}</h4>
                <p className="truncate text-sm text-muted-foreground">
                  {track.artists.map((a) => a.name).join(", ")} • {track.album.name}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{formatDuration(track.duration_ms)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4" />
                  <span>{track.popularity}</span>
                </div>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

