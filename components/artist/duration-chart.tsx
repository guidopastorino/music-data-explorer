"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SpotifyTrack } from "@/lib/api/spotify";
import { prepareDurationChartData, formatDuration } from "@/lib/utils/data-processing";

interface DurationChartProps {
  tracks: SpotifyTrack[];
}

export function DurationChart({ tracks }: DurationChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's 'sm' breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const data = prepareDurationChartData(tracks);

  // Colores para las barras usando variables del tema
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  
  const getColor = (index: number) => {
    return chartColors[index % chartColors.length];
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Duración de Canciones</h3>
        <p className="text-sm text-muted-foreground">
          Comparación de la duración de cada canción (en segundos)
        </p>
      </div>
      <div className="h-80 w-full bg-card md:bg-transparent rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: isMobile ? 0 : 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              label={isMobile ? undefined : { value: "Segundos", angle: -90, position: "insideLeft" }}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Duración: {data.durationFormatted}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Popularidad: {data.popularity}/100
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="duration" radius={[8, 8, 0, 0]} fill="var(--chart-1)">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

