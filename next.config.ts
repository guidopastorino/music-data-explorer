import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        protocol: "https",
        hostname: "wrapped-images.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com",
      },
    ],
    // Aumentar timeout para imágenes remotas
    minimumCacheTTL: 60,
    // Configurar timeout más largo para descargas de imágenes
    dangerouslyAllowSVG: false,
  },
  // Aumentar timeout general para peticiones de imágenes
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
