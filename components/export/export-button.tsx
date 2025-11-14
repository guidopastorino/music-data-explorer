"use client";

import { useState } from "react";
import { Download, FileText, FileJson, Table2 as FileCsv, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exportToPDF, exportToJSON, exportToCSV } from "@/lib/utils/export";
import type { SpotifyArtist, SpotifyTrack, SpotifyPlaylist } from "@/lib/api/spotify";

interface ExportButtonProps {
  type: "artist" | "playlist";
  name: string;
  imageUrl?: string;
  artist?: SpotifyArtist;
  playlist?: SpotifyPlaylist;
  tracks: SpotifyTrack[];
}

export function ExportButton({
  type,
  name,
  imageUrl,
  artist,
  playlist,
  tracks,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "json" | "csv" | null>(null);

  const handleExport = async (format: "pdf" | "json" | "csv") => {
    if (tracks.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    setIsExporting(true);
    setExportType(format);

    try {
      const exportData = {
        type,
        name,
        imageUrl,
        artist,
        playlist,
        tracks,
      };

      switch (format) {
        case "pdf":
          await exportToPDF(exportData);
          break;
        case "json":
          exportToJSON(exportData);
          break;
        case "csv":
          exportToCSV(exportData);
          break;
      }

      // Pequeño delay para mostrar el feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error exporting:", error);
      alert(error instanceof Error ? error.message : "Error al exportar los datos");
    } finally {
      setIsExporting(false);
      setExportType(null);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="fixed bottom-24 right-6 z-40 size-14 rounded-full shadow-lg hover:shadow-xl cursor-pointer"
              aria-label="Exportar datos"
              disabled={tracks.length === 0}
            >
              <Download className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="hidden sm:inline-flex">
          <p>Exportar datos de {name}</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <Download className="size-5 text-primary shrink-0" />
            <span className="wrap-break-word">Exportar Datos</span>
          </DialogTitle>
          <DialogDescription className="wrap-break-word">
            Elige el formato para exportar los datos de{" "}
            <span className="font-semibold text-foreground wrap-break-word">{name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 cursor-pointer overflow-hidden"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                {isExporting && exportType === "pdf" ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <FileText className="size-5 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold wrap-break-word">PDF</p>
                <p className="hidden sm:block text-sm text-muted-foreground wrap-break-word">
                  Documento con imagen, información y lista de canciones
                </p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 cursor-pointer overflow-hidden"
            onClick={() => handleExport("json")}
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                {isExporting && exportType === "json" ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <FileJson className="size-5 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold wrap-break-word">JSON</p>
                <p className="hidden sm:block text-sm text-muted-foreground wrap-break-word">
                  Datos estructurados en formato JSON
                </p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4 cursor-pointer overflow-hidden"
            onClick={() => handleExport("csv")}
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full min-w-0">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                {isExporting && exportType === "csv" ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <FileCsv className="size-5 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold wrap-break-word">CSV</p>
                <p className="hidden sm:block text-sm text-muted-foreground wrap-break-word">
                  Hoja de cálculo con lista de canciones
                </p>
              </div>
            </div>
          </Button>
        </div>

        {tracks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            No hay datos disponibles para exportar
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

