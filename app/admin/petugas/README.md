# Halaman Daftar Petugas (Admin)

## Overview

Halaman ini menampilkan daftar petugas yang terdaftar dalam sistem Posyandu Lansia. Hanya dapat diakses oleh pengguna dengan role **ADMIN**.

## Features

- ✅ Tampilkan tabel daftar petugas dengan informasi lengkap
- ✅ Tombol tambah petugas baru
- ✅ Tombol edit petugas
- ✅ Tombol aktifkan/nonaktifkan petugas dengan konfirmasi
- ✅ Loading state saat fetch data
- ✅ Empty state jika belum ada petugas
- ✅ Notifikasi sukses/error setelah operasi
- ✅ Responsive design untuk mobile dan desktop
- ✅ Accessibility compliant (keyboard navigation, ARIA labels)

## File Structure

```
app/admin/petugas/
├── page.tsx              # Main page component
└── README.md             # Documentation (this file)

lib/hooks/
└── usePetugasList.ts     # Custom hook untuk data management
```

## Design Principles

### SOLID Principles

1. **SRP (Single Responsibility Principle)**
   - `usePetugasList` hook: Bertanggung jawab untuk data fetching dan state management
   - `DaftarPetugasPage` component: Bertanggung jawab untuk presentasi dan orchestration
   - Setiap function memiliki satu tanggung jawab yang jelas

2. **OCP (Open/Closed Principle)**
   - Component dapat diperluas melalui props tanpa mengubah kode internal
   - Reusable UI components (Button, Table, Modal) dapat dikustomisasi melalui props

3. **LSP (Liskov Substitution Principle)**
   - UI components dapat diganti dengan variant lain tanpa mengubah behavior

4. **ISP (Interface Segregation Principle)**
   - Hook hanya expose interface yang diperlukan (petugas, isLoading, toggleStatus)
   - Tidak ada dependency yang tidak diperlukan

5. **DIP (Dependency Inversion Principle)**
   - Page component depends on `usePetugasList` hook abstraction
   - Hook depends on `petugasAPI` abstraction
   - Tidak ada direct dependency ke implementation details

### Design Principles

1. **SoC (Separation of Concerns)**
   - UI layer: `page.tsx` (presentasi)
   - Data layer: `usePetugasList.ts` (business logic)
   - API layer: `petugasAPI` (network calls)

2. **DRY (Don't Repeat Yourself)**
   - Reuse existing UI components (Button, Table, Modal, Loading)
   - Reuse existing utilities (formatDate, handleAPIError)
   - No code duplication

3. **KISS (Keep It Simple, Stupid)**
   - Straightforward implementation
   - Clear function names
   - Easy to understand code flow

4. **Composition Over Inheritance**
   - Compose page dari smaller components
   - No class inheritance, hanya functional components

## Component API

### usePetugasList Hook

```typescript
interface UsePetugasListReturn {
  petugas: Petugas[];           // Array of petugas data
  isLoading: boolean;           // Loading state
  error: string | null;         // Error message
  refetch: () => Promise<void>; // Manual refetch function
  toggleStatus: (id: number, currentStatus: boolean) => Promise<boolean>;
}
```

### DaftarPetugasPage Component

```typescript
export default function DaftarPetugasPage(): JSX.Element
```

## Integration dengan Backend

### API Endpoints

1. **GET /petugas**
   - Fetch semua petugas
   - Response: `{ data: Petugas[] }`

2. **PATCH /petugas/:id/status**
   - Update status petugas (aktif/nonaktif)
   - Body: `{ aktif: boolean }`
   - Response: `{ data: Petugas }`

### Data Flow

```
User Action → Page Component → usePetugasList Hook → petugasAPI → Backend API
                    ↓                                      ↓
              UI Update ← Notification ← State Update ← Response
```

## Responsive Design

### Breakpoints

- **Mobile (<640px)**: Stack header elements vertically, horizontal scroll untuk table
- **Tablet (640px-1024px)**: Flex header dengan wrap, table dengan padding adjustment
- **Desktop (>1024px)**: Full layout dengan optimal spacing

### Touch Targets

- Semua buttons memiliki minimum size 44x44px untuk accessibility
- Adequate spacing antar interactive elements

## Accessibility

### Keyboard Navigation

- Tab untuk navigate antar elements
- Enter/Space untuk activate buttons
- Escape untuk close modal

### ARIA Labels

- Descriptive labels untuk semua buttons
- Modal dengan proper role dan aria-labelledby
- Table dengan proper semantic HTML

### Screen Reader Support

- Semantic HTML structure
- Descriptive text untuk status badges
- Loading states dengan proper announcements

## Usage Example

```typescript
// Halaman akan otomatis fetch data saat mount
// User dapat:
// 1. Klik "Tambah Petugas" → Navigate ke /admin/petugas/tambah
// 2. Klik "Edit" → Navigate ke /admin/petugas/edit/:id
// 3. Klik "Nonaktifkan/Aktifkan" → Show confirmation modal → Update status
```

## Error Handling

- Network errors: Tampilkan notifikasi error dengan pesan yang jelas
- Empty state: Tampilkan pesan dan tombol untuk tambah petugas pertama
- Loading state: Tampilkan spinner saat fetch data
- Validation errors: Handled di backend, ditampilkan sebagai notifikasi

## Future Enhancements

- [ ] Search/filter petugas by nama atau email
- [ ] Sort table by column
- [ ] Pagination untuk large datasets
- [ ] Bulk actions (activate/deactivate multiple petugas)
- [ ] Export data ke CSV/Excel

## Testing

### Manual Testing Checklist

- [ ] Halaman load dengan data petugas
- [ ] Loading state tampil saat fetch data
- [ ] Empty state tampil jika belum ada petugas
- [ ] Tombol "Tambah Petugas" navigate ke form tambah
- [ ] Tombol "Edit" navigate ke form edit dengan ID yang benar
- [ ] Tombol "Nonaktifkan" tampilkan modal konfirmasi
- [ ] Konfirmasi nonaktifkan berhasil update status dan tampilkan notifikasi
- [ ] Tombol "Aktifkan" tampilkan modal konfirmasi
- [ ] Konfirmasi aktifkan berhasil update status dan tampilkan notifikasi
- [ ] Modal dapat di-close dengan tombol "Batal" atau X
- [ ] Responsive design bekerja di mobile, tablet, dan desktop
- [ ] Keyboard navigation bekerja dengan baik
- [ ] Screen reader dapat membaca semua content

## Related Files

- `lib/api/petugas.ts` - API client untuk petugas endpoints
- `lib/hooks/usePetugasList.ts` - Custom hook untuk data management
- `components/ui/Table.tsx` - Reusable table component
- `components/ui/Modal.tsx` - Reusable modal component
- `components/ui/Button.tsx` - Reusable button component
- `components/layout/AdminLayout.tsx` - Layout untuk admin pages
- `types/index.ts` - TypeScript type definitions

## Maintainers

- Frontend Team
- Last Updated: 2025-11-06
