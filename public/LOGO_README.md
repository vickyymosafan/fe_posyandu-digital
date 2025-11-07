# Logo dan Icons - Posyandu Lansia

## Overview
Aplikasi ini menggunakan logo `posyandu-catatan.webp` sebagai logo utama yang dikonversi ke berbagai format dan ukuran untuk keperluan website dan PWA.

## File Logo

### Logo Utama
- **File**: `logo.webp`
- **Lokasi**: `public/logo.webp`
- **Sumber**: Diambil dari `posyandu-catatan.webp` di root project

### Generated Icons

#### Favicon
- **File**: `favicon.ico`
- **Ukuran**: 32x32 pixels
- **Lokasi**: `public/favicon.ico`
- **Penggunaan**: Browser tab icon

#### Apple Touch Icon
- **File**: `apple-touch-icon.png`
- **Ukuran**: 180x180 pixels
- **Lokasi**: `public/apple-touch-icon.png`
- **Penggunaan**: iOS home screen icon

#### PWA Icons
- **File**: `icon-192x192.png`
- **Ukuran**: 192x192 pixels
- **Lokasi**: `public/icons/icon-192x192.png`
- **Penggunaan**: PWA manifest icon (small)

- **File**: `icon-512x512.png`
- **Ukuran**: 512x512 pixels
- **Lokasi**: `public/icons/icon-512x512.png`
- **Penggunaan**: PWA manifest icon (large)

## Regenerate Icons

Jika logo perlu diupdate, ikuti langkah berikut:

1. Replace file `public/logo.webp` dengan logo baru
2. Jalankan script generate icons:
   ```bash
   cd frontend
   node scripts/generate-logo-icons.js
   ```
3. Semua icon akan di-generate ulang secara otomatis

## Script

Script untuk generate icons: `scripts/generate-logo-icons.js`

Script ini menggunakan `sharp` library untuk:
- Resize logo ke berbagai ukuran
- Convert format dari WebP ke PNG/ICO
- Maintain aspect ratio dengan transparent background

## Penggunaan di Aplikasi

### Metadata (layout.tsx)
```typescript
export const metadata: Metadata = {
  title: 'Posyandu Lansia',
  description: 'Aplikasi Posyandu untuk Lansia',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
```

### PWA Manifest (manifest.ts)
```typescript
icons: [
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
    purpose: 'maskable',
  },
]
```

### Header Component
Logo ditampilkan di header menggunakan:
```tsx
<img 
  src="/logo.webp" 
  alt="Posyandu Logo" 
  className="w-full h-full object-contain"
/>
```

## Notes

- Logo menggunakan format WebP untuk efisiensi ukuran file
- Icons di-generate dengan transparent background
- Aspect ratio logo dipertahankan saat resize
- Icons compatible dengan semua browser modern dan PWA requirements
