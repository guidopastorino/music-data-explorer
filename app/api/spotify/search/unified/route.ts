import { NextRequest, NextResponse } from "next/server";
import { createSpotifyClient, SpotifyEndpoints } from "@/lib/api/spotify";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

    if (!query) {
      return NextResponse.json(
        { error: "El parámetro 'q' (query) es requerido" },
        { status: 400 },
      );
    }

    const client = createSpotifyClient();
    const endpoints = new SpotifyEndpoints(client.getClient());

    const results = await endpoints.searchUnified(query, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error en búsqueda unificada de Spotify:", error);
    return NextResponse.json(
      {
        error: "Error al buscar en Spotify",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

