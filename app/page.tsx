import { createSpotifyClient, SpotifyEndpoints } from "@/lib/api/spotify";
import { HeroSection } from "@/components/home/hero-section";
import { PopularArtistsSectionServer } from "@/components/home/popular-artists-section-server";
import { FeaturedInsightsSectionServer } from "@/components/home/featured-insights-section-server";
import type { SpotifyArtist } from "@/lib/api/spotify";

export const revalidate = 3600; // Cache for 1 hour

async function getPopularArtists(): Promise<SpotifyArtist[]> {
  try {
    const client = createSpotifyClient();
    const endpoints = new SpotifyEndpoints(client.getClient());
    const artists = await endpoints.getPopularArtists(12);
    return artists;
  } catch (error) {
    console.error("Error fetching popular artists:", error);
    return [];
  }
}

export default async function Page() {
  const popularArtists = await getPopularArtists();

  return (
    <main className="bg-background text-foreground min-h-screen transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <HeroSection />
          <PopularArtistsSectionServer artists={popularArtists} />
          <FeaturedInsightsSectionServer artists={popularArtists.slice(0, 3)} />
        </div>
      </div>
    </main>
  );
}