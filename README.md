<div align="center">
  <img src="./public/icons/apple-icon-180x180.png" alt="Music Data Explorer Icon" width="120" height="120">
</div>

<h1 align="center">Music Data Explorer</h1>

Una aplicación web full-stack que consume la API de Spotify para descubrir insights interesantes sobre artistas, playlists y canciones. Incluye visualizaciones interactivas y un generador de "fun facts" con inteligencia artificial.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## Descripción

Music Data Explorer es una aplicación web que permite a los usuarios explorar datos musicales de Spotify de manera interactiva. La aplicación ofrece:

- **Búsqueda de artistas y playlists** con resultados visuales
- **Análisis detallado** de artistas y playlists con gráficos interactivos
- **Insights automáticos** sobre duraciones, popularidad, géneros y más
- **Generador de fun facts** con IA usando Google Gemini
- **Visualizaciones interactivas** con Recharts
- **Interfaz moderna** con soporte para dark/light mode

## Características

### Búsqueda
- Búsqueda de artistas por nombre
- Búsqueda de playlists por nombre
- Resultados con información relevante (seguidores, popularidad, géneros)

### Análisis de Artistas
- Información detallada del artista (seguidores, popularidad, géneros)
- Gráfico de duración de canciones (bar chart)
- Gráfico de popularidad de canciones (line chart)
- Lista de top tracks con información detallada
- Insights automáticos sobre patrones y estadísticas

### Análisis de Playlists
- Información de la playlist (seguidores, número de canciones, creador)
- Gráficos de duración y popularidad de las canciones
- Insights específicos de playlist (artistas más frecuentes, duración promedio, etc.)
- Lista completa de canciones

### Fun Facts con IA
- Generación de datos curiosos sobre artistas y playlists
- Usa Google Gemini 2.5 (Lite, Flash, Pro) con sistema de fallback
- Cacheo inteligente para evitar llamadas excesivas a la API
- Interfaz con loading states y manejo de errores

## Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React con App Router
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles
- **Recharts 3.4** - Biblioteca de gráficos
- **Lucide React** - Iconos
- **next-themes** - Manejo de temas

### Backend
- **Next.js API Routes** - Endpoints del servidor
- **Axios** - Cliente HTTP
- **Spotify Web API** - API de música

### Estado y Datos
- **TanStack Query (React Query) 5.9** - Gestión de estado del servidor y cacheo
- **React Query DevTools** - Herramientas de desarrollo

### IA
- **Vercel AI SDK 5.0** - SDK para integración con modelos de IA
- **@ai-sdk/google 2.0** - Provider para Google Gemini

### Herramientas de Desarrollo
- **Biome** - Linter y formateador
- **TypeScript** - Compilador de tipos

## Estructura del Proyecto

```
wollen-fullstack/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (endpoints del servidor)
│   │   ├── fun-fact/       # Endpoint para generar fun facts con IA
│   │   └── spotify/        # Endpoints para búsqueda y datos de Spotify
│   ├── artist/[id]/        # Página dinámica de artista
│   ├── playlist/[id]/      # Página dinámica de playlist
│   ├── layout.tsx          # Layout raíz de la aplicación
│   ├── page.tsx            # Página principal (home)
│   ├── providers.tsx       # Providers de React Query y Theme
│   └── globals.css         # Estilos globales y variables CSS
│
├── components/             # Componentes React
│   ├── artist/             # Componentes específicos de artista
│   ├── playlist/           # Componentes específicos de playlist
│   ├── search/             # Componentes de búsqueda
│   ├── fun-fact/           # Componente de fun fact con IA
│   ├── ui/                 # Componentes UI de shadcn/ui
│   ├── navbar.tsx          # Barra de navegación
│   ├── theme-provider.tsx  # Provider de temas
│   └── theme-toggle.tsx    # Toggle de tema dark/light
│
├── lib/                    # Utilidades y lógica
│   ├── api/                # Clientes y endpoints de APIs
│   │   └── spotify/        # Cliente de Spotify, endpoints y tipos
│   └── utils/              # Funciones utilitarias
│
├── public/                 # Archivos estáticos
├── biome.json              # Configuración de Biome (linter y formateador)
├── .env.example            # Ejemplo de archivo de variables de entorno
├── components.json         # Configuración de componentes shadcn/ui

```
## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd wollen-fullstack
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno** (ver sección de Configuración)

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Spotify API
SPOTIFY_ACCESS_TOKEN=tu_access_token_de_spotify

