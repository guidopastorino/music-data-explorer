export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12 lg:p-16">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Descubre insights sobre tu música favorita
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Explora datos interesantes sobre artistas, playlists y álbumes usando la API de Spotify.
          Analiza duraciones, géneros, popularidad y más.
        </p>
      </div>
    </div>
  );
}

