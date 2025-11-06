# Pemeriksaan Components

## Overview

Komponen-komponen untuk input dan display pemeriksaan kesehatan lansia.

## Components

### PemeriksaanFisikForm

Component untuk form input pemeriksaan fisik (tinggi, berat, tekanan darah).

**Features:**
- Realtime BMI calculation dan kategori
- Realtime blood pressure classification
- Warning untuk Krisis Hipertensi
- Form validation dengan Zod
- Offline support dengan IndexedDB
- Responsive design

**Props:**
```typescript
interface PemeriksaanFisikFormProps {
  formState: UsePemeriksaanFisikFormReturn;
}
```

**Usage:**
```tsx
import { usePemeriksaanFisikForm } from '@/lib/hooks';
import { PemeriksaanFisikForm } from '@/components/pemeriksaan';

function Page() {
  const formState = usePemeriksaanFisikForm(kode, lansiaId);
  
  return <PemeriksaanFisikForm formState={formState} />;
}
```

## Hooks

### usePemeriksaanFisikForm

Custom hook untuk manage form state dan logic pemeriksaan fisik.

**Responsibilities (SRP):**
- Manage form state
- Calculate BMI realtime
- Classify blood pressure realtime
- Handle form validation
- Submit data (online/offline)
- Save to IndexedDB and sync queue

**Parameters:**
- `kode: string` - Kode unik lansia
- `lansiaId: number` - ID lansia untuk IndexedDB

**Returns:**
```typescript
interface UsePemeriksaanFisikFormReturn {
  formData: PemeriksaanFisikFormData;
  errors: PemeriksaanFisikFormErrors;
  isSubmitting: boolean;
  bmiResult: BMIResult;
  tekananDarahResult: TekananDarahResult;
  handleChange: (field: keyof PemeriksaanFisikFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
```

## Design Principles Applied

### SOLID Principles

1. **SRP (Single Responsibility Principle)**
   - `usePemeriksaanFisikForm`: Hanya form logic
   - `PemeriksaanFisikForm`: Hanya UI presentation
   - Separate concerns: calculation, validation, submission

2. **OCP (Open/Closed Principle)**
   - Component extensible via props
   - Hook dapat digunakan untuk form lain

3. **LSP (Liskov Substitution Principle)**
   - Component dapat diganti dengan variant lain

4. **ISP (Interface Segregation Principle)**
   - Props interface minimal dan focused
   - Hook return type hanya yang diperlukan

5. **DIP (Dependency Inversion Principle)**
   - Component depends on hook abstraction
   - Tidak langsung call API

### Design Principles

1. **SoC (Separation of Concerns)**
   - Form logic: hook
   - UI presentation: component
   - Calculation: utilities (hitungBMI, klasifikasiTekananDarah)
   - Validation: validators
   - API: pemeriksaanAPI

2. **DRY (Don't Repeat Yourself)**
   - Reuse existing utilities (hitungBMI, klasifikasiBMI, klasifikasiTekananDarah)
   - Reuse existing components (Input, Button, Card)
   - Reuse existing validators (pemeriksaanFisikSchema)

3. **KISS (Keep It Simple, Stupid)**
   - Simple form with realtime feedback
   - Straightforward validation
   - Clear error messages

4. **YAGNI (You Aren't Gonna Need It)**
   - Hanya implement fitur yang diminta (Task 18)
   - Tidak ada extra features

5. **Composition Over Inheritance**
   - Component compose dari UI components
   - No class inheritance

## Integration with Backend

### API Endpoint
- `POST /lansia/:kode/pemeriksaan/fisik`

### Request Body
```typescript
interface PemeriksaanFisikData {
  tinggi: number;
  berat: number;
  sistolik: number;
  diastolik: number;
}
```

### Response
Backend akan menghitung BMI dan klasifikasi, lalu return pemeriksaan object.

## Offline Support

### Online Mode
1. Submit to `pemeriksaanAPI.createFisik`
2. Save response to IndexedDB
3. Redirect to detail page

### Offline Mode
1. Calculate BMI locally
2. Classify blood pressure locally
3. Save to IndexedDB with temporary ID
4. Add to sync queue
5. Redirect to detail page
6. Auto-sync when back online

## Responsive Design

### Mobile (<768px)
- Single column form
- Full width inputs
- Stacked result cards

### Tablet (768px - 1024px)
- 2 column grid for inputs
- Full width result cards

### Desktop (>1024px)
- 2 column grid for inputs
- Full width result cards
- Max width container

## Accessibility

- ✅ Proper labels for all inputs
- ✅ ARIA attributes for realtime feedback
- ✅ Focus management
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Color contrast compliance
- ✅ Touch targets min 44x44px

## Validation Rules

### Tinggi Badan
- Min: 50 cm
- Max: 250 cm
- Type: number with decimal

### Berat Badan
- Min: 20 kg
- Max: 300 kg
- Type: number with decimal

### Tekanan Darah Sistolik
- Min: 50 mmHg
- Max: 300 mmHg
- Type: number (integer)

### Tekanan Darah Diastolik
- Min: 30 mmHg
- Max: 200 mmHg
- Type: number (integer)

## BMI Classification

Menggunakan standar Asia Pasifik:
- < 17.0: Berat Badan Sangat Kurang
- 17.0 - 18.4: Berat Badan Kurang
- 18.5 - 25.0: Berat Badan Normal
- 25.1 - 27.0: Kelebihan Berat Badan (Overweight)
- 27.1 - 30.0: Obesitas Tingkat I
- ≥ 30.0: Obesitas Tingkat II

## Blood Pressure Classification

Menggunakan standar AHA:
- Normal: <120/<80
- Batas Waspada: 120-129/<80
- Hipertensi Tahap 1: 130-139/80-89
- Hipertensi Tahap 2: ≥140/≥90
- Krisis Hipertensi: >180/>120 (Emergency!)

## Error Handling

- Form validation errors
- API errors
- Network errors
- Offline mode handling
- User-friendly messages dalam bahasa Indonesia

## Testing Checklist

- [ ] Form validation works correctly
- [ ] BMI calculation realtime
- [ ] Blood pressure classification realtime
- [ ] Krisis Hipertensi warning shows
- [ ] Submit online works
- [ ] Submit offline works
- [ ] Sync queue works
- [ ] Redirect after submit
- [ ] Responsive design
- [ ] Accessibility compliance
- [ ] Error handling
