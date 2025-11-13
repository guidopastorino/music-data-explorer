import { NextRequest, NextResponse } from "next/server";
import { createSpotifyClient, SpotifyEndpoints } from "@/lib/api/spotify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "El ID de la playlist es requerido" },
        { status: 400 },
      );
    }

    const client = createSpotifyClient();
    const endpoints = new SpotifyEndpoints(client.getClient());

    const playlist = await endpoints.getPlaylist(id);

    // Extraer tracks de la playlist (filtrar nulls)
    const tracks = playlist.tracks?.items
      ?.map((item) => item.track)
      .filter((track): track is NonNullable<typeof track> => track !== null) ?? [];

    return NextResponse.json({
      playlist: {
        ...playlist,
        tracks: {
          total: playlist.tracks?.total ?? 0,
          items: tracks,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener playlist de Spotify:", error);
    return NextResponse.json(
      {
        error: "Error al obtener información de la playlist",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

