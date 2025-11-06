# Layout Components

Komponen layout untuk aplikasi Posyandu Lansia yang responsive dan accessible.

## Prinsip Design

Semua komponen mengikuti prinsip:
- **SRP**: Setiap komponen memiliki satu tanggung jawab
- **OCP**: Dapat diperluas melalui props tanpa mengubah kode internal
- **DIP**: Bergantung pada abstraksi (useAuth hook) bukan implementasi konkret
- **Composition Over Inheritance**: Menggunakan komposisi komponen
- **Responsive Design**: Mobile-first dengan breakpoint md (768px)

## Komponen

### Header

Komponen header dengan logo, user info, offline indicator, dan logout button.

**Features:**
- Logo aplikasi
- Hamburger menu button (mobile only)
- Offline indicator
- User info dengan avatar (desktop only)
- Logout button

**Props:**
- `onMenuClick?: () => void` - Callback untuk toggle sidebar
- `showMenuButton?: boolean` - Tampilkan menu button (default: true)

**Usage:**
```tsx
import { Header } from '@/components/layout';

<Header 
  onMenuClick={handleToggleSidebar}
  showMenuButton
/>
```

### Sidebar

Komponen sidebar dengan navigation menu yang responsive.

**Features:**
- Responsive: Drawer di mobile, fixed di desktop
- Active route highlighting
- User info (mobile only)
- Smooth transitions
- Backdrop overlay (mobile)

**Props:**
- `navigationItems: NavigationItem[]` - Daftar menu navigasi
- `isOpen: boolean` - Status sidebar terbuka/tertutup
- `onClose: () => void` - Callback untuk menutup sidebar

**NavigationItem Interface:**
```typescript
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}
```

**Usage:**
```tsx
import { Sidebar, NavigationItem } from '@/components/layout';

const navItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardIcon />,
  },
  // ...
];

<Sidebar
  navigationItems={navItems}
  isOpen={isSidebarOpen}
  onClose={handleCloseSidebar}
/>
```

### AdminLayout

Layout lengkap untuk role Admin dengan navigation items yang sesuai.

**Navigation Items:**
- Dashboard (`/admin/dashboard`)
- Daftar Petugas (`/admin/petugas`)
- Daftar Lansia (`/admin/lansia`)
- Profil (`/admin/profil`)

**Props:**
- `children: React.ReactNode` - Konten halaman

**Usage:**
```tsx
import { AdminLayout } from '@/components/layout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <h1>Dashboard Admin</h1>
      {/* Konten halaman */}
    </AdminLayout>
  );
}
```

### PetugasLayout

Layout lengkap untuk role Petugas dengan navigation items yang sesuai.

**Navigation Items:**
- Dashboard (`/petugas/dashboard`)
- Pendaftaran Lansia (`/petugas/lansia/daftar`)
- Pencarian Lansia (`/petugas/lansia/cari`)
- Daftar Lansia (`/petugas/lansia`)
- Profil (`/petugas/profil`)

**Props:**
- `children: React.ReactNode` - Konten halaman

**Usage:**
```tsx
import { PetugasLayout } from '@/components/layout';

export default function PetugasPage() {
  return (
    <PetugasLayout>
      <h1>Dashboard Petugas</h1>
      {/* Konten halaman */}
    </PetugasLayout>
  );
}
```

## Responsive Behavior

### Mobile (< 768px)
- Sidebar menjadi drawer yang dapat dibuka/tutup
- Hamburger menu button tampil di header
- User info tampil di sidebar
- Logout button icon only

### Desktop (≥ 768px)
- Sidebar fixed di sebelah kiri
- Hamburger menu button hidden
- User info tampil di header
- Logout button dengan label

## Layout Structure

```
┌─────────────────────────────────────────┐
│              Header                     │
│  [Menu] Logo  [Offline] [User] [Logout]│
└─────────────────────────────────────────┘
┌──────────┬──────────────────────────────┐
│          │                              │
│ Sidebar  │      Main Content            │
│          │                              │
│ - Nav 1  │  <children>                  │
│ - Nav 2  │                              │
│ - Nav 3  │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels untuk icon buttons
- ✅ Focus indicators yang jelas
- ✅ Semantic HTML (header, nav, main, aside)
- ✅ Screen reader friendly

## State Management

Layout components menggunakan:
- `useState` untuk sidebar open/close state
- `useAuth` hook untuk user data
- `usePathname` untuk active route detection

## Integration dengan Root Layout

Root layout sudah dikonfigurasi dengan:
- Montserrat font
- AuthProvider untuk authentication
- NotificationProvider untuk global notifications

```tsx
// app/layout.tsx
<AuthProvider>
  <NotificationProvider position="top-right">
    {children}
  </NotificationProvider>
</AuthProvider>
```

## Styling

Menggunakan TailwindCSS dengan:
- Neutral color palette
- Smooth transitions (duration-300)
- Rounded corners (rounded-xl, rounded-2xl)
- Shadow untuk depth
- Responsive utilities (md:, lg:, etc.)

## Best Practices

1. **Composition**: AdminLayout dan PetugasLayout compose Header + Sidebar
2. **Reusability**: Sidebar dapat digunakan dengan navigation items berbeda
3. **Separation of Concerns**: Header hanya handle header UI, Sidebar hanya handle navigation
4. **Dependency Inversion**: Components depend on useAuth abstraction
5. **Mobile-First**: Design dimulai dari mobile, enhanced untuk desktop
