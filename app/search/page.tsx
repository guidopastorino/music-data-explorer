"use client";

import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";

function SearchResultsWrapper() {
  return <SearchResults />;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-muted-foreground">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <SearchResultsWrapper />
    </Suspense>
  );
}

