# Grafik Tren Kesehatan - Technical Documentation

## Overview

Komponen untuk menampilkan grafik tren kesehatan lansia menggunakan recharts library. Grafik menampilkan data BMI, Tekanan Darah, dan Gula Darah dalam 6 bulan terakhir.

## Komponen

### HealthTrendCharts

**Location**: `components/lansia/HealthTrendCharts.tsx`

**Responsibilities**:
- Render 3 jenis grafik: BMI, Tekanan Darah, Gula Darah
- Filter data untuk N bulan terakhir
- Handle empty state
- Responsive design

## Grafik Gula Darah - Penjelasan Teknis

### Masalah yang Diperbaiki

**Issue**: Grafik gula darah tidak menampilkan garis penghubung antar titik data, hanya menampilkan dots.

**Root Cause**:
1. Data gula darah bersifat sparse (jarang) - tidak setiap pemeriksaan mencatat gula darah
2. Penggunaan `null` untuk nilai kosong menyebabkan recharts tetap render titik kosong
3. Property `connectNulls` tidak bekerja optimal dengan data yang sangat jarang

**Solusi**:
1. Menggunakan `undefined` instead of `null` untuk nilai yang tidak ada
2. Recharts tidak akan render titik untuk nilai `undefined`
3. Property `connectNulls={true}` akan menghubungkan titik-titik yang ada
4. Memperbesar ukuran dot (r: 5) agar lebih terlihat
5. Menambahkan label yang lebih deskriptif pada legend

### Data Transformation

```typescript
// SEBELUM (Masalah)
gdp: p.gulaPuasa || null,  // null akan tetap render titik kosong

// SESUDAH (Solusi)
gdp: p.gulaPuasa ?? undefined,  // undefined tidak akan render titik
```

### Chart Configuration

```typescript
<Line
  type="monotone"
  dataKey="gdp"
  stroke="#10b981"
  strokeWidth={2}
  dot={{ fill: '#10b981', r: 5 }}  // Dot lebih besar
  activeDot={{ r: 7 }}
  name="GDP (Puasa)"  // Label lebih deskriptif
  connectNulls={true}  // Hubungkan titik yang ada
/>
```

## Perbedaan dengan Grafik Lain

### BMI Chart
- Data lebih konsisten (setiap pemeriksaan fisik ada BMI)
- Single line chart
- Tidak perlu `connectNulls` karena data lengkap

### Tekanan Darah Chart
- Data cukup konsisten (setiap pemeriksaan fisik ada tekanan darah)
- Dual line chart (sistolik & diastolik)
- Tidak perlu `connectNulls` karena data lengkap

### Gula Darah Chart
- Data sparse (hanya pemeriksaan kesehatan/lab)
- Triple line chart (GDP, GDS, 2JPP)
- **Memerlukan `connectNulls={true}`** karena data jarang
- **Menggunakan `undefined` untuk nilai kosong**

## Best Practices

### 1. Handling Sparse Data

Untuk data yang jarang/sparse:
- Gunakan `undefined` untuk nilai yang tidak ada
- Set `connectNulls={true}` pada Line component
- Perbesar ukuran dot agar lebih terlihat

### 2. Tooltip Formatter

```typescript
formatter={(value: unknown, name: string) => {
  if (typeof value !== 'number') return null;  // Hide tooltip untuk undefined
  return [`${value.toFixed(0)} mg/dL`, name];
}}
```

### 3. Legend Labels

Gunakan label yang deskriptif:
- ❌ "GDP" (kurang jelas)
- ✅ "GDP (Puasa)" (lebih jelas)

### 4. Visual Hierarchy

- Dot size: 5px (normal), 7px (active)
- Stroke width: 2px
- Warna berbeda untuk setiap line
- Grid dengan opacity rendah

## Responsive Design

- ResponsiveContainer: width="100%", height={300}
- Font size: 12px untuk axis labels
- Padding: 6px pada container
- Shadow: sm untuk depth

## Color Palette

### Gula Darah
- GDP (Puasa): `#10b981` (Green)
- GDS (Sewaktu): `#f59e0b` (Amber)
- 2JPP: `#8b5cf6` (Purple)

### Tekanan Darah
- Sistolik: `#ef4444` (Red)
- Diastolik: `#3b82f6` (Blue)

### BMI
- Single line: `#0ea5e9` (Sky Blue)

## Testing Checklist

- [ ] Grafik BMI menampilkan line dengan benar
- [ ] Grafik Tekanan Darah menampilkan 2 lines dengan benar
- [ ] Grafik Gula Darah menampilkan lines (bukan hanya dots)
- [ ] Lines menghubungkan titik-titik yang ada
- [ ] Tooltip menampilkan nilai dengan format yang benar
- [ ] Legend menampilkan label yang deskriptif
- [ ] Empty state muncul jika tidak ada data
- [ ] Responsive di berbagai ukuran layar
- [ ] Warna konsisten dan mudah dibedakan

## Troubleshooting

### Grafik hanya menampilkan dots tanpa lines

**Penyebab**: Data menggunakan `null` untuk nilai kosong

**Solusi**: Gunakan `undefined` dan set `connectNulls={true}`

### Lines tidak menghubungkan semua titik

**Penyebab**: Property `connectNulls` tidak di-set

**Solusi**: Tambahkan `connectNulls={true}` pada Line component

### Tooltip menampilkan "Tidak ada data"

**Penyebab**: Formatter tidak handle `undefined` dengan benar

**Solusi**: Return `null` dari formatter untuk nilai `undefined`

## References

- [Recharts Documentation](https://recharts.org/)
- [Line Chart API](https://recharts.org/en-US/api/Line)
- [Handling Missing Data](https://recharts.org/en-US/examples/LineChartConnectNulls)
