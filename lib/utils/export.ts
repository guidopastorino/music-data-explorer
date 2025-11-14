import jsPDF from "jspdf";
import type { SpotifyArtist, SpotifyTrack, SpotifyPlaylist } from "@/lib/api/spotify";

interface ExportData {
  type: "artist" | "playlist";
  name: string;
  imageUrl?: string;
  artist?: SpotifyArtist;
  playlist?: SpotifyPlaylist;
  tracks: SpotifyTrack[];
}

/**
 * Exporta datos a JSON
 */
export function exportToJSON(data: ExportData): void {
  const jsonData = {
    type: data.type,
    name: data.name,
    exportedAt: new Date().toISOString(),
    ...(data.type === "artist"
      ? {
          artist: data.artist,
          topTracks: data.tracks,
        }
      : {
          playlist: data.playlist,
          tracks: data.tracks,
        }),
  };

  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.name.replace(/[^a-z0-9]/gi, "_")}_${data.type}_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta tracks a CSV
 */
export function exportToCSV(data: ExportData): void {
  const headers = [
    "Nombre",
    "Artista(s)",
    "Álbum",
    "Duración (ms)",
    "Duración (mm:ss)",
    "Popularidad",
    "Spotify URL",
  ];

  const rows = data.tracks.map((track) => {
    const artists = track.artists.map((a) => a.name).join(", ");
    const durationMinutes = Math.floor(track.duration_ms / 60000);
    const durationSeconds = Math.floor((track.duration_ms % 60000) / 1000);
    const durationFormatted = `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`;

    return [
      track.name,
      artists,
      track.album.name,
      track.duration_ms.toString(),
      durationFormatted,
      track.popularity.toString(),
      track.external_urls.spotify,
    ];
  });

  // Escapar valores que contengan comas o comillas
  const escapeCSV = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.name.replace(/[^a-z0-9]/gi, "_")}_${data.type}_tracks_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta a PDF capturando los gráficos y datos de la página
 */
export async function exportToPDF(
  data: ExportData,
  pageElementId: string = "export-content",
): Promise<void> {
  try {
    // Crear un elemento temporal para el PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Función para agregar nueva página si es necesario
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Encabezado con imagen y nombre
    if (data.imageUrl) {
      try {
        const img = await loadImage(data.imageUrl);
        const imgSize = 40;
        pdf.addImage(img, "JPEG", margin, yPosition, imgSize, imgSize);
        yPosition += imgSize + 10;
      } catch (error) {
        console.error("Error loading image:", error);
        yPosition += 10;
      }
    }

    // Título
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.name, margin, yPosition);
    yPosition += 10;

    // Tipo
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(128, 128, 128);
    pdf.text(data.type === "artist" ? "Artista" : "Playlist", margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 15;

    // Información adicional
    pdf.setFontSize(10);
    if (data.type === "artist" && data.artist) {
      checkNewPage(20);
      pdf.text(`Seguidores: ${data.artist.followers.total.toLocaleString()}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Popularidad: ${data.artist.popularity}/100`, margin, yPosition);
      yPosition += 6;
      if (data.artist.genres.length > 0) {
        pdf.text(`Géneros: ${data.artist.genres.slice(0, 3).join(", ")}`, margin, yPosition);
        yPosition += 6;
      }
    } else if (data.type === "playlist" && data.playlist) {
      checkNewPage(20);
      if (data.playlist.followers) {
        pdf.text(`Seguidores: ${data.playlist.followers.total.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
      }
      pdf.text(`Canciones: ${data.tracks.length}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Por: ${data.playlist.owner.display_name}`, margin, yPosition);
      yPosition += 6;
    }

    yPosition += 10;

    // Tabla de tracks
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Canciones", margin, yPosition);
    yPosition += 8;

    // Encabezados de tabla
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    const tableHeaders = ["#", "Nombre", "Artista", "Popularidad"];
    const colWidths = [10, 70, 60, 30];
    let xPosition = margin;

    tableHeaders.forEach((header, index) => {
      pdf.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += 6;

    // Línea separadora
    pdf.setLineWidth(0.1);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // Filas de tabla
    pdf.setFont("helvetica", "normal");
    const maxRowsPerPage = Math.floor((pageHeight - yPosition - margin - 10) / 6);
    const rowsToShow = Math.min(data.tracks.length, 100); // Limitar a 100 tracks para no hacer el PDF muy grande

    for (let i = 0; i < rowsToShow; i++) {
      checkNewPage(6);
      const track = data.tracks[i];
      xPosition = margin;

      // Número
      pdf.text((i + 1).toString(), xPosition, yPosition);
      xPosition += colWidths[0];

      // Nombre (truncar si es muy largo)
      const trackName = pdf.splitTextToSize(track.name, colWidths[1] - 2);
      pdf.text(trackName[0] || track.name, xPosition, yPosition);
      xPosition += colWidths[1];

      // Artista
      const artistName = track.artists.map((a) => a.name).join(", ");
      const artistText = pdf.splitTextToSize(artistName, colWidths[2] - 2);
      pdf.text(artistText[0] || artistName, xPosition, yPosition);
      xPosition += colWidths[2];

      // Popularidad
      pdf.text(track.popularity.toString(), xPosition, yPosition);

      yPosition += 6;
    }

    if (data.tracks.length > rowsToShow) {
      checkNewPage(10);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`... y ${data.tracks.length - rowsToShow} canciones más`, margin, yPosition);
      pdf.setTextColor(0, 0, 0);
    }

    // Fecha de exportación
    checkNewPage(10);
    yPosition = pageHeight - margin;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Exportado el ${new Date().toLocaleDateString("es-ES")} desde Music Data Explorer`,
      margin,
      yPosition,
    );

    // Descargar PDF
    pdf.save(`${data.name.replace(/[^a-z0-9]/gi, "_")}_${data.type}_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Error al generar el PDF. Por favor, intenta de nuevo.");
  }
}

/**
 * Carga una imagen desde una URL (para usar en PDF)
 */
function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener contexto del canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Error al cargar la imagen"));
    img.src = url;
  });
}

