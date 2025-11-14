"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, User, ListMusic } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SpotifySearchResponse, SpotifyPlaylistSearchResponse, SpotifyArtist, SpotifyPlaylist } from "@/lib/api/spotify";
import { SearchResultItem } from "./search-result-item";

type SearchTabType = "artists" | "playlists";

async function searchArtists(query: string, limit = 10): Promise<SpotifySearchResponse> {
  const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Error al buscar artistas");
  }
  return response.json();
}

async function searchPlaylists(query: string, limit = 10): Promise<SpotifyPlaylistSearchResponse> {
  const response = await fetch(`/api/spotify/search/playlists?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Error al buscar playlists");
  }
  return response.json();
}

interface MobileSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSearchDrawer({ open, onOpenChange }: MobileSearchDrawerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTabType>("artists");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input cuando se abre el drawer
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const {
    data: artistsData,
    isLoading: isLoadingArtists,
  } = useQuery<SpotifySearchResponse>({
    queryKey: ["search-artists", debouncedQuery],
    queryFn: () => searchArtists(debouncedQuery, 10),
    enabled: debouncedQuery.length > 0 && activeTab === "artists",
  });

  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
  } = useQuery<SpotifyPlaylistSearchResponse>({
    queryKey: ["search-playlists", debouncedQuery],
    queryFn: () => searchPlaylists(debouncedQuery, 10),
    enabled: debouncedQuery.length > 0 && activeTab === "playlists",
  });

  const isLoading = (activeTab === "artists" && isLoadingArtists) || (activeTab === "playlists" && isLoadingPlaylists);
  const artists = artistsData?.artists.items || [];
  const playlists = playlistsData?.playlists.items || [];
  const currentResults = activeTab === "artists" ? artists : playlists.filter((p): p is SpotifyPlaylist => p !== null);
  const hasResults = currentResults.length > 0;
  const hasAnyResults = artists.length > 0 || playlists.filter((p): p is SpotifyPlaylist => p !== null).length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasResults || isLoading) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (prev === -1) {
          return 0;
        }
        if (prev < currentResults.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        if (prev === -1) {
          return -1;
        }
        if (prev > 0) {
          return prev - 1;
        }
        return -1;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
        const selected = currentResults[selectedIndex];
        if (selected) {
          const href = activeTab === "artists" 
            ? `/artist/${selected.id}` 
            : `/playlist/${selected.id}`;
          handleResultClick();
          router.push(href);
        }
      } else if (searchQuery.trim().length > 0) {
        handleResultClick();
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = () => {
    onOpenChange(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    setSelectedIndex(-1);
  };

  // Resetear índice cuando cambia el tab o hay nuevos resultados
  useEffect(() => {
    setSelectedIndex(-1);
  }, [activeTab, debouncedQuery]);

  // Hacer scroll al elemento seleccionado
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom" modal={true}>
      <DrawerContent className="h-[85dvh] max-h-[85dvh] flex flex-col p-0 overflow-hidden bg-gradient-to-b from-background to-background/95">
        {/* Handle visual del drawer */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Input de búsqueda - siempre visible */}
        <DrawerHeader className="px-5 pb-4 pt-2 flex-shrink-0">
          <DrawerTitle className="sr-only">Búsqueda de artistas y playlists</DrawerTitle>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-foreground/60 dark:text-foreground/70 pointer-events-none z-10" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar artistas y playlists..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="pl-11 pr-11 h-12 text-base rounded-xl border-2 focus-visible:border-primary/50 bg-card/80 dark:bg-card/60 backdrop-blur-sm"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 animate-spin text-primary pointer-events-none" />
            )}
          </div>
        </DrawerHeader>

        {/* Tabs - diseño mejorado */}
        <div className="flex items-center gap-2 px-5 pb-4 flex-shrink-0">
          <button
            onClick={() => handleTabChange("artists")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative",
              activeTab === "artists"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <User className={cn("size-4 transition-transform", activeTab === "artists" && "scale-110")} />
            <span>Artistas</span>
            {activeTab === "artists" && (
              <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => handleTabChange("playlists")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative",
              activeTab === "playlists"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            <ListMusic className={cn("size-4 transition-transform", activeTab === "playlists" && "scale-110")} />
            <span>Playlists</span>
            {activeTab === "playlists" && (
              <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
            )}
          </button>
        </div>

        {/* Contenedor de resultados con scroll */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Buscando...</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && hasResults && (
            <div ref={resultsContainerRef} className="space-y-1">
              {currentResults.map((item, index) => {
                const isArtist = activeTab === "artists";
                return (
                  <SearchResultItem
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type={isArtist ? "artist" : "playlist"}
                    artist={isArtist ? (item as SpotifyArtist) : undefined}
                    playlist={!isArtist ? (item as SpotifyPlaylist) : undefined}
                    onClick={handleResultClick}
                    isSelected={selectedIndex === index}
                  />
                );
              })}
            </div>
          )}

          {/* No results */}
          {!isLoading && debouncedQuery.length > 0 && !hasResults && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="size-7 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                No se encontraron {activeTab === "artists" ? "artistas" : "playlists"}
              </p>
              <p className="text-sm text-muted-foreground">
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}

          {/* Writing */}
          {!isLoading && searchQuery.length > 0 && debouncedQuery.length === 0 && (
            <div className="flex items-center justify-center py-12 gap-2">
              <div className="flex gap-1">
                <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <div className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                <div className="size-2 rounded-full bg-primary/60 animate-bounce" />
              </div>
              <span className="text-sm text-muted-foreground ml-2">Escribiendo...</span>
            </div>
          )}
        </div>

        {/* Enlace para ir a la página de resultados completos - siempre al final */}
        {!isLoading && hasAnyResults && (
          <div className="px-5 pb-5 pt-3 border-t bg-gradient-to-t from-background to-background/50 flex-shrink-0">
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}`}
              onClick={handleResultClick}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="size-4" />
              <span>Ver todos los resultados de &quot;{searchQuery}&quot;</span>
            </Link>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

