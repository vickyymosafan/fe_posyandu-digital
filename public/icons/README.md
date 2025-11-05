# PWA Icons

Folder ini berisi icon untuk Progressive Web App (PWA).

## Requirements

Aplikasi memerlukan 2 ukuran icon:

1. **icon-192x192.png** - Icon ukuran 192x192 pixel
2. **icon-512x512.png** - Icon ukuran 512x512 pixel

## Format

- Format: PNG
- Background: Sebaiknya solid color atau transparent
- Design: Logo atau icon yang merepresentasikan aplikasi Posyandu Lansia

## Cara Membuat Icon

### Opsi 1: Menggunakan Design Tool

1. Buat design di Figma, Adobe Illustrator, atau Canva
2. Export sebagai PNG dengan ukuran 512x512px
3. Resize untuk membuat versi 192x192px
4. Simpan kedua file di folder ini

### Opsi 2: Menggunakan Online Tool

Gunakan tool online seperti:
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)

### Opsi 3: Menggunakan Script Generator

Jalankan script berikut untuk generate placeholder icon:

```bash
npm run generate:icons
```

## Placeholder Icons

Saat ini folder ini berisi placeholder icons. Ganti dengan icon asli aplikasi Anda sebelum deployment ke production.

## Testing

Setelah menambahkan icons, test PWA dengan:

1. Build aplikasi: `npm run build`
2. Start production server: `npm start`
3. Buka di browser dan cek manifest di DevTools
4. Test install PWA di mobile device

## Checklist

- [ ] Icon 192x192px sudah dibuat
- [ ] Icon 512x512px sudah dibuat
- [ ] Icons sudah ditest di berbagai device
- [ ] Icons terlihat jelas dan tidak blur
- [ ] Background color sesuai dengan theme aplikasi
