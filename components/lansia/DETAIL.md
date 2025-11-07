# Lansia Detail Feature

## Overview

Fitur detail lansia menampilkan informasi lengkap lansia beserta riwayat pemeriksaan dan grafik tren kesehatan.

## Architecture

### Components

```
LansiaDetailContent (Composition Root)
├── Card (Personal Info)
│   └── InfoRow (Label-Value Display) [NEW]
└── PemeriksaanHistoryTable (History Display)
    ├── Desktop: Table View
    └── Mobile: Card View [IMPROVED]

GrafikTrenContent (Separate Page)
└── HealthTrendCharts (Trend Visualization)
    ├── BMI Chart
    ├── Tekanan Darah Chart
    └── Gula Darah Chart
```

**Note**: 
- Grafik tren kesehatan telah dipisahkan ke halaman terpisah untuk meningkatkan maintainability
- InfoRow component ditambahkan untuk DRY principle
- PemeriksaanHistoryTable sekarang adaptive (table di desktop, card di mobile)

### Data Flow

```
Page Component
    ↓
useLansiaDetail Hook (Data Fetching)
    ↓
LansiaDetailContent (Presentation)
    ↓
Sub-components (Specialized Display)
```

## Design Principles Applied

### SOLID Principles

1. **SRP (Single Responsibility Principle)**
   - `useLansiaDetail`: Hanya bertanggung jawab untuk data fetching
   - `LansiaDetailContent`: Hanya untuk layout personal info dan tabel
   - `GrafikTrenContent`: Hanya untuk layout grafik
   - `PemeriksaanHistoryTable`: Hanya untuk display tabel
   - `HealthTrendCharts`: Hanya untuk display charts

2. **OCP (Open/Closed Principle)**
   - `LansiaDetailContent` extensible via `showActions` prop
   - Dapat menambah chart baru tanpa ubah existing code

3. **LSP (Liskov Substitution Principle)**
   - Component dapat digunakan di Admin dan Petugas page
   - Behavior konsisten dengan atau tanpa actions

4. **ISP (Interface Segregation Principle)**
   - Props interface minimal dan focused
   - Hook return type hanya yang diperlukan

5. **DIP (Dependency Inversion Principle)**
   - Page components depend on hook abstraction
   - Components tidak langsung call API

### Design Principles

1. **SoC (Separation of Concerns)**
   - Data fetching: `useLansiaDetail` hook
   - Data transformation: `chartData` utilities
   - UI presentation: Components
   - Business logic: Utilities (klasifikasi, formatters)

