"use client";

import { useState } from "react";
import { Music, TrendingUp, BarChart3, User, ListMusic, Sparkles } from "lucide-react";
import { ArtistSearch } from "@/components/search/artist-search";
import { PlaylistSearch } from "@/components/search/playlist-search";
import { Button } from "@/components/ui/button";

type SearchType = "artist" | "playlist";

export default function Page() {
  const [searchType, setSearchType] = useState<SearchType>("artist");

  return (
    <main className="bg-background text-foreground min-h-screen transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
            <Sparkles className="size-4 text-primary" />
            <span className="text-muted-foreground">Explora datos musicales en tiempo real</span>
          </div>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Descubre insights sobre tu música favorita
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explora datos interesantes sobre artistas, playlists y álbumes usando la API de Spotify.
            Analiza duraciones, géneros, popularidad y más.
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          <div className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Análisis de Tendencias</h3>
            <p className="text-sm text-muted-foreground">
              Descubre patrones en la música que escuchas
            </p>
          </div>
          <div className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Visualizaciones</h3>
            <p className="text-sm text-muted-foreground">
              Gráficos interactivos de datos musicales
            </p>
          </div>
          <div className="group rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
              <Music className="size-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Insights Únicos</h3>
            <p className="text-sm text-muted-foreground">
              Datos curiosos sobre artistas y canciones
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Button
                variant={searchType === "artist" ? "default" : "outline"}
                onClick={() => setSearchType("artist")}
                className="flex items-center gap-2"
                size="lg"
              >
                <User className="size-4" />
                Buscar Artista
              </Button>
              <Button
                variant={searchType === "playlist" ? "default" : "outline"}
                onClick={() => setSearchType("playlist")}
                className="flex items-center gap-2"
                size="lg"
              >
                <ListMusic className="size-4" />
                Buscar Playlist
              </Button>
            </div>
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold">
                {searchType === "artist" ? "Buscar Artista" : "Buscar Playlist"}
              </h3>
              <p className="text-muted-foreground">
                {searchType === "artist"
                  ? "Comienza buscando un artista para ver sus datos y análisis"
                  : "Busca una playlist para analizar sus canciones y descubrir insights interesantes"}
              </p>
            </div>
            {searchType === "artist" ? <ArtistSearch /> : <PlaylistSearch />}
          </div>
        </div>
      </div>
    </main>
  );
}