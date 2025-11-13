import type { Metadata } from "next";
import { getArtistMetadata } from "@/lib/api/spotify/metadata";
import { ArtistPageClient } from "@/components/artist/artist-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const artist = await getArtistMetadata(id);

    if (!artist) {
      return {
        title: "Artista | Music Data Explorer",
        description: "Descubre insights interesantes sobre artistas usando la API de Spotify",
      };
    }

    const imageUrl = artist.images[0]?.url;
    const followers = artist.followers.total.toLocaleString("es-ES");
    const genres = artist.genres.slice(0, 3).join(", ");

    return {
      title: `${artist.name} | Music Data Explorer`,
      description: `${artist.name} en Music Data Explorer. ${followers} seguidores. ${genres ? `Géneros: ${genres}.` : ""} Popularidad: ${artist.popularity}/100. Descubre insights interesantes sobre este artista.`,
      openGraph: {
        title: `${artist.name} | Music Data Explorer`,
        description: `${artist.name} - ${followers} seguidores${genres ? ` • ${genres}` : ""}`,
        type: "profile",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 640,
                height: 640,
                alt: artist.name,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary",
        title: `${artist.name} | Music Data Explorer`,
        description: `${artist.name} - ${followers} seguidores${genres ? ` • ${genres}` : ""}`,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error en generateMetadata para artista:", error);
    return {
      title: "Artista | Music Data Explorer",
      description: "Descubre insights interesantes sobre artistas usando la API de Spotify",
    };
  }
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // No necesitamos obtener el artista aquí porque el componente client lo hace
  // Solo pasamos el ID y el componente client manejará la carga
  return <ArtistPageClient artistId={id} />;
}

