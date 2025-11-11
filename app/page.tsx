'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [email, setEmail] = useState("")

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 transition-colors">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Demo de componentes shadcn/ui</h1>
          <p className="text-muted-foreground text-sm">
            Ejemplo simple que combina los componentes instalados en un formulario interactivo.
          </p>
        </header>

        <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="persona@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => alert(`Enviando a ${email || "destinatario desconocido"}`)}>
                Enviar
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Acciones rápidas
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Preferencias</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setEmail("")}>
                    Limpiar formulario
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                    Guardar como borrador
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}