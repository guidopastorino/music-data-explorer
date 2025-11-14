"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ListMusic, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpotifyArtist, SpotifyPlaylist } from "@/lib/api/spotify";

interface SearchResultItemProps {
  type: "artist" | "playlist";
  artist?: SpotifyArtist;
  playlist?: SpotifyPlaylist;
  onClick: () => void;
  isSelected?: boolean;
}

export const SearchResultItem = React.forwardRef<HTMLAnchorElement, SearchResultItemProps>(
  ({ type, artist, playlist, onClick, isSelected = false }, ref) => {
    const data = type === "artist" ? artist : playlist;
    if (!data) return null;

    const imageUrl = type === "artist" ? artist!.images[0]?.url : playlist!.images[0]?.url;
    const href = type === "artist" ? `/artist/${artist!.id}` : `/playlist/${playlist!.id}`;
    const icon = type === "artist" ? User : ListMusic;
    const Icon = icon;

    return (
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer",
          isSelected 
            ? "bg-primary/15 border-2 border-primary/30 shadow-sm" 
            : "hover:bg-accent/60 active:scale-[0.98] border-2 border-transparent"
        )}
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/50 shadow-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={data.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Icon className="size-7 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-base truncate mb-0.5",
            isSelected && "text-primary"
          )}>
            {data.name}
          </p>
          {type === "artist" && artist!.genres.length > 0 && (
            <p className="text-xs text-muted-foreground truncate">
              {artist!.genres.slice(0, 2).join(", ")}
            </p>
          )}
          {type === "playlist" && playlist!.owner && (
            <p className="text-xs text-muted-foreground truncate">
              Por {playlist!.owner.display_name}
            </p>
          )}
        </div>
        {type === "artist" && (
          <div className="shrink-0 p-2 rounded-lg bg-muted/50">
            <Music className="size-4 text-muted-foreground" />
          </div>
        )}
      </Link>
    );
  }
);

SearchResultItem.displayName = "SearchResultItem";

