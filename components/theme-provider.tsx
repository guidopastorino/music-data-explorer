"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      storageKey="music-data-explorer-theme"
      defaultTheme="system"
      attribute="class"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}