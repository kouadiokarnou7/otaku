// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ Avatars Google / Firebase Auth
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // ✅ Firebase Storage (avatars uploadés)
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // ✅ Fallback avatar avec initiales
      },
    ],
    formats: ['image/webp', 'image/avif'], // 🎯 Optimisation automatique
    minimumCacheTTL: 60, // ⏱️ Cache 60s minimum pour les images externes
  },
  // Configuration pour les origines de développement
  experimental: {
    allowedDevOrigins: ['192.168.2.3'],
  },
};

export default nextConfig;