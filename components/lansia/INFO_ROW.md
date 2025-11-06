# InfoRow Component

## Overview

Komponen reusable untuk menampilkan pasangan label-value dalam format yang konsisten dan responsive.

## Design Principles

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Hanya bertanggung jawab untuk display label-value pair
   - Tidak mengandung business logic atau data fetching

2. **Open/Closed Principle (OCP)**
   - Extensible via props tanpa modifikasi internal
   - Support custom className untuk styling tambahan
   - Support fullWidth untuk layout flexibility

3. **Interface Segregation Principle (ISP)**
   - Props minimal dan focused
   - Tidak memaksa consumer untuk provide props yang tidak dibutuhkan

### Design Principles

1. **DRY (Don't Repeat Yourself)**
   - Menghindari duplikasi pattern label-value di seluruh aplikasi
   - Centralized styling dan structure

2. **KISS (Keep It Simple, Stupid)**
   - Implementasi sederhana dan mudah dipahami
   - Minimal complexity

3. **Composition Over Inheritance**
   - Menggunakan composition untuk build complex UI
   - Flexible dan reusable

## Usage

### Basic Usage

```tsx
import { InfoRow } from '@/components/lansia';

<InfoRow 
  label="NIK" 
  value="3201234567890125" 
/>
```

### With Complex Value

```tsx
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
```

### Full Width

```tsx
<InfoRow 
  label="Alamat" 
  value="Jl. Thamrin No. 321, Jakarta Pusat"
  fullWidth 
/>
```

### In Grid Layout

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <InfoRow label="NIK" value={lansia.nik} />
  <InfoRow label="Nomor KK" value={lansia.kk} />
  <InfoRow label="Alamat" value={lansia.alamat} fullWidth />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label yang ditampilkan (required) |
| `value` | `React.ReactNode` | - | Value yang ditampilkan (required) |
| `fullWidth` | `boolean` | `false` | Span full width di grid layout |
| `className` | `string` | `''` | Custom className untuk styling tambahan |

## Responsive Behavior

- Label: `text-sm` (14px) di semua breakpoint
- Value: `text-base` (16px) di semua breakpoint
- Spacing: `mb-1.5` antara label dan value
- Full width: Menggunakan `col-span-full` untuk span semua kolom di grid

## Accessibility

- Menggunakan semantic `<label>` element
- Text dapat di-break dengan `break-words`
- Color contrast memenuhi WCAG AA standard

## Integration

Component ini digunakan di:
- `LansiaDetailContent` - untuk display informasi personal lansia
- Dapat digunakan di komponen lain yang membutuhkan label-value display

## Benefits

1. **Consistency**: Semua label-value pair memiliki styling yang konsisten
2. **Maintainability**: Perubahan styling cukup di satu tempat
3. **Reusability**: Dapat digunakan di berbagai context
4. **Flexibility**: Support custom value (ReactNode) dan styling
5. **Responsive**: Bekerja baik di semua device size
