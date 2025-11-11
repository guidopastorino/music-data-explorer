"use client"

import { useEffect, useMemo, useState } from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

type ThemeOption = "light" | "dark" | "system"

const themeOrder: ThemeOption[] = ["light", "dark", "system"]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const activeTheme: ThemeOption = useMemo(() => {
    if (!mounted) return "system"
    return themeOrder.includes(theme as ThemeOption)
      ? (theme as ThemeOption)
      : "system"
  }, [mounted, theme])

  const nextTheme = useMemo(() => {
    const currentIndex = themeOrder.indexOf(activeTheme)
    return themeOrder[(currentIndex + 1) % themeOrder.length]
  }, [activeTheme])

  const icon = useMemo(() => {
    const size = "size-5"
    switch (activeTheme) {
      case "light":
        return <Sun className={size} />
      case "dark":
        return <Moon className={size} />
      default:
        return <Laptop className={size} />
    }
  }, [activeTheme])

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Cambiar tema, modo actual: ${activeTheme}`}
      title={`Cambiar tema (actual: ${activeTheme})`}
    >
      {mounted ? icon : null}
      <span className="sr-only">Cambiar tema de color</span>
    </Button>
  )
}

