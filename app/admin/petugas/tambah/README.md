# Halaman Tambah Petugas (Admin)

## Overview

Halaman ini menyediakan form untuk menambahkan petugas baru ke dalam sistem Posyandu Lansia. Hanya dapat diakses oleh pengguna dengan role **ADMIN**.

## Features

- ✅ Form tambah petugas dengan 3 field (nama, email, password)
- ✅ Realtime validation dengan Zod
- ✅ Password visibility toggle
- ✅ Password strength requirements (min 8 karakter, huruf, angka, simbol)
- ✅ Loading state saat submit
- ✅ Notifikasi sukses/error
- ✅ Redirect ke daftar petugas setelah sukses
- ✅ Responsive design untuk mobile dan desktop
- ✅ Accessibility compliant (keyboard navigation, ARIA labels)

## File Structure

```
app/admin/petugas/tambah/
├── page.tsx              # Main form component
└── README.md             # Documentation (this file)

lib/hooks/
└── usePetugasForm.ts     # Custom hook untuk form logic

lib/utils/
└── validators.ts         # Zod schema (petugasFormSchema)
```

## Design Principles

### SOLID Principles

1. **SRP (Single Responsibility Principle)**
   - `usePetugasForm` hook: Bertanggung jawab untuk form state dan logic
   - `TambahPetugasPage` component: Bertanggung jawab untuk presentasi
   - `petugasFormSchema`: Bertanggung jawab untuk validation rules

2. **OCP (Open/Closed Principle)**
   - Component dapat diperluas melalui props tanpa mengubah kode internal
   - Validation rules dapat diubah di schema tanpa mengubah component

3. **DIP (Dependency Inversion Principle)**
   - Page component depends on `usePetugasForm` hook abstraction
   - Hook depends on `petugasAPI` abstraction
   - Tidak ada direct dependency ke implementation details

### Design Principles

1. **SoC (Separation of Concerns)**
   - UI layer: `page.tsx` (presentasi)
   - Logic layer: `usePetugasForm.ts` (form state dan business logic)
   - Validation layer: `validators.ts` (validation rules)
   - API layer: `petugasAPI` (network calls)

