"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, User, ListMusic, Music } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export function GlobalSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTabType>("artists");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isClickingInPopoverRef = useRef(false);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
  const showDropdown = isFocused && searchQuery.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || isLoading || !hasResults) return;

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
        // Navegar al resultado seleccionado
        const selected = currentResults[selectedIndex];
        if (selected) {
          const href = activeTab === "artists" 
            ? `/artist/${selected.id}` 
            : `/playlist/${selected.id}`;
          handleResultClick();
          router.push(href);
        }
      } else if (searchQuery.trim().length > 0) {
        // Si no hay selección, ir a la página de resultados
        setIsFocused(false);
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = () => {
    setIsFocused(false);
    setSearchQuery("");
    setSelectedIndex(-1);
    inputRef.current?.blur();
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

  // Cerrar dropdown al hacer click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Verificar si el click es fuera del input y del dropdown
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsFocused(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar artistas y playlists..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={(e) => {
            // No cerrar si se está haciendo click en el dropdown
            if (isClickingInPopoverRef.current) {
              return;
            }
            
            // Verificar si el nuevo elemento con focus está dentro del dropdown
            const relatedTarget = e.relatedTarget as Node | null;
            if (dropdownRef.current?.contains(relatedTarget)) {
              return;
            }
            
            // Delay para permitir clics en los resultados
            setTimeout(() => {
              // Verificar nuevamente antes de cerrar
              if (!isClickingInPopoverRef.current) {
                const activeElement = document.activeElement;
                if (!dropdownRef.current?.contains(activeElement)) {
                  setIsFocused(false);
                }
              }
            }, 150);
          }}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 w-full"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground pointer-events-none" />
        )}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 mt-2 bg-popover border rounded-md shadow-lg z-50",
            "w-full sm:w-full sm:max-w-md p-0",
            "transition-opacity duration-200 opacity-100",
            "max-h-[calc(100dvh-5rem)] sm:max-h-[400px] overflow-hidden flex flex-col"
          )}
          onMouseDown={() => {
            isClickingInPopoverRef.current = true;
          }}
          onMouseUp={() => {
            // Permitir que el click se complete antes de resetear
            setTimeout(() => {
              isClickingInPopoverRef.current = false;
            }, 100);
          }}
        >
          {/* Tabs */}
          <div className="flex items-center gap-2 rounded-t-lg border-b bg-muted/50 p-1">
            <Button
              variant={activeTab === "artists" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("artists")}
              className={cn(
                "flex-1 gap-2",
                activeTab === "artists" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <User className="size-4" />
              <span className="hidden sm:inline">Artistas</span>
              <span className="sm:hidden">Art.</span>
            </Button>
            <Button
              variant={activeTab === "playlists" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange("playlists")}
              className={cn(
                "flex-1 gap-2",
                activeTab === "playlists" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <ListMusic className="size-4" />
              <span className="hidden sm:inline">Playlists</span>
              <span className="sm:hidden">Play.</span>
            </Button>
          </div>

          {/* Results */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && hasResults && (
            <div ref={resultsContainerRef} className="flex-1 overflow-y-auto max-h-[calc(100dvh-8rem)] sm:max-h-[400px]">
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

          {/* Enlace para ir a la página de resultados completos - visible en ambas tabs cuando hay resultados */}
          {!isLoading && hasAnyResults && (
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}`}
              onClick={handleResultClick}
              className="flex items-center justify-center gap-2 px-4 py-3 border-t bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
            >
              <Search className="size-4" />
              <span>Ir a &quot;{searchQuery}&quot;</span>
            </Link>
          )}

          {!isLoading && debouncedQuery.length > 0 && !hasResults && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No se encontraron {activeTab === "artists" ? "artistas" : "playlists"}
            </div>
          )}

          {!isLoading && searchQuery.length > 0 && debouncedQuery.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Escribiendo...
            </div>
          )}
        </div>
      )}
    </div>
  );
}