# Google Gemini API
GEMINI_API_KEY=tu_api_key_de_gemini
```

### Obtener Credenciales

#### Spotify Access Token
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Obtén tu `client_id` y `client_secret` de la aplicación
4. Obtén un access token usando el siguiente comando curl:

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
```

**Nota:** El access token tiene una duración de **1 hora**. Después de ese tiempo, necesitarás generar un nuevo token usando el mismo comando.

Alternativamente, puedes seguir la guía oficial del [Client Credentials Flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow).

#### Google Gemini API Key
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key al archivo `.env.local`

## Documentación de APIs

### API Routes Internas

#### `GET /api/spotify/search`
Busca artistas en Spotify.

**Query Parameters:**
- `q` (string, requerido): Término de búsqueda
- `limit` (number, opcional): Número de resultados (default: 20)

**Ejemplo:**
```bash
GET /api/spotify/search?q=The%20Beatles&limit=10
```

#### `GET /api/spotify/search/playlists`
Busca playlists en Spotify.

**Query Parameters:**
- `q` (string, requerido): Término de búsqueda
- `limit` (number, opcional): Número de resultados (default: 20)

**Ejemplo:**
```bash
GET /api/spotify/search/playlists?q=rock&limit=10
```

#### `GET /api/spotify/artists/[id]`
Obtiene información detallada de un artista y sus top tracks.

**Path Parameters:**
- `id` (string): ID del artista en Spotify

**Ejemplo:**
```bash
GET /api/spotify/artists/4Z8W4fKeB5YxbusRsdQVPb
```

**Respuesta:**
```json
{
  "artist": {
    "id": "...",
    "name": "...",
    "followers": { "total": 123456 },
    "popularity": 85,
    "genres": ["rock", "pop"],
    ...
  },
  "topTracks": [...]
}
```

#### `GET /api/spotify/playlists/[id]`
Obtiene información detallada de una playlist.

**Path Parameters:**
- `id` (string): ID de la playlist en Spotify

**Ejemplo:**
```bash
GET /api/spotify/playlists/37i9dQZF1DXcBWIGoYBM5M
```

**Respuesta:**
```json
{
  "playlist": {
    "id": "...",
    "name": "...",
    "description": "...",
    "followers": { "total": 12345 },
    "tracks": {
      "total": 50,
      "items": [...]
    },
    ...
  }
}
```

#### `POST /api/fun-fact`
Genera un fun fact sobre un artista o playlist usando IA.

**Body:**
```json
{
  "type": "artist" | "playlist",
  "id": "spotify_id",
  "name": "Nombre del artista o playlist"
}
```

**Ejemplo:**
```bash
POST /api/fun-fact
Content-Type: application/json

{
  "type": "artist",
  "id": "4Z8W4fKeB5YxbusRsdQVPb",
  "name": "Radiohead"
}
```

**Respuesta:**
```json
{
  "funFact": "Radiohead lanzó su álbum 'In Rainbows' como descarga digital de pago voluntario en 2007..."
}
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Calidad de código
npm run lint         # Ejecuta Biome linter
npm run format       # Formatea el código con Biome
```

---

Este proyecto fue desarrollado como parte de un challenge de desarrollo full-stack de Wollen Labs. La aplicación demuestra la integración de APIs externas (Spotify), implementación de visualizaciones de datos interactivas, y el uso de inteligencia artificial para generar contenido dinámico. El objetivo es proporcionar una experiencia de usuario atractiva para explorar y descubrir insights interesantes sobre música.