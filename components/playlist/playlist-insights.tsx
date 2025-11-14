"use client";

import { Clock, TrendingUp, Award, Minus, Users } from "lucide-react";
import type { SpotifyTrack } from "@/lib/api/spotify";
import {
  formatDuration,
  calculateAverageDuration,
  findLongestTrack,
  findShortestTrack,
  calculateAveragePopularity,
  findMostFrequentArtists,
} from "@/lib/data-processing";

interface PlaylistInsightsProps {
  tracks: SpotifyTrack[];
}

export function PlaylistInsights({ tracks }: PlaylistInsightsProps) {
  if (tracks.length === 0) {
    return null;
  }

  const avgDuration = calculateAverageDuration(tracks);
  const longestTrack = findLongestTrack(tracks);
  const shortestTrack = findShortestTrack(tracks);
  const avgPopularity = calculateAveragePopularity(tracks);
  const totalDuration = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
  const mostFrequentArtists = findMostFrequentArtists(tracks, 3);

  const insights = [
    {
      icon: Clock,
      title: "Duración Promedio",
      value: formatDuration(avgDuration),
      description: "Tiempo promedio de las canciones",
    },
    {
      icon: Award,
      title: "Canción Más Larga",
      value: longestTrack?.name || "N/A",
      description: longestTrack
        ? `${formatDuration(longestTrack.duration_ms)} de duración`
        : "",
    },
    {
      icon: Minus,
      title: "Canción Más Corta",
      value: shortestTrack?.name || "N/A",
      description: shortestTrack
        ? `${formatDuration(shortestTrack.duration_ms)} de duración`
        : "",
    },
    {
      icon: TrendingUp,
      title: "Popularidad Promedio",
      value: `${avgPopularity}/100`,
      description: "Nivel promedio de popularidad",
    },
    {
      icon: Clock,
      title: "Duración Total",
      value: formatDuration(totalDuration),
      description: "Tiempo total de todas las canciones",
    },
    {
      icon: Award,
      title: "Total de Canciones",
      value: tracks.length.toString(),
      description: "Cantidad de canciones analizadas",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Insights y Datos Curiosos</h3>
        <p className="text-sm text-muted-foreground">
          Información interesante sobre las canciones de la playlist
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="rounded-lg border bg-card p-4 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                <h4 className="font-semibold">{insight.title}</h4>
              </div>
              <p className="text-2xl font-bold">{insight.value}</p>
              {insight.description && (
                <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
              )}
            </div>
          );
        })}
      </div>

      {mostFrequentArtists.length > 0 && (
        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h4 className="font-semibold">Artistas Más Frecuentes</h4>
          </div>
          <div className="space-y-2">
            {mostFrequentArtists.map((artist, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{artist.name}</span>
                <span className="text-sm text-muted-foreground">
                  {artist.count} {artist.count === 1 ? "canción" : "canciones"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

