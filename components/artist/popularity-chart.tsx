"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import type { SpotifyTrack } from "@/lib/api/spotify";
import { preparePopularityChartData } from "@/lib/utils/data-processing";

interface PopularityChartProps {
  tracks: SpotifyTrack[];
}

export function PopularityChart({ tracks }: PopularityChartProps) {
  const data = preparePopularityChartData(tracks);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Popularidad de Canciones</h3>
        <p className="text-sm text-muted-foreground">
          Nivel de popularidad de cada canción (0-100)
        </p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              domain={[0, 100]}
              label={{ value: "Popularidad", angle: -90, position: "insideLeft" }}
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
                        Popularidad: {data.popularity}/100
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="popularity"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={<Dot r={4} fill="var(--chart-2)" />}
              activeDot={{
                r: 8,
                fill: "var(--chart-2)",
                stroke: "var(--card)",
                strokeWidth: 2,
                style: { filter: "drop-shadow(0 0 6px var(--chart-2))" },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

