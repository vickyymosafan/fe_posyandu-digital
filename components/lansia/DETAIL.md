# Lansia Detail Feature

## Overview

Fitur detail lansia menampilkan informasi lengkap lansia beserta riwayat pemeriksaan dan grafik tren kesehatan.

## Architecture

### Components

```
LansiaDetailContent (Composition Root)
├── Card (Personal Info)
├── PemeriksaanHistoryTable (History Display)
└── HealthTrendCharts (Trend Visualization)
    ├── BMI Chart
    ├── Tekanan Darah Chart
    └── Gula Darah Chart
```

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
   - `LansiaDetailContent`: Hanya untuk layout dan composition
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

### LansiaDetailContent Component

**Location**: `components/lansia/LansiaDetailContent.tsx`

**Responsibilities**:
- Display personal information card
- Compose PemeriksaanHistoryTable and HealthTrendCharts
- Show action buttons based on role

**Props**:
- `lansia`: Lansia data
- `pemeriksaan`: Array of pemeriksaan
- `showActions`: Boolean untuk show/hide action buttons

**Usage**:
```tsx
<LansiaDetailContent
  lansia={lansia}
  pemeriksaan={pemeriksaan}
  showActions={true} // Petugas
/>
```

### PemeriksaanHistoryTable Component

**Location**: `components/lansia/PemeriksaanHistoryTable.tsx`

**Responsibilities**:
- Display pemeriksaan data in table format
- Responsive table with horizontal scroll on mobile
- Show empty state when no data

**Props**:
- `pemeriksaan`: Array of pemeriksaan data

**Features**:
- Responsive design (horizontal scroll on mobile)
- Color-coded categories (Krisis Hipertensi = red)
- Empty state handling

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

### Petugas Route

**Path**: `/petugas/lansia/[kode]`

**Features**:
- Display lansia detail
- Show "Input Pemeriksaan Baru" button
- Navigate to pemeriksaan form

### Admin Route

**Path**: `/admin/lansia/[kode]`

**Features**:
- Display lansia detail (read-only)
- No action buttons

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

### Mobile (<768px)
- Personal info: 1 column grid
- Table: Horizontal scroll
- Charts: Full width, stacked vertically

### Tablet (768px - 1024px)
- Personal info: 2 column grid
- Table: Full width
- Charts: Full width, stacked vertically

### Desktop (>1024px)
- Personal info: 2 column grid
- Table: Full width
- Charts: Full width, stacked vertically

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

- [ ] Fetch lansia data berhasil
- [ ] Fetch pemeriksaan history berhasil
- [ ] Display personal info correctly
- [ ] Display pemeriksaan table correctly
- [ ] Display charts correctly
- [ ] Empty state untuk no pemeriksaan
- [ ] Loading state
- [ ] Error state dengan retry
- [ ] Navigation ke pemeriksaan form (Petugas)
- [ ] Responsive design di berbagai device
- [ ] Accessibility compliance

## Future Enhancements (Optional)

- Export pemeriksaan history ke PDF
- Print functionality
- Filter pemeriksaan by date range
- Compare multiple pemeriksaan
- Add notes to pemeriksaan
