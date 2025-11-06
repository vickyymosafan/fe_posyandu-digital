# Komponen Lansia

## Overview

Folder ini berisi komponen-komponen yang terkait dengan manajemen data lansia. Komponen-komponen ini dirancang untuk dapat digunakan kembali (reusable) di berbagai halaman.

## Components

### LansiaListContent

Komponen shared untuk menampilkan daftar lansia dengan fitur search.

**Features:**
- ✅ Tabel daftar lansia dengan informasi lengkap
- ✅ Search bar dengan debounce (500ms)
- ✅ Loading state saat fetch data
- ✅ Empty state dengan pesan yang jelas
- ✅ Navigate ke detail lansia
- ✅ Responsive design
- ✅ Accessibility compliant

**Usage:**

```tsx
import { LansiaListContent } from '@/components/lansia';

export default function MyPage() {
  return (
    <Layout>
      <LansiaListContent />
    </Layout>
  );
}
```

**Design Principles:**
- **SRP**: Component hanya untuk presentasi
- **DIP**: Depends on useLansiaList hook abstraction
- **Composition**: Compose dari UI components yang sudah ada
- **DRY**: Dapat digunakan di halaman Admin dan Petugas

## Custom Hook

### useLansiaList

Custom hook untuk mengelola data lansia dan search functionality.

**Location:** `lib/hooks/useLansiaList.ts`

**Features:**
- Fetch semua data lansia
- Search dengan minimal 3 karakter
- Debounce search untuk menghindari terlalu banyak API calls
- Loading dan error states
- Refetch function

**API:**

```typescript
interface UseLansiaListReturn {
  lansia: (Lansia | MinimalLansia)[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  isSearching: boolean;
  handleSearch: (query: string) => void;
  refetch: () => Promise<void>;
}
```

**Usage:**

```tsx
import { useLansiaList } from '@/lib/hooks/useLansiaList';

function MyComponent() {
  const { lansia, isLoading, handleSearch } = useLansiaList();
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading ? <Loading /> : <List data={lansia} />}
    </div>
  );
}
```

## Pages

### Admin: /admin/lansia

Halaman daftar lansia untuk Admin.

**Features:**
- View daftar lansia
- Search lansia
- Navigate ke detail

### Petugas: /petugas/lansia

Halaman daftar lansia untuk Petugas.

**Features:**
- View daftar lansia
- Search lansia
- Navigate ke detail
- Tombol "Daftar Lansia Baru"

## Integration dengan Backend

### API Endpoints

1. **GET /lansia**
   - Fetch semua lansia
   - Response: `{ data: Lansia[] }`

2. **POST /find**
   - Search lansia dengan query
   - Body: `{ query: string }`
   - Response: `{ data: MinimalLansia[] }`

### Data Flow

```
User Input → handleSearch → Debounce (500ms) → API Call
                                              ↓
                                    Update lansia state
                                              ↓
                                    Re-render table
```

## Search Functionality

### Behavior

- **< 3 karakter**: Tampilkan semua lansia (fetch all)
- **≥ 3 karakter**: Trigger search API dengan debounce 500ms
- **Debounce**: Menghindari terlalu banyak API calls saat user mengetik

### Search Fields

Backend akan mencari di field:
- ID Lansia (kode)
- Nama
- NIK

## Responsive Design

### Breakpoints

- **Mobile (<640px)**: 
  - Search bar full width
  - Table dengan horizontal scroll
  - Header stack vertically
  
- **Tablet (640px-1024px)**: 
  - Search bar dengan padding
  - Table dengan optimal spacing
  
- **Desktop (>1024px)**: 
  - Full layout dengan max-width
  - Optimal spacing dan padding

### Touch Targets

- Semua buttons minimum 44x44px
- Adequate spacing antar interactive elements
- Search input dengan padding yang cukup

## Accessibility

### Keyboard Navigation

- Tab untuk navigate antar elements
- Enter untuk submit search
- Enter/Space untuk activate buttons

### ARIA Labels

- Search input dengan label yang jelas
- Table dengan proper semantic HTML
- Buttons dengan descriptive aria-label

### Screen Reader Support

- Semantic HTML structure
- Descriptive text untuk status (searching, results count)
- Loading states dengan proper announcements

## Error Handling

### Network Errors

- Tampilkan notifikasi error
- Error message dalam bahasa Indonesia
- Retry dengan refetch function

### Empty States

- **No search results**: "Tidak ada lansia ditemukan"
- **No data**: "Belum ada lansia terdaftar"
- Pesan yang jelas dan actionable

## Performance Optimization

### Debounce

Search di-debounce 500ms untuk menghindari:
- Terlalu banyak API calls
- Network congestion
- Poor user experience

### Loading States

- Skeleton UI untuk initial load
- Spinner untuk search
- Disable input saat loading

## Future Enhancements

- [ ] Pagination untuk large datasets
- [ ] Sort by column (nama, tanggal lahir, dll)
- [ ] Filter by gender
- [ ] Export data ke CSV/Excel
- [ ] Bulk actions
- [ ] Advanced search dengan multiple filters

## Related Files

- `lib/api/lansia.ts` - API client untuk lansia endpoints
- `lib/hooks/useLansiaList.ts` - Custom hook untuk data management
- `lib/utils/formatters.ts` - Utilities untuk format date dan umur
- `components/ui/Table.tsx` - Reusable table component
- `components/ui/Input.tsx` - Reusable input component
- `types/index.ts` - TypeScript type definitions

## Maintainers

- Frontend Team
- Last Updated: 2025-11-06
