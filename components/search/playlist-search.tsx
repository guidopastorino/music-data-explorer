"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaylistResults } from "./playlist-results";
import type { SpotifyPlaylistSearchResponse } from "@/lib/api/spotify";

async function searchPlaylists(query: string): Promise<SpotifyPlaylistSearchResponse> {
  const response = await fetch(
    `/api/spotify/search/playlists?q=${encodeURIComponent(query)}&limit=10`,
  );
  if (!response.ok) {
    throw new Error("Error al buscar playlists");
  }
  return response.json();
}

export function PlaylistSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");

  const {
    data,
    isLoading,
    error,
  } = useQuery<SpotifyPlaylistSearchResponse>({
    queryKey: ["search-playlists", query],
    queryFn: () => searchPlaylists(query),
    enabled: query.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setQuery(searchQuery.trim());
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar playlist (ej: Top 50 Global, Chill Hits...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading || searchQuery.trim().length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </Button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          Error al buscar: {error instanceof Error ? error.message : "Error desconocido"}
        </div>
      )}

      {data && <PlaylistResults data={data} />}
    </div>
  );
}

