"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";
import type { SpotifyTrack } from "@/lib/api/spotify";
import { formatDuration } from "@/lib/utils/data-processing";

interface TopTracksListProps {
  tracks: SpotifyTrack[];
  context?: "artist" | "playlist";
}

export function TopTracksList({ tracks, context = "artist" }: TopTracksListProps) {
  if (tracks.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No hay canciones disponibles</p>
      </div>
    );
  }

  const descriptionText = context === "playlist" 
    ? "Las canciones más populares de la playlist"
    : "Las canciones más populares del artista";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Top Canciones</h3>
        <p className="text-sm text-muted-foreground">
          {descriptionText}
        </p>
      </div>
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const albumImage = track.album.images[0]?.url;
          // Usar combinación de id e index para keys únicas (las playlists pueden tener canciones duplicadas)
          const uniqueKey = `${track.id}-${index}`;

          return (
            <TrackImage
              key={uniqueKey}
              track={track}
              index={index}
              albumImage={albumImage}
            />
          );
        })}
      </div>
    </div>
  );
}

function TrackImage({
  track,
  index,
  albumImage,
}: {
  track: SpotifyTrack;
  index: number;
  albumImage?: string;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card p-3 sm:gap-4 sm:p-4 transition-all hover:shadow-md">
      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-semibold sm:size-12 sm:rounded-lg sm:text-base">
        {index + 1}
      </div>

      <div className="relative size-12 shrink-0 overflow-hidden rounded bg-muted sm:size-16 sm:rounded-lg">
        {albumImage && !imageError ? (
          <Image
            src={albumImage}
            alt={track.album.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 48px, 64px"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <TrendingUp className="size-4 text-muted-foreground sm:size-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="truncate text-sm font-semibold sm:text-base">{track.name}</h4>
        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          {track.artists.map((a) => a.name).join(", ")}
          <span className="hidden sm:inline"> • {track.album.name}</span>
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
          <Clock className="size-3 sm:size-4" />
          <span>{formatDuration(track.duration_ms)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:gap-2 sm:text-sm">
          <TrendingUp className="size-3 sm:size-4" />
          <span>{track.popularity}</span>
        </div>
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Abrir en Spotify"
        >
          <ExternalLink className="size-3 sm:size-4" />
        </a>
      </div>
    </div>
  );
}
