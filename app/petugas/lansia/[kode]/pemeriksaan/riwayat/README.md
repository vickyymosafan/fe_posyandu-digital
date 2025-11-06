# Halaman Riwayat Pemeriksaan

## Overview

Halaman untuk menampilkan riwayat pemeriksaan kesehatan lansia dengan fitur filtering berdasarkan tanggal.

## Route

```
/petugas/lansia/[kode]/pemeriksaan/riwayat
```

## Features

1. **Date Range Filter**
   - Filter berdasarkan tanggal mulai dan tanggal akhir
   - Tombol clear filter untuk reset
   - Info text menampilkan range yang dipilih

2. **Tabel Riwayat Pemeriksaan**
   - Menampilkan semua data pemeriksaan yang sudah difilter
   - Kolom: Tanggal, BMI, Tekanan Darah, Gula Darah, Kolesterol, Asam Urat
   - Responsive design

3. **Grafik Tren Kesehatan**
   - Grafik BMI
   - Grafik Tekanan Darah
   - Grafik Gula Darah
   - Menggunakan Recharts library

4. **Loading & Error State**
   - Skeleton loading saat fetch data
   - Error message jika terjadi kesalahan
   - Empty state jika tidak ada data

## Architecture

### Components

```
RiwayatPemeriksaanContent (Main Component)
├── DateRangeFilter (Filter UI)
├── HealthTrendCharts (Grafik)
└── PemeriksaanHistoryTable (Tabel)
```

### Hooks

- `useRiwayatPemeriksaan` - Data fetching dan filtering logic

### Data Flow

```
1. useRiwayatPemeriksaan hook
   ├── Fetch data dari lansiaAPI.getPemeriksaan(kode)
   ├── Store data di state (allPemeriksaan)
   └── Filter data berdasarkan date range (filteredPemeriksaan)

2. RiwayatPemeriksaanContent component
   ├── Fetch lansia data untuk nama
   ├── Render DateRangeFilter
   ├── Render HealthTrendCharts dengan filtered data
   └── Render PemeriksaanHistoryTable dengan filtered data
```

## Design Principles

### SOLID Principles

- **SRP**: Setiap komponen punya satu tanggung jawab
  - `useRiwayatPemeriksaan`: Data fetching + filtering
  - `DateRangeFilter`: UI untuk filter
  - `RiwayatPemeriksaanContent`: Komposisi komponen

- **OCP**: Komponen dapat diperluas tanpa modifikasi
  - Reuse existing components (PemeriksaanHistoryTable, HealthTrendCharts)
  - Props-based configuration

- **DRY**: Tidak ada duplikasi kode
  - Reuse existing table dan chart components
  - Reuse existing API client dan utilities

### Separation of Concerns

- **Hook Layer**: Data fetching dan business logic
- **Component Layer**: UI presentation
- **Page Layer**: Routing dan layout

## Usage

```tsx
import { RiwayatPemeriksaanContent } from '@/components/pemeriksaan';

<RiwayatPemeriksaanContent kode="pasien202501011A" />
```

## Integration dengan Backend

### API Endpoint

```
GET /api/lansia/:kode/pemeriksaan
```

### Response

```json
{
  "data": [
    {
      "id": 1,
      "lansiaId": 1,
      "tanggal": "2025-01-01T00:00:00.000Z",
      "tinggi": 160,
      "berat": 65,
      "bmi": 25.4,
      "kategoriBmi": "Kelebihan Berat Badan",
      "sistolik": 130,
      "diastolik": 85,
      "tekananDarah": "Hipertensi Tahap 1",
      "asamUrat": 6.5,
      "gulaPuasa": 110,
      "gulaSewaktu": null,
      "gula2Jpp": null,
      "klasifikasiGula": {
        "gdp": "Pra-Diabetes"
      },
      "kolesterol": 210,
      "klasifikasiKolesterol": "Batas Tinggi",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

## Performance Considerations

- **Client-side filtering**: Filtering dilakukan di client untuk menghindari multiple API calls
- **Memoization**: useCallback untuk prevent unnecessary re-renders
- **Optimized charts**: Charts hanya render data yang visible

## Future Enhancements

1. Backend filtering dengan query params untuk dataset besar
2. Export data ke PDF/Excel
3. Filter tambahan (jenis pemeriksaan, range nilai)
4. Comparison mode untuk membandingkan periode
