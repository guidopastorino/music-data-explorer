"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArtistResults } from "./artist-results";
import type { SpotifySearchResponse } from "@/lib/api/spotify";

async function searchArtists(query: string): Promise<SpotifySearchResponse> {
  const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=10`);
  if (!response.ok) {
    throw new Error("Error al buscar artistas");
  }
  return response.json();
}

export function ArtistSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<SpotifySearchResponse>({
    queryKey: ["search-artists", query],
    queryFn: () => searchArtists(query),
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
            placeholder="Buscar artista (ej: The Beatles, Taylor Swift...)"
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

      {data && <ArtistResults data={data} />}
    </div>
  );
}

