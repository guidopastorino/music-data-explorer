import { NextRequest, NextResponse } from "next/server";
import { createSpotifyClient, SpotifyEndpoints } from "@/lib/api/spotify";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

    const client = createSpotifyClient();
    const endpoints = new SpotifyEndpoints(client.getClient());

    const popularArtists = await endpoints.getPopularArtists(limit);

    return NextResponse.json({ artists: popularArtists });
  } catch (error) {
    console.error("Error al obtener artistas populares de Spotify:", error);
    return NextResponse.json(
      {
        error: "Error al obtener artistas populares",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

