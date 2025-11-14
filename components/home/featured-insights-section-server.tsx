import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, Award, Music } from "lucide-react";
import type { SpotifyArtist } from "@/lib/api/spotify";

interface FeaturedInsightsSectionProps {
  artists: SpotifyArtist[];
}

export function FeaturedInsightsSectionServer({ artists }: FeaturedInsightsSectionProps) {
  if (artists.length === 0) {
    return null;
  }

  const topArtist = artists[0];
  const mostFollowers = [...artists].sort((a, b) => b.followers.total - a.followers.total)[0];
  const mostPopular = [...artists].sort((a, b) => b.popularity - a.popularity)[0];

  const insights = [
    {
      icon: Award,
      title: "Más Popular",
      artist: mostPopular,
      value: `${mostPopular.popularity}/100`,
      description: `Popularidad en Spotify`,
    },
    {
      icon: Users,
      title: "Más Seguidores",
      artist: mostFollowers,
      value: `${(mostFollowers.followers.total / 1000000).toFixed(1)}M`,
      description: `seguidores`,
    },
    {
      icon: TrendingUp,
      title: "Top Artist",
      artist: topArtist,
      value: "#1",
      description: `en trending`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Featured Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Descubre estadísticas interesantes sobre los artistas destacados
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const imageUrl = insight.artist.images[0]?.url;

          return (
            <Link
              key={`${insight.title}-${index}-${insight.artist.id}`}
              href={`/artist/${insight.artist.id}`}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{insight.value}</div>
                    <div className="text-xs text-muted-foreground">{insight.description}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <p className="text-sm font-semibold text-primary">{insight.artist.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-lg bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={insight.artist.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Music className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {insight.artist.genres.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {insight.artist.genres[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

