"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/navbar/global-search";
import { MobileSearchDrawer } from "@/components/navbar/mobile-search-drawer";

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
            <div className="flex size-10 items-center justify-center rounded-lg overflow-hidden">
              <Image 
                src="/icons/apple-icon-180x180.png" 
                alt="Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold">Music Data Explorer</h1>
          </Link>
          {/* Search - solo visible en desktop */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <GlobalSearch />
          </div>
          {/* Botón de búsqueda - solo visible en mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
              className="shrink-0"
            >
              <Search className="size-5" />
              <span className="sr-only">Buscar</span>
            </Button>
            <ThemeToggle />
          </div>
          {/* Theme toggle - solo visible en desktop */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
      {/* Drawer de búsqueda mobile */}
      <MobileSearchDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </nav>
  );
}

