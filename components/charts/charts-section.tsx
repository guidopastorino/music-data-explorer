"use client";

import { cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/api/spotify";
import { DurationChart } from "@/components/artist/duration-chart";
import { PopularityChart } from "@/components/artist/popularity-chart";

interface ChartsSectionProps {
  tracks: SpotifyTrack[];
  columns?: 1 | 2;
}

export function ChartsSection({ tracks, columns = 1 }: ChartsSectionProps) {
  return (
    <div
      className={cn(
        "grid gap-8",
        columns === 1 ? "grid-cols-1" : "lg:grid-cols-2"
      )}
    >
      <div className="rounded-lg md:border md:bg-card md:p-6">
        <DurationChart tracks={tracks} />
      </div>

      <div className="rounded-lg md:border md:bg-card md:p-6">
        <PopularityChart tracks={tracks} />
      </div>
    </div>
  );
}