2. **DRY (Don't Repeat Yourself)**
   - Reuse existing formatters (formatDate, formatBMI, dll)
   - Reuse existing UI components (Card, Button, Loading)
   - Reuse existing utilities (klasifikasi functions)

3. **KISS (Keep It Simple, Stupid)**
   - Straightforward data fetching
   - Simple chart rendering
   - Clear component hierarchy

4. **YAGNI (You Aren't Gonna Need It)**
   - Hanya implement fitur yang diminta (Task 17)
   - Tidak ada extra features

5. **Composition Over Inheritance**
   - `LansiaDetailContent` compose dari sub-components
   - Tidak ada class inheritance

## Components

### useLansiaDetail Hook

**Location**: `lib/hooks/useLansiaDetail.ts`

**Responsibilities**:
- Fetch lansia data by kode
- Fetch pemeriksaan history
- Handle loading and error states
- Provide refetch functionality

**Usage**:
```tsx
const { lansia, pemeriksaan, isLoading, error, refetch } = useLansiaDetail(kode);
```

### InfoRow Component

**Location**: `components/lansia/InfoRow.tsx`

**Responsibilities**:
- Display label-value pair dalam format konsisten
- Support custom value (ReactNode)
- Support full width layout
- Responsive typography

**Principles Applied**:
- **SRP**: Hanya bertanggung jawab untuk display label-value pair
- **OCP**: Extensible via props tanpa modifikasi internal
- **DRY**: Menghindari duplikasi pattern label-value
- **KISS**: Implementasi sederhana dan mudah dipahami

**Props**:
- `label`: Label yang ditampilkan (string)
- `value`: Value yang ditampilkan (ReactNode)
- `fullWidth`: Span full width di grid (boolean, default: false)
- `className`: Custom className untuk styling tambahan (string, optional)

**Usage**:
```tsx
// Basic
<InfoRow label="NIK" value={lansia.nik} />

// With complex value
<InfoRow 
  label="Tanggal Lahir" 
  value={
    <>
      {formatDate(lansia.tanggalLahir)}
      <span className="text-neutral-600 ml-2">
        ({formatUmur(lansia.tanggalLahir)})
      </span>
    </>
  } 
/>

// Full width
<InfoRow label="Alamat" value={lansia.alamat} fullWidth />
```

### LansiaDetailContent Component

**Location**: `components/lansia/LansiaDetailContent.tsx`

**Responsibilities**:
- Orchestrate layout dan composition dari sub-komponen
- Handle navigation actions
- Compose InfoRow dan PemeriksaanHistoryTable
- Responsive layout untuk semua device

**Principles Applied**:
- **SRP**: Fokus pada orchestration, detail rendering di-delegate ke InfoRow
- **OCP**: Extensible via props (showActions, grafikUrl)
- **DRY**: Menggunakan InfoRow untuk menghindari duplikasi pattern
- **Composition**: Build UI dari komponen kecil yang reusable

**Props**:
- `lansia`: Lansia data
- `pemeriksaan`: Array of pemeriksaan
- `showActions`: Boolean untuk show/hide action buttons
- `grafikUrl`: URL untuk halaman grafik (optional)

**Responsive Features**:
- Header: Stack di mobile, horizontal di tablet+
- Grid: 1 column mobile, 2 columns tablet+
- Buttons: Full width mobile, auto width tablet+
- Spacing: Adaptive spacing untuk berbagai device

**Usage**:
```tsx
<LansiaDetailContent
  lansia={lansia}
  pemeriksaan={pemeriksaan}
  showActions={true} // Petugas
  grafikUrl={`/petugas/lansia/${kode}/grafik`}
/>
```

### GrafikTrenContent Component

**Location**: `components/lansia/GrafikTrenContent.tsx`

**Responsibilities**:
- Display health trend charts
- Show back navigation
- Handle empty state

**Props**:
- `lansiaKode`: Kode lansia untuk navigasi
- `lansiaNama`: Nama lansia untuk display
- `pemeriksaan`: Array of pemeriksaan data
- `months`: Number of months to show (default: 6)
- `backUrl`: URL untuk tombol kembali

**Usage**:
```tsx
<GrafikTrenContent
  lansiaKode={lansia.kode}
  lansiaNama={lansia.nama}
  pemeriksaan={pemeriksaan}
  months={6}
  backUrl={`/petugas/lansia/${kode}`}
/>
```

### PemeriksaanHistoryTable Component

**Location**: `components/lansia/PemeriksaanHistoryTable.tsx`

**Responsibilities**:
- Display pemeriksaan data dengan format yang sesuai per device
- Table view untuk desktop/tablet
- Card view untuk mobile
- Show empty state when no data

**Principles Applied**:
- **SRP**: Fokus pada display pemeriksaan data
- **Responsive Design**: Adaptive layout (table vs card)
- **DRY**: Reuse formatting utilities
- **KISS**: Simple conditional rendering

**Props**:
- `pemeriksaan`: Array of pemeriksaan data

**Features**:
- **Desktop/Tablet (≥768px)**: Table view dengan horizontal scroll
- **Mobile (<768px)**: Card view dengan grid layout
- Color-coded categories (Krisis Hipertensi = red, Hipertensi = orange)
- Empty state handling
- Responsive typography dan spacing

**Mobile Card Layout**:
- Tanggal di header
- BMI dan Tekanan Darah dalam 2-column grid
- Kolesterol dan Asam Urat dalam 2-column grid
- Gula Darah full width di bawah (jika ada data)

### HealthTrendCharts Component

**Location**: `components/lansia/HealthTrendCharts.tsx`

**Responsibilities**:
- Display BMI trend chart
- Display tekanan darah trend chart (sistolik & diastolik)
- Display gula darah trend chart (GDP, GDS, 2JPP)
- Show empty state when no data
- Responsive charts

**Props**:
- `pemeriksaan`: Array of pemeriksaan data
- `months`: Number of months to show (default: 6)

**Features**:
- Filter data untuk N bulan terakhir
- Responsive charts dengan ResponsiveContainer
- Multiple lines untuk tekanan darah dan gula darah
- Empty state handling

## Utilities

### chartData.ts

**Location**: `lib/utils/chartData.ts`

**Functions**:
- `filterLastMonths`: Filter pemeriksaan dalam N bulan terakhir
- `transformToBMIChartData`: Transform data untuk BMI chart
- `transformToTekananDarahChartData`: Transform data untuk tekanan darah chart
- `transformToGulaDarahChartData`: Transform data untuk gula darah chart
- `hasChartData`: Check apakah ada data untuk chart

## Routes

### Petugas Routes

**Detail Path**: `/petugas/lansia/[kode]`

**Features**:
- Display lansia detail
- Show "Input Pemeriksaan Baru" button
- Show "Lihat Grafik Tren" button
- Navigate to pemeriksaan form

**Grafik Path**: `/petugas/lansia/[kode]/grafik`

**Features**:
- Display health trend charts
- Show back navigation
- Responsive charts

### Admin Routes

**Detail Path**: `/admin/lansia/[kode]`

**Features**:
- Display lansia detail (read-only)
- Show "Lihat Grafik Tren" button
- No action buttons for input

**Grafik Path**: `/admin/lansia/[kode]/grafik`

**Features**:
- Display health trend charts (read-only)
- Show back navigation
- Responsive charts

## Integration with Backend

### API Endpoints Used

1. **GET /lansia/:kode**
   - Fetch lansia data by kode
   - Returns: Lansia object

2. **GET /lansia/:kode/pemeriksaan**
   - Fetch pemeriksaan history
   - Returns: Array of Pemeriksaan

### Data Flow

```
Frontend                    Backend
--------                    -------
useLansiaDetail
    ↓
lansiaAPI.getByKode    →   GET /lansia/:kode
    ↓                       ↓
lansiaAPI.getPemeriksaan → GET /lansia/:kode/pemeriksaan
    ↓
LansiaDetailContent
```

## Responsive Design

### Mobile (<640px)
- Personal info: 1 column grid
- Header: Stacked layout (nama + button vertical)
- Buttons: Full width
- Table: Card view dengan grid layout
- Typography: Smaller font sizes (text-xl, text-xs)
- Spacing: Tighter spacing (space-y-6, gap-4)
- Charts: Full width, stacked vertically

### Tablet (640px - 768px)
- Personal info: 2 column grid
- Header: Horizontal layout (nama + button side-by-side)
- Buttons: Auto width
- Table: Transition to table view
- Typography: Standard font sizes (text-2xl, text-sm)
- Spacing: Standard spacing (space-y-8, gap-6)
- Charts: Full width, stacked vertically

### Desktop (>768px)
- Personal info: 2 column grid
- Header: Horizontal layout with proper spacing
- Buttons: Auto width
- Table: Full table view
- Typography: Standard font sizes
- Spacing: Standard spacing
- Charts: Full width, stacked vertically

### Breakpoints Used
- `sm:` - 640px (mobile to tablet)
- `md:` - 768px (tablet to desktop)

## Accessibility

- Proper labels untuk form fields
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Color contrast compliance

## Error Handling

- Loading state dengan skeleton UI
- Error state dengan retry button
- Empty state untuk no data
- User-friendly error messages dalam bahasa Indonesia

## Testing Checklist

### Detail Page
- [ ] Fetch lansia data berhasil
- [ ] Fetch pemeriksaan history berhasil
- [ ] Display personal info correctly dengan InfoRow
- [ ] Display pemeriksaan table correctly (desktop)
- [ ] Display pemeriksaan card correctly (mobile)
- [ ] Button "Lihat Grafik Tren" muncul jika ada data
- [ ] Navigation ke pemeriksaan form (Petugas)
- [ ] Navigation ke halaman grafik
- [ ] Loading state
- [ ] Error state dengan retry
- [ ] Responsive design di berbagai device:
  - [ ] Mobile (<640px): Card view, stacked buttons, 1 col grid
  - [ ] Tablet (640-768px): Table view, horizontal buttons, 2 col grid
  - [ ] Desktop (>768px): Table view, optimal spacing
- [ ] Typography responsive (text sizes adjust per breakpoint)
- [ ] Spacing responsive (gaps adjust per breakpoint)
- [ ] Buttons full width di mobile, auto width di tablet+
- [ ] Long text breaks properly (alamat, nama)

### Grafik Page
- [ ] Fetch lansia data berhasil
- [ ] Display charts correctly
- [ ] Empty state untuk no pemeriksaan
- [ ] Loading state
- [ ] Error state dengan retry
- [ ] Back navigation berfungsi
- [ ] Responsive charts di berbagai device
- [ ] Accessibility compliance

## Future Enhancements (Optional)

- Export pemeriksaan history ke PDF
- Print functionality
- Filter pemeriksaan by date range
- Compare multiple pemeriksaan
- Add notes to pemeriksaan
