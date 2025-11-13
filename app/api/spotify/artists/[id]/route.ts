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
        { error: "El ID del artista es requerido" },
        { status: 400 },
      );
    }

    const client = createSpotifyClient();
    const endpoints = new SpotifyEndpoints(client.getClient());

    // Obtener información del artista y sus top tracks
    const [artist, topTracks] = await Promise.all([
      endpoints.getArtist(id),
      endpoints.getArtistTopTracks(id),
    ]);

    return NextResponse.json({
      artist,
      topTracks: topTracks.tracks,
    });
  } catch (error) {
    console.error("Error al obtener artista de Spotify:", error);
    return NextResponse.json(
      {
        error: "Error al obtener información del artista",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

