# Pemeriksaan Components

## Overview

Komponen-komponen untuk input dan display pemeriksaan kesehatan lansia.

## Components

### PemeriksaanGabunganForm

Component untuk form input pemeriksaan gabungan (fisik + kesehatan).

**Features:**
- Combined form untuk data fisik dan kesehatan
- Realtime BMI calculation dan kategori
- Realtime blood pressure classification
- Realtime lab value classifications
- Form validation dengan Zod
- Offline support dengan IndexedDB
- Responsive design

### PemeriksaanKesehatanForm

Component untuk form input pemeriksaan kesehatan (lab values).

**Features:**
- All fields optional (GDP, GDS, 2JPP, kolesterol, asam urat)
- Realtime classification untuk setiap field
- Gender-based asam urat classification
- Form validation (minimal 1 field harus diisi)
- Offline support dengan IndexedDB
- Responsive design

**Props:**
```typescript
interface PemeriksaanKesehatanFormProps {
  formState: UsePemeriksaanKesehatanFormReturn;
}
```

**Usage:**
```tsx
import { usePemeriksaanKesehatanForm } from '@/lib/hooks';
import { PemeriksaanKesehatanForm } from '@/components/pemeriksaan';

function Page() {
  const formState = usePemeriksaanKesehatanForm(kode, lansiaId, gender);
  
  return <PemeriksaanKesehatanForm formState={formState} />;
}
```

## usePemeriksaanKesehatanForm Hook

Custom hook untuk manage form state dan logic pemeriksaan kesehatan.

**Responsibilities (SRP):**
- Manage form state (all fields optional)
- Classify lab values realtime
- Handle form validation
- Submit data (online/offline)
- Save to IndexedDB and sync queue

**Parameters:**
- `kode: string` - Kode unik lansia
- `lansiaId: number` - ID lansia untuk IndexedDB
- `gender: Gender` - Jenis kelamin untuk klasifikasi asam urat

**Returns:**
```typescript
interface UsePemeriksaanKesehatanFormReturn {
  formData: PemeriksaanKesehatanFormData;
  errors: PemeriksaanKesehatanFormErrors;
  isSubmitting: boolean;
  klasifikasiGula: KlasifikasiGulaDarah;
  klasifikasiKolesterolValue: string | null;
  klasifikasiAsamUratValue: string | null;
  handleChange: (field: keyof PemeriksaanKesehatanFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
```

## Lab Value Classifications

### Gula Darah (Blood Glucose)

**GDP (Gula Darah Puasa / Fasting)**
- Normal: <100 mg/dL
- Pra-Diabetes: 100-125 mg/dL
- Diabetes: ≥126 mg/dL

**GDS (Gula Darah Sewaktu / Random)**
- Normal: <200 mg/dL
- Diabetes: ≥200 mg/dL

**2JPP (2 Jam Post Prandial)**
- Normal: <140 mg/dL
- Pra-Diabetes: 140-199 mg/dL
- Diabetes: ≥200 mg/dL

### Kolesterol (Cholesterol)

- Normal: <200 mg/dL
- Batas Tinggi: 200-239 mg/dL
- Tinggi: ≥240 mg/dL

### Asam Urat (Uric Acid)

**Laki-laki:**
- Rendah: <3.4 mg/dL
- Normal: 3.4-7.0 mg/dL
- Tinggi: >7.0 mg/dL

**Perempuan:**
- Rendah: <2.4 mg/dL
- Normal: 2.4-6.0 mg/dL
- Tinggi: >6.0 mg/dL

## Validation Rules

### All Fields Optional
- Minimal 1 field harus diisi
- Jika field diisi, harus valid number dalam range

### Gula Darah
- Min: 20 mg/dL
- Max: 600 mg/dL
- Type: number (integer)

### Kolesterol
- Min: 50 mg/dL
- Max: 500 mg/dL
- Type: number (integer)

### Asam Urat
- Min: 1 mg/dL
- Max: 20 mg/dL
- Type: number with decimal

## Key Features

1. **All Fields Optional**: Tidak ada field yang wajib diisi, minimal 1 field harus ada
2. **Gender-Based Classification**: Asam urat classification berdasarkan jenis kelamin
3. **Multiple Classifications**: Gula darah memiliki 3 jenis klasifikasi (GDP, GDS, 2JPP)
4. **Lab Values**: Fokus pada hasil laboratorium
