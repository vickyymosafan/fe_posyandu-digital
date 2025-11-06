# Halaman Grafik Tren Kesehatan Lansia (Admin)

## Overview

Halaman ini menampilkan grafik tren kesehatan lansia dalam bentuk visualisasi chart untuk memudahkan analisis perkembangan kesehatan. Halaman ini read-only untuk admin.

## Route

```
/admin/lansia/[kode]/grafik
```

## Fitur

- **Grafik BMI**: Menampilkan tren Body Mass Index dalam 6 bulan terakhir
- **Grafik Tekanan Darah**: Menampilkan tren sistolik dan diastolik
- **Grafik Gula Darah**: Menampilkan tren GDP, GDS, dan 2JPP
- **Responsive**: Chart otomatis menyesuaikan ukuran layar
- **Empty State**: Menampilkan pesan jika tidak ada data

## Komponen yang Digunakan

- `GrafikTrenContent`: Wrapper component untuk display grafik
- `HealthTrendCharts`: Component untuk render chart (dynamic import)
- `useLansiaDetail`: Hook untuk fetch data lansia dan pemeriksaan

## Navigasi

- **Kembali**: Tombol untuk kembali ke halaman detail lansia
- **Breadcrumb**: Navigasi breadcrumb di atas halaman

## Data Flow

1. Fetch data lansia dan pemeriksaan menggunakan `useLansiaDetail(kode)`
2. Filter data pemeriksaan untuk 6 bulan terakhir
3. Transform data ke format chart
4. Render chart menggunakan recharts library

## Design Principles

- **SRP**: Halaman hanya bertanggung jawab untuk display grafik
- **SoC**: Pemisahan logic fetch data (hook) dan presentasi (component)
- **DRY**: Reuse komponen HealthTrendCharts yang sudah ada
- **Composition**: Compose komponen kecil untuk membentuk halaman

## Error Handling

- Loading state saat fetch data
- Error state jika data tidak ditemukan
- Empty state jika tidak ada data pemeriksaan
- Tombol retry untuk fetch ulang data

## Perbedaan dengan Petugas

- Admin tidak memiliki aksi untuk input pemeriksaan
- Halaman ini hanya untuk monitoring dan analisis data