2. **DRY (Don't Repeat Yourself)**
   - Reuse existing UI components (Input, Button, Card, Loading)
   - Reuse existing utilities (handleAPIError, validators)
   - No code duplication

3. **KISS (Keep It Simple, Stupid)**
   - Straightforward form implementation
   - Clear validation messages
   - Simple submit flow

## Component API

### usePetugasForm Hook

```typescript
interface UsePetugasFormReturn {
  formData: PetugasFormData;           // Form data state
  errors: PetugasFormErrors;           // Validation errors
  isSubmitting: boolean;               // Submit loading state
  showPassword: boolean;               // Password visibility state
  handleChange: (field, value) => void; // Field change handler
  togglePasswordVisibility: () => void; // Toggle password visibility
  handleSubmit: (e) => Promise<void>;  // Form submit handler
}
```

### TambahPetugasPage Component

```typescript
export default function TambahPetugasPage(): JSX.Element
```

## Validation Rules

### Nama
- Required
- Non-empty string
- Error: "Nama tidak boleh kosong"

### Email
- Required
- Valid email format
- Error: "Format email tidak valid"

### Password (kataSandi)
- Required
- Minimum 8 characters
- Must contain letters
- Must contain numbers
- Must contain symbols
- Errors:
  - "Password minimal 8 karakter"
  - "Password harus mengandung huruf"
  - "Password harus mengandung angka"
  - "Password harus mengandung simbol"

## Integration dengan Backend

### API Endpoint

**POST /petugas**
- Create petugas baru
- Body: `{ nama: string, email: string, kataSandi: string }`
- Response: `{ data: Petugas }` or `{ error: string }`

### Data Flow

```
User Input → Form Component → usePetugasForm Hook → Validation (Zod)
                                      ↓
                              petugasAPI.create → Backend API
                                      ↓
                          Success: Notification + Redirect
                          Error: Show error notification
```

## Responsive Design

### Breakpoints

- **Mobile (<640px)**: Full width form, stacked buttons
- **Tablet (640px-1024px)**: Centered form with max-width
- **Desktop (>1024px)**: Centered form with optimal width (max-w-2xl)

### Touch Targets

- All buttons have minimum size 44x44px
- Adequate spacing between interactive elements
- Password toggle button easily tappable

## Accessibility

### Keyboard Navigation

- Tab to navigate between fields
- Enter to submit form
- Escape to cancel (via back link)

### ARIA Labels

- All inputs have proper labels
- Error messages linked with aria-describedby
- Required fields marked with aria-required
- Invalid fields marked with aria-invalid
- Password toggle has descriptive aria-label

### Screen Reader Support

- Semantic HTML structure
- Form validation errors announced
- Loading states announced
- Success/error notifications announced

## Usage Example

```typescript
// User navigates to /admin/petugas/tambah
// 1. Fill in form fields
// 2. Validation runs on each field change (realtime)
// 3. Click "Simpan Petugas" button
// 4. Form validates all fields
// 5. If valid, submit to API
// 6. Show success notification
// 7. Redirect to /admin/petugas
```

## Error Handling

### Validation Errors
- Displayed below each field in red
- Cleared when user starts typing
- All errors shown on submit attempt

### API Errors
- Network errors: "Tidak dapat terhubung ke server"
- Duplicate email: Error message from backend
- Server errors: "Terjadi kesalahan pada server"
- All errors shown as notifications

## Security Considerations

### Password Requirements
- Minimum 8 characters enforced
- Must include letters, numbers, and symbols
- Password not visible by default
- Toggle visibility for user convenience

### Input Sanitization
- All inputs validated with Zod
- Email format validation
- No XSS vulnerabilities (React auto-escapes)

## Notes

### Why No Edit Form?

Backend API hanya menyediakan endpoint untuk:
- CREATE petugas (POST /petugas)
- UPDATE status petugas (PATCH /petugas/:id/status)

Tidak ada endpoint untuk update data petugas (nama, email, password). Oleh karena itu:
- Hanya form TAMBAH yang diimplementasikan
- Tombol "Edit" dihapus dari daftar petugas
- Jika perlu edit data petugas, harus menambahkan endpoint di backend terlebih dahulu

### Future Enhancements

Jika backend menambahkan endpoint UPDATE petugas:
- [ ] Tambah endpoint PATCH /petugas/:id di backend
- [ ] Tambah petugasAPI.update() di frontend
- [ ] Buat halaman edit di /admin/petugas/edit/[id]
- [ ] Reuse usePetugasForm dengan mode parameter (create/edit)
- [ ] Tambahkan tombol "Edit" kembali di daftar petugas

## Testing

### Manual Testing Checklist

- [ ] Form load dengan field kosong
- [ ] Validation error tampil saat field kosong di-submit
- [ ] Validation error tampil saat email format salah
- [ ] Validation error tampil saat password < 8 karakter
- [ ] Validation error tampil saat password tidak ada huruf
- [ ] Validation error tampil saat password tidak ada angka
- [ ] Validation error tampil saat password tidak ada simbol
- [ ] Realtime validation bekerja saat user mengetik
- [ ] Password visibility toggle bekerja
- [ ] Submit button disabled saat loading
- [ ] Success notification tampil setelah submit berhasil
- [ ] Redirect ke /admin/petugas setelah sukses
- [ ] Error notification tampil jika submit gagal
- [ ] Tombol "Batal" redirect ke /admin/petugas
- [ ] Responsive design bekerja di mobile, tablet, desktop
- [ ] Keyboard navigation bekerja dengan baik
- [ ] Screen reader dapat membaca semua content

## Related Files

- `lib/api/petugas.ts` - API client untuk petugas endpoints
- `lib/hooks/usePetugasForm.ts` - Custom hook untuk form logic
- `lib/utils/validators.ts` - Zod schemas untuk validation
- `components/ui/Input.tsx` - Reusable input component
- `components/ui/Button.tsx` - Reusable button component
- `components/ui/Card.tsx` - Reusable card component
- `components/layout/AdminLayout.tsx` - Layout untuk admin pages
- `types/index.ts` - TypeScript type definitions

## Maintainers

- Frontend Team
- Last Updated: 2025-11-06
