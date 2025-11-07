import { MetadataRoute } from 'next';

/**
 * PWA Manifest Configuration
 *
 * File ini mendefinisikan metadata untuk Progressive Web App.
 * Manifest ini memungkinkan aplikasi untuk diinstall di perangkat pengguna.
 *
 * @returns Manifest object sesuai spesifikasi Web App Manifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Posyandu Lansia',
    short_name: 'Posyandu',
    description: 'Aplikasi Posyandu untuk manajemen data lansia dan pemeriksaan kesehatan',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#171717',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
