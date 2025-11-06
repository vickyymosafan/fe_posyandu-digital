# Pencarian Lansia

Dokumentasi untuk fitur pencarian lansia.

## Arsitektur

Implementasi mengikuti prinsip SOLID dan Separation of Concerns:

### 1. Hook Layer (`useLansiaList`)
**Tanggung Jawab:**
- Mengelola state pencarian (query, loading, results)
- Handle search dengan debounce (500ms)
- Validasi minimal 3 karakter
- Integrasi dengan API

**Prinsip:**
- **SRP**: Hanya handle data management
- **DIP**: Depend on lansiaAPI abstraction
- **DRY**: Reuse untuk list dan search pages

### 2. Component Layer
**LansiaCard Component:**
- Display lansia info dalam card format
- Show ID, nama, tanggal lahir, umur, gender
- Tombol "Lihat Detail"

**SearchLansiaContent Component:**
- Search bar dengan autofocus
- Grid layout untuk cards (responsive)
- Loading state
- Empty states (belum search, tidak ditemukan)

**Prinsip:**
- **SRP**: Setiap component punya tanggung jawab spesifik
- **Composition**: Compose dari UI components
- **DRY**: Reuse useLansiaList hook

### 3. Page Layer (`app/petugas/lansia/cari/page.tsx`)
**Tanggung Jawab:**
- Layout dan routing
- Compose SearchLansiaContent

## Flow Pencarian

1. User membuka halaman pencarian
2. User mengetik di search bar (minimal 3 karakter)
3. Debounce 500ms sebelum trigger search
4. Call API `POST /find` dengan query
5. Display results dalam card grid
6. User klik "Lihat Detail" → navigate ke detail page

## Validasi

- **Minimal 3 karakter**: Mencegah terlalu banyak API calls
- **Debounce 500ms**: Menunggu user selesai mengetik
- **Auto-fetch all**: Jika query < 3 karakter, fetch semua data

## UI States

### 1. Initial State (Belum Search)
- Icon search
- Pesan: "Mulai Pencarian"
- Helper: "Ketik minimal 3 karakter untuk mencari lansia"

### 2. Loading State
- Spinner loading
- Disable search input

### 3. Empty State (Tidak Ditemukan)
- Icon sad face
- Pesan: "Tidak ada lansia ditemukan"
- Helper: "Coba gunakan kata kunci yang berbeda"

### 4. Results State
- Grid cards (1 col mobile, 2 cols tablet, 3 cols desktop)
- Setiap card menampilkan info lansia
- Counter: "Ditemukan X lansia"

## Responsive Design

### Mobile (< 768px)
- 1 column grid
- Full width cards
- Stack info vertically

### Tablet (768px - 1024px)
- 2 columns grid
- Balanced card layout

### Desktop (> 1024px)
- 3 columns grid
- Optimal viewing experience

## Integrasi Backend

### Endpoint
```
POST /find
```

### Request Body
```typescript
{
  query: string; // Search term
}
```

### Response
```typescript
{
  data: MinimalLansia[]; // Array of minimal lansia data
}
```

### MinimalLansia Type
```typescript
interface MinimalLansia {
  id: number;
  kode: string;
  nama: string;
  tanggalLahir: Date;
}
```

## Performance Optimization

### Debounce
- 500ms delay sebelum API call
- Mencegah excessive API requests
- Improve UX dengan menunggu user selesai mengetik

### Minimal Characters
- Require 3 karakter minimum
- Reduce unnecessary searches
- Better search accuracy

### Lazy Loading (Future Enhancement)
- Implement pagination untuk hasil banyak
- Load more on scroll
- Improve initial load time

## Accessibility

### Keyboard Navigation
- Search input auto-focus on page load
- Tab navigation untuk cards
- Enter untuk submit search

### Screen Reader
- Proper ARIA labels
- Semantic HTML
- Status announcements untuk search results

### Touch Targets
- Minimum 44x44px untuk buttons
- Adequate spacing antar cards
- Easy tap targets di mobile

## Testing Checklist

### Manual Testing
- [ ] Search dengan < 3 karakter → show helper message
- [ ] Search dengan ≥ 3 karakter → trigger API call
- [ ] Search dengan hasil → display cards
- [ ] Search tanpa hasil → show empty state
- [ ] Debounce working → tidak call API setiap keystroke
- [ ] Loading state → show spinner saat searching
- [ ] Click "Lihat Detail" → navigate ke detail page
- [ ] Responsive → test di mobile, tablet, desktop

### Edge Cases
- [ ] Search dengan special characters
- [ ] Search dengan angka saja
- [ ] Search dengan spasi
- [ ] Very long search query
- [ ] Network error handling
- [ ] Offline mode

## Maintenance

### Menambah Field di Card
1. Update LansiaCard component
2. Ensure data available dari API
3. Update responsive layout jika perlu

### Mengubah Debounce Duration
Edit `useLansiaList.ts`:
```typescript
const timeoutId = setTimeout(() => {
  searchLansia(query);
}, 500); // Change this value
```

### Mengubah Minimal Characters
Edit `useLansiaList.ts`:
```typescript
if (query.length < 3) { // Change this value
  await fetchAll();
  return;
}
```

## Troubleshooting

### Search Tidak Bekerja
**Symptom:** Tidak ada hasil muncul
**Solution:**
- Check backend API running
- Check network tab untuk API errors
- Verify query length ≥ 3 characters

### Debounce Terlalu Lambat/Cepat
**Symptom:** Search terlalu cepat/lambat respond
**Solution:**
- Adjust debounce duration di useLansiaList
- Balance antara UX dan API load

### Cards Tidak Responsive
**Symptom:** Layout broken di mobile/tablet
**Solution:**
- Check Tailwind breakpoints
- Verify grid-cols classes
- Test di berbagai screen sizes

## Future Enhancements

### Phase 2
- Advanced filters (gender, umur range)
- Sort options (nama, tanggal lahir, umur)
- Export search results
- Save search history

### Phase 3
- Voice search
- Barcode/QR code scanner untuk ID
- Bulk actions pada search results
- Search suggestions/autocomplete
