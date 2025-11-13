"use client";

import { useState } from "react";
import { Star, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface FunFactButtonProps {
  type: "artist" | "playlist";
  id: string;
  name: string;
}

async function generateFunFact(
  type: "artist" | "playlist",
  id: string,
  name: string,
): Promise<string> {
  const response = await fetch("/api/fun-fact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, id, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage =
      error.error ||
      (response.status === 503
        ? "El servicio está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos."
        : "Error al generar el fun fact");
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.funFact;
}

export function FunFactButton({ type, id, name }: FunFactButtonProps) {
  const queryClient = useQueryClient();
  const queryKey = ["fun-fact", type, id];
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: funFact,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<string>({
    queryKey,
    queryFn: () => generateFunFact(type, id, name),
    enabled: isOpen, // Solo ejecutar cuando el dialog está abierto
    staleTime: Infinity, // Cachear indefinidamente hasta que se resetee manualmente
    gcTime: Infinity, // Mantener en cache indefinidamente
  });

  const handleReset = () => {
    // Invalidar la query para forzar una nueva generación
    queryClient.invalidateQueries({ queryKey });
    refetch();
  };

  // Mostrar loading si está cargando inicialmente o si está haciendo refetch
  const showLoading = isLoading || isFetching;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg hover:shadow-xl cursor-pointer"
              aria-label="Generar fun fact"
            >
              <Sparkles className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="hidden sm:inline-flex">
          <p>Generar fun fact sobre {name}</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Fun Fact
          </DialogTitle>
          <DialogDescription>
            {type === "artist" ? "Dato curioso sobre" : "Dato curioso sobre la playlist"}{" "}
            <span className="font-semibold text-foreground">{name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[120px] pt-4">
          {showLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Generando fun fact...
              </p>
            </div>
          )}

          {error && !showLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  {error instanceof Error
                    ? error.message.includes("sobrecargado") ||
                      error.message.includes("overloaded")
                      ? "Servicio temporalmente no disponible"
                      : "Error al generar el fun fact"
                    : "Error desconocido"}
                </p>
                {error instanceof Error && (
                  <p className="text-xs text-muted-foreground">
                    {error.message.includes("sobrecargado") ||
                    error.message.includes("overloaded")
                      ? "El servicio de Gemini está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos."
                      : error.message}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="cursor-pointer"
              >
                <RefreshCw className="mr-2 size-4" />
                Reintentar
              </Button>
            </div>
          )}

          {funFact && !showLoading && !error && (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-foreground">
                {funFact}
              </p>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="cursor-pointer"
                >
                  <RefreshCw className="mr-2 size-4" />
                  Generar otro
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

