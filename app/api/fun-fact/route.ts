import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no está configurado" },
        { status: 500 },
      );
    }

    // Crear instancia de Google Generative AI con la API key
    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const body = await request.json();
    const { type, id, name, data } = body;

    if (!type || !id || !name) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: type, id, name" },
        { status: 400 },
      );
    }

    // Crear el prompt según el tipo
    let prompt = "";
    if (type === "artist") {
      prompt = `Genera un fun fact interesante y único sobre el artista "${name}". 
El fun fact debe ser:
- Curioso y entretenido
- Específico sobre el artista
- En español
- Máximo 2-3 oraciones
- No incluyas información obvia o muy conocida

Artista: ${name}`;
    } else if (type === "playlist") {
      prompt = `Genera un fun fact interesante y único sobre la playlist "${name}". 
El fun fact debe ser:
- Curioso y entretenido
- Específico sobre la playlist
- En español
- Máximo 2-3 oraciones
- Puedes mencionar datos sobre las canciones, el creador, o características especiales

Playlist: ${name}`;
    } else {
      return NextResponse.json(
        { error: "Tipo inválido. Debe ser 'artist' o 'playlist'" },
        { status: 400 },
      );
    }

    // Intentar primero con el modelo más barato y rápido (lite)
    // Fallback: lite -> flash -> pro
    let text: string;
    let modelUsed = "gemini-2.5-flash-lite";

    try {
      // Primero intentar con Lite (más barato y rápido)
      const result = await generateText({
        model: google("gemini-2.5-flash-lite"),
        prompt,
      });
      text = result.text;
    } catch (liteError) {
      // Si lite falla, intentar con flash
      console.warn("Lite falló, intentando con Flash:", liteError);
      try {
        const result = await generateText({
          model: google("gemini-2.5-flash"),
          prompt,
        });
        text = result.text;
        modelUsed = "gemini-2.5-flash";
      } catch (flashError) {
        // Si flash falla, intentar con pro como último recurso
        console.warn("Flash falló, intentando con Pro:", flashError);
        try {
          const result = await generateText({
            model: google("gemini-2.5-pro"),
            prompt,
          });
          text = result.text;
          modelUsed = "gemini-2.5-pro";
        } catch (proError) {
          // Si todos fallan, lanzar el error
          throw proError;
        }
      }
    }

    return NextResponse.json({ funFact: text });
  } catch (error: unknown) {
    console.error("Error al generar fun fact:", error);

    // Detectar errores específicos de sobrecarga o disponibilidad
    let errorMessage = "Error al generar el fun fact";
    let statusCode = 500;

    if (error && typeof error === "object" && "statusCode" in error) {
      const status = error.statusCode as number;
      if (status === 503 || status === 429) {
        errorMessage =
          "El servicio está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos.";
        statusCode = 503;
      } else if (status === 401 || status === 403) {
        errorMessage = "Error de autenticación con la API de Gemini.";
        statusCode = status;
      }
    } else if (error instanceof Error) {
      if (
        error.message.includes("overloaded") ||
        error.message.includes("try again later")
      ) {
        errorMessage =
          "El servicio está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos.";
        statusCode = 503;
      } else if (error.message.includes("API key")) {
        errorMessage = "Error de configuración de la API key.";
        statusCode = 500;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          error instanceof Error ? error.message : "Error desconocido",
      },
      { status: statusCode },
    );
  }
}

