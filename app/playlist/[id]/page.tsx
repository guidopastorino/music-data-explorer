import type { Metadata } from "next";
import { getPlaylistMetadata } from "@/lib/api/spotify/metadata";
import { PlaylistPageClient } from "@/components/playlist/playlist-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const playlist = await getPlaylistMetadata(id);

    if (!playlist) {
      return {
        title: "Playlist | Music Data Explorer",
        description: "Descubre insights interesantes sobre playlists usando la API de Spotify",
      };
    }

    const imageUrl = playlist.images[0]?.url;
    const followers = playlist.followers?.total ?? 0;
    const followersFormatted = followers.toLocaleString("es-ES");
    const trackCount = playlist.tracks?.total ?? 0;
    const owner = playlist.owner.display_name;
    const description = playlist.description || `${playlist.name} por ${owner}`;

    return {
      title: `${playlist.name} | Music Data Explorer`,
      description: `${playlist.name} por ${owner}. ${trackCount} canciones. ${followers > 0 ? `${followersFormatted} seguidores. ` : ""}${description}`,
      openGraph: {
        title: `${playlist.name} | Music Data Explorer`,
        description: `${playlist.name} por ${owner} • ${trackCount} canciones${followers > 0 ? ` • ${followersFormatted} seguidores` : ""}`,
        type: "music.playlist",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 640,
                height: 640,
                alt: playlist.name,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary",
        title: `${playlist.name} | Music Data Explorer`,
        description: `${playlist.name} por ${owner} • ${trackCount} canciones${followers > 0 ? ` • ${followersFormatted} seguidores` : ""}`,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error en generateMetadata para playlist:", error);
    return {
      title: "Playlist | Music Data Explorer",
      description: "Descubre insights interesantes sobre playlists usando la API de Spotify",
    };
  }
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // No necesitamos obtener la playlist aquí porque el componente client lo hace
  // Solo pasamos el ID y el componente client manejará la carga
  return <PlaylistPageClient playlistId={id} />;
}

