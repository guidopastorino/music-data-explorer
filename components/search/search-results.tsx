"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, User, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArtistResults } from "./artist-results";
import { PlaylistResults } from "./playlist-results";
import { Pagination } from "@/components/search/pagination";
import type { SpotifySearchResponse, SpotifyPlaylistSearchResponse } from "@/lib/api/spotify";

const ITEMS_PER_PAGE = 20;

type SearchTabType = "artists" | "playlists";

async function searchArtists(query: string, page: number): Promise<SpotifySearchResponse> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(query)}&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error("Error al buscar artistas");
  }
  return response.json();
}

async function searchPlaylists(
  query: string,
  page: number,
): Promise<SpotifyPlaylistSearchResponse> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const response = await fetch(
    `/api/spotify/search/playlists?q=${encodeURIComponent(query)}&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error("Error al buscar playlists");
  }
  return response.json();
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const tabParam = searchParams.get("tab") as SearchTabType | null;
  const [activeTab, setActiveTab] = useState<SearchTabType>(tabParam === "playlists" ? "playlists" : "artists");
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10);

  // Cambiar tab cuando cambia el parámetro de URL
  useEffect(() => {
    if (tabParam === "playlists") {
      setActiveTab("playlists");
    } else {
      setActiveTab("artists");
    }
  }, [tabParam]);

  const {
    data: artistsData,
    isLoading: isLoadingArtists,
    error: artistsError,
  } = useQuery<SpotifySearchResponse>({
    queryKey: ["search-artists", query, currentPage],
    queryFn: () => searchArtists(query, currentPage),
    enabled: query.length > 0 && activeTab === "artists",
    placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras carga
  });

  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
    error: playlistsError,
  } = useQuery<SpotifyPlaylistSearchResponse>({
    queryKey: ["search-playlists", query, currentPage],
    queryFn: () => searchPlaylists(query, currentPage),
    enabled: query.length > 0 && activeTab === "playlists",
    placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras carga
  });

  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    // Mantener la página actual (paginación compartida)
    if (!params.has("page")) {
      params.set("page", currentPage.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (!params.has("tab")) {
      params.set("tab", activeTab);
    }
    router.push(`/search?${params.toString()}`);
  };

  const isLoading = (activeTab === "artists" && isLoadingArtists) || (activeTab === "playlists" && isLoadingPlaylists);
  const error = activeTab === "artists" ? artistsError : playlistsError;

  // Calcular total de páginas según el tab activo
  const artistsTotal = artistsData?.artists.total || 0;
  const playlistsTotal = playlistsData?.playlists.total || 0;
  const currentTotal = activeTab === "artists" ? artistsTotal : playlistsTotal;
  const totalPages = Math.max(1, Math.ceil(currentTotal / ITEMS_PER_PAGE));
  
  // Ajustar página si es mayor que el total de páginas del tab actual
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", totalPages.toString());
      router.push(`/search?${params.toString()}`);
    }
  }, [currentPage, totalPages, searchParams, router]);

  const hasArtists = artistsData && artistsData.artists.items.length > 0;
  const hasPlaylists = playlistsData && playlistsData.playlists.items.length > 0;
  const hasResults = (activeTab === "artists" && hasArtists) || (activeTab === "playlists" && hasPlaylists);

  if (!query) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="size-12 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">No hay búsqueda</h2>
              <p className="text-muted-foreground">Ingresa un término de búsqueda para comenzar</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !artistsData && !playlistsData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="size-12 text-destructive" />
            <div>
              <h2 className="text-xl font-semibold">Error al buscar</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Resultados de búsqueda para &quot;{query}&quot;
        </h1>
        {(artistsTotal > 0 || playlistsTotal > 0) && (
          <p className="mt-1 text-muted-foreground">
            {activeTab === "artists" ? `${artistsTotal} artistas` : `${playlistsTotal} playlists`} encontrados
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b">
        <Button
          variant={activeTab === "artists" ? "default" : "ghost"}
          onClick={() => handleTabChange("artists")}
          className={cn(
            "rounded-b-none border-b-2 border-transparent gap-2",
            activeTab === "artists" && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <User className="size-4" />
          <span>Artistas</span>
          {artistsTotal > 0 && (
            <span className="ml-1 text-xs opacity-75">({artistsTotal})</span>
          )}
        </Button>
        <Button
          variant={activeTab === "playlists" ? "default" : "ghost"}
          onClick={() => handleTabChange("playlists")}
          className={cn(
            "rounded-b-none border-b-2 border-transparent gap-2",
            activeTab === "playlists" && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <ListMusic className="size-4" />
          <span>Playlists</span>
          {playlistsTotal > 0 && (
            <span className="ml-1 text-xs opacity-75">({playlistsTotal})</span>
          )}
        </Button>
      </div>

      {/* Results */}
      {isLoading && !hasResults && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Buscando resultados...</p>
          </div>
        </div>
      )}

      {!isLoading && !hasResults && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No se encontraron {activeTab === "artists" ? "artistas" : "playlists"} para &quot;{query}&quot;
          </p>
        </div>
      )}

      {/* Mostrar loader solo en el área de resultados si está cargando pero hay datos anteriores */}
      {isLoading && hasResults && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          {activeTab === "artists" && artistsData && hasArtists && (
            <div className="opacity-50 pointer-events-none">
              <ArtistResults data={artistsData} />
            </div>
          )}
          {activeTab === "playlists" && playlistsData && hasPlaylists && (
            <div className="opacity-50 pointer-events-none">
              <PlaylistResults data={playlistsData} />
            </div>
          )}
        </div>
      )}

      {!isLoading && hasResults && (
        <>
          {activeTab === "artists" && hasArtists && artistsData && (
            <ArtistResults data={artistsData} />
          )}

          {activeTab === "playlists" && hasPlaylists && playlistsData && (
            <PlaylistResults data={playlistsData} />
          )}
        </>
      )}

      {/* Paginación siempre visible si hay datos o está cargando */}
      {(hasResults || (artistsData || playlistsData)) && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
