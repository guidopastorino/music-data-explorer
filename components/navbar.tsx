"use client";

import Link from "next/link";
import { Music } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Music className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Music Data Explorer</h1>
              <p className="text-xs text-muted-foreground">Powered by Spotify API</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

