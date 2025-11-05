# UI Components Library

Library komponen UI yang dapat digunakan kembali untuk aplikasi Posyandu Lansia.

## Prinsip Design

Semua komponen mengikuti prinsip:
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **SoC**: Separation of Concerns - memisahkan presentasi, state, dan logic
- **DRY**: Don't Repeat Yourself - komponen dapat digunakan kembali
- **KISS**: Keep It Simple, Stupid - implementasi sederhana dan mudah dipahami
- **Accessibility**: Semua komponen mendukung keyboard navigation dan screen reader

## Komponen

### Button

Tombol dengan berbagai varian dan ukuran.

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Simpan
</Button>

// Secondary button dengan icon
<Button variant="secondary" leftIcon={<Icon />}>
  Batal
</Button>

// Loading state
<Button isLoading>
  Memproses...
</Button>

// Danger button
<Button variant="danger" size="sm">
  Hapus
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode
- `fullWidth`: boolean

### Input

Input field dengan validasi dan feedback visual.

```tsx
import { Input } from '@/components/ui';

// Basic input
<Input
  label="Nama"
  placeholder="Masukkan nama"
  required
/>

// Input dengan error
<Input
  label="Email"
  type="email"
  error="Email tidak valid"
/>

// Input dengan success state
<Input
  label="NIK"
  validationState="success"
  helperText="NIK valid"
/>

// Input dengan icon
<Input
  label="Cari"
  leftIcon={<SearchIcon />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `validationState`: 'error' | 'success' | 'default'
- `leftIcon`, `rightIcon`: React.ReactNode
- `fullWidth`: boolean

### Card

Container dengan shadow dan rounded corners.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card variant="elevated" hoverable>
  <CardHeader
    title="Judul Card"
    subtitle="Subtitle card"
  />
  <CardBody>
    Konten card
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'bordered' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean

### Loading

Komponen loading dengan berbagai varian.

```tsx
import { Loading, Skeleton } from '@/components/ui';

// Spinner
<Loading variant="spinner" size="md" text="Memuat..." />

// Dots
<Loading variant="dots" />

// Full screen
<Loading fullScreen text="Memproses data..." />

// Skeleton
<Skeleton variant="text" lines={3} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />
```

**Props:**
- `variant`: 'spinner' | 'skeleton' | 'dots'
- `size`: 'sm' | 'md' | 'lg'
- `text`: string
- `fullScreen`: boolean

### Modal

Modal dialog dengan backdrop dan keyboard navigation.

```tsx
import { Modal, ModalFooter } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Konfirmasi"
  size="md"
>
  <p>Apakah Anda yakin ingin menghapus data ini?</p>
  
  <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Batal
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Hapus
    </Button>
  </ModalFooter>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean
- `closeOnBackdrop`: boolean
- `closeOnEsc`: boolean

### Table

Table responsive dengan sorting support.

```tsx
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from '@/components/ui';

<Table variant="striped" responsive>
  <TableHead>
    <TableRow>
      <TableHeader sortable sortDirection="asc" onSort={handleSort}>
        Nama
      </TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Aksi</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.length === 0 ? (
      <TableEmpty colSpan={3} message="Tidak ada data" />
    ) : (
      data.map((item) => (
        <TableRow key={item.id} clickable>
          <TableCell>{item.nama}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>
            <Button size="sm">Edit</Button>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

**Props:**
- `variant`: 'default' | 'striped' | 'bordered'
- `responsive`: boolean

### Notification

Sistem notifikasi global dengan auto-dismiss.

```tsx
// 1. Wrap app dengan NotificationProvider
import { NotificationProvider } from '@/components/ui';

<NotificationProvider position="top-right" defaultDuration={5000}>
  <App />
</NotificationProvider>

// 2. Gunakan useNotification hook
import { useNotification } from '@/components/ui';

const { showNotification } = useNotification();

// Success
showNotification('success', 'Data berhasil disimpan');

// Error
showNotification('error', 'Terjadi kesalahan');

// Warning
showNotification('warning', 'Perhatian!');

// Info
showNotification('info', 'Informasi penting');

// Custom duration
showNotification('success', 'Pesan ini akan hilang dalam 10 detik', 10000);
```

**Props:**
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
- `defaultDuration`: number (ms)

## Accessibility

Semua komponen mendukung:
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA attributes untuk screen reader
- ✅ Focus indicators yang jelas
- ✅ Minimum touch target 44x44px
- ✅ Color contrast ratio yang memenuhi WCAG

## Responsive Design

Semua komponen responsive dan mengikuti breakpoint:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Styling

Komponen menggunakan TailwindCSS dengan design system yang konsisten:
- Font: Montserrat
- Colors: Neutral palette (50-950)
- Spacing: Grid dengan gap-x-6 dan gap-y-8
- Rounded: xl (12px) dan 2xl (16px)
- Shadow: Lembut untuk depth
- Transition: 300ms untuk smooth animation
