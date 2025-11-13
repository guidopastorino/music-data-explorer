"use client";

import { useState } from "react";
import { Music, TrendingUp, BarChart3, User, ListMusic } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArtistSearch } from "@/components/search/artist-search";
import { PlaylistSearch } from "@/components/search/playlist-search";
import { Button } from "@/components/ui/button";

type SearchType = "artist" | "playlist";

export default function Page() {
  const [searchType, setSearchType] = useState<SearchType>("artist");

  return (
    <main className="bg-background text-foreground min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="size-6" />
            <h1 className="text-2xl font-bold">Music Data Explorer</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Descubre insights sobre tu música favorita
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explora datos interesantes sobre artistas, playlists y álbumes usando la API de Spotify.
            Analiza duraciones, géneros, popularidad y más.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-center">
            <TrendingUp className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold">Análisis de Tendencias</h3>
            <p className="text-sm text-muted-foreground">
              Descubre patrones en la música que escuchas
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <BarChart3 className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold">Visualizaciones</h3>
            <p className="text-sm text-muted-foreground">
              Gráficos interactivos de datos musicales
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-center">
            <Music className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold">Insights Únicos</h3>
            <p className="text-sm text-muted-foreground">
              Datos curiosos sobre artistas y canciones
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <div className="mb-4 flex gap-2">
              <Button
                variant={searchType === "artist" ? "default" : "outline"}
                onClick={() => setSearchType("artist")}
                className="flex items-center gap-2"
              >
                <User className="size-4" />
                Buscar Artista
              </Button>
              <Button
                variant={searchType === "playlist" ? "default" : "outline"}
                onClick={() => setSearchType("playlist")}
                className="flex items-center gap-2"
              >
                <ListMusic className="size-4" />
                Buscar Playlist
              </Button>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                {searchType === "artist" ? "Buscar Artista" : "Buscar Playlist"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchType === "artist"
                  ? "Comienza buscando un artista para ver sus datos y análisis"
                  : "Busca una playlist para analizar sus canciones y descubrir insights interesantes"}
              </p>
            </div>
          </div>
          {searchType === "artist" ? <ArtistSearch /> : <PlaylistSearch />}
        </div>
      </div>
    </main>
  );
}