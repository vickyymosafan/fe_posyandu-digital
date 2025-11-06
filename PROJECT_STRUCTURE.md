# Project Structure Documentation

Dokumentasi lengkap struktur folder dan file dalam project Posyandu Lansia Frontend.

## 📋 Daftar Isi

- [Overview](#overview)
- [Root Directory](#root-directory)
- [App Directory](#app-directory)
- [Components Directory](#components-directory)
- [Lib Directory](#lib-directory)
- [Types Directory](#types-directory)
- [Public Directory](#public-directory)
- [Configuration Files](#configuration-files)
- [Design Principles](#design-principles)

## Overview

Project ini mengikuti struktur Next.js 14 App Router dengan prinsip **Separation of Concerns** dan **Clean Architecture**:

```
frontend/
├── app/              # Next.js App Router (Presentation Layer)
├── components/       # React Components (UI Layer)
├── lib/              # Business Logic & Data Access Layer
├── types/            # TypeScript Type Definitions
├── public/           # Static Assets
└── [config files]    # Configuration Files
```

## Root Directory

```
frontend/
├── .env.local                 # Environment variables (local, gitignored)
├── .env.example               # Environment variables template
├── .eslintignore              # ESLint ignore patterns
├── .prettierignore            # Prettier ignore patterns
├── .prettierrc                # Prettier configuration
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # TailwindCSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies dan scripts
├── package-lock.json          # Lock file untuk dependencies
├── README.md                  # Main documentation
├── API_INTEGRATION.md         # API integration documentation
├── PROJECT_STRUCTURE.md       # This file
└── DEPLOYMENT.md              # Deployment guide
```

### Key Files

#### `.env.local`
Environment variables untuk development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### `next.config.ts`
Konfigurasi Next.js dengan PWA support:
- PWA configuration dengan workbox
- Image optimization
- Security headers
- Rewrites untuk manifest compatibility

#### `tailwind.config.ts`
Design system configuration:
- Font: Montserrat
- Colors: Neutral palette (50-950)
- Spacing: Custom spacing scale
- Responsive breakpoints

## App Directory

Next.js 14 App Router dengan file-based routing.

```
app/
├── globals.css                # Global styles dengan TailwindCSS
├── layout.tsx                 # Root layout dengan NotificationProvider
├── page.tsx                   # Home page (redirect ke login)
├── manifest.ts                # PWA manifest configuration
├── offline/                   # Offline fallback page
│   └── page.tsx
├── login/                     # Login page (public)
│   └── page.tsx
├── admin/                     # Admin routes (protected)
│   ├── dashboard/
│   │   └── page.tsx          # Admin dashboard
│   ├── petugas/
│   │   ├── page.tsx          # Daftar petugas
│   │   └── tambah/
│   │       └── page.tsx      # Form tambah petugas
│   ├── lansia/
│   │   ├── page.tsx          # Daftar lansia (admin view)
│   │   └── [kode]/
│   │       └── page.tsx      # Detail lansia
│   └── profil/
│       └── page.tsx          # Profil admin
└── petugas/                   # Petugas routes (protected)
    ├── dashboard/
    │   └── page.tsx          # Petugas dashboard
    ├── lansia/
    │   ├── page.tsx          # Daftar lansia
    │   ├── tambah/
    │   │   └── page.tsx      # Form pendaftaran lansia
    │   ├── cari/
    │   │   └── page.tsx      # Pencarian lansia
    │   └── [kode]/
    │       ├── page.tsx      # Detail lansia
    │       └── pemeriksaan/
    │           ├── tambah/
    │           │   └── page.tsx        # Form pemeriksaan fisik
    │           ├── kesehatan/
    │           │   └── tambah/
    │           │       └── page.tsx    # Form pemeriksaan kesehatan
    │           └── riwayat/
    │               └── page.tsx        # Riwayat pemeriksaan
    └── profil/
        └── page.tsx          # Profil petugas
```

### Routing Convention

- **Public routes**: `/login`, `/offline`
- **Admin routes**: `/admin/*` (requires ADMIN role)
- **Petugas routes**: `/petugas/*` (requires PETUGAS role)
- **Dynamic routes**: `[kode]` untuk lansia detail

### Page Responsibilities

Setiap page hanya bertanggung jawab untuk:
1. **Layout**: Menggunakan AdminLayout atau PetugasLayout
2. **Data Fetching**: Menggunakan custom hooks (useLansiaList, useDashboardStats, dll)
3. **Rendering**: Render components dari `components/` directory

**Example**:
```typescript
// app/petugas/lansia/page.tsx
export default function LansiaListPage() {
  return (
    <PetugasLayout>
      <LansiaListContent />
    </PetugasLayout>
  );
}
```

## Components Directory

Reusable React components dengan **Single Responsibility Principle**.

```
components/
├── ui/                        # Base UI components
│   ├── Button.tsx            # Button dengan variants
│   ├── Input.tsx             # Input dengan validation states
│   ├── Card.tsx              # Card dengan sub-components
│   ├── Modal.tsx             # Modal dengan backdrop
│   ├── Table.tsx             # Table dengan responsive design
│   ├── Loading.tsx           # Loading states (spinner, skeleton)
│   ├── Notification.tsx      # Notification system
│   └── index.ts              # Barrel export
├── layout/                    # Layout components
│   ├── Header.tsx            # Header dengan user info
│   ├── Sidebar.tsx           # Sidebar navigation
│   ├── AdminLayout.tsx       # Layout untuk admin
│   ├── PetugasLayout.tsx     # Layout untuk petugas
│   └── index.ts
├── dashboard/                 # Dashboard components
│   ├── StatCard.tsx          # Statistic card
│   ├── TrendChart.tsx        # Trend chart dengan Recharts
│   ├── QuickNavCard.tsx      # Quick navigation card
│   ├── DashboardSkeleton.tsx # Loading skeleton
│   └── index.ts
├── lansia/                    # Lansia feature components
│   ├── LansiaForm.tsx        # Form pendaftaran lansia
│   ├── LansiaCard.tsx        # Card untuk display lansia
│   ├── LansiaListContent.tsx # Content untuk list lansia
│   ├── SearchLansiaContent.tsx # Content untuk search lansia
│   ├── LansiaDetailContent.tsx # Content untuk detail lansia
│   ├── PemeriksaanHistoryTable.tsx # Table riwayat pemeriksaan
│   ├── HealthTrendCharts.tsx # Charts untuk tren kesehatan
│   └── index.ts
├── pemeriksaan/               # Pemeriksaan feature components
│   ├── PemeriksaanFisikForm.tsx # Form pemeriksaan fisik
│   ├── PemeriksaanKesehatanForm.tsx # Form pemeriksaan kesehatan
│   ├── RiwayatPemeriksaanContent.tsx # Content riwayat
│   ├── DateRangeFilter.tsx   # Filter tanggal
│   └── index.ts
├── profil/                    # Profil feature components
│   ├── ProfilContent.tsx     # Content profil dengan forms
│   └── index.ts
├── icons/                     # Icon components
│   └── DashboardIcons.tsx    # SVG icons untuk dashboard
├── ErrorBoundary.tsx          # Error boundary component
├── OfflineIndicator.tsx       # Offline status indicator
└── index.ts                   # Barrel export
```

### Component Principles

#### 1. Single Responsibility (SRP)
Setiap component hanya satu tanggung jawab:
- `Button.tsx`: Hanya render button dengan variants
- `LansiaForm.tsx`: Hanya render form, logic di `useLansiaForm` hook

#### 2. Composition Over Inheritance
Gunakan composition untuk reusability:
```typescript
// Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

#### 3. Props Interface
Setiap component harus define props interface:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}
```

## Lib Directory

Business logic dan data access layer.

```
lib/
├── api/                       # API Client Layer
│   ├── client.ts             # Base API client dengan fetch wrapper
│   ├── auth.ts               # Auth API endpoints
│   ├── lansia.ts             # Lansia API endpoints
│   ├── pemeriksaan.ts        # Pemeriksaan API endpoints
│   ├── petugas.ts            # Petugas API endpoints
│   ├── profile.ts            # Profile API endpoints
│   └── index.ts
├── db/                        # IndexedDB Layer
│   ├── schema.ts             # Dexie database schema
│   ├── repositories/         # Data repositories
│   │   ├── lansiaRepository.ts
│   │   ├── pemeriksaanRepository.ts
│   │   └── syncQueueRepository.ts
│   └── index.ts
├── hooks/                     # Custom React Hooks
│   ├── useAuth.ts            # Auth state management
│   ├── useOffline.ts         # Offline detection
│   ├── useLansiaForm.ts      # Lansia form logic
│   ├── useLansiaList.ts      # Lansia list logic
│   ├── useLansiaDetail.ts    # Lansia detail logic
│   ├── usePemeriksaanFisikForm.ts
│   ├── usePemeriksaanKesehatanForm.ts
│   ├── useRiwayatPemeriksaan.ts
│   ├── usePetugasForm.ts
│   ├── usePetugasList.ts
│   ├── useProfileForm.ts
│   ├── usePasswordForm.ts
│   ├── useDashboardStats.ts
│   ├── useLoginForm.ts
│   └── index.ts
├── contexts/                  # React Contexts
│   ├── AuthContext.tsx       # Auth context provider
│   └── index.ts
├── utils/                     # Utility Functions
│   ├── bmi.ts                # BMI calculation & classification
│   ├── tekananDarah.ts       # Blood pressure classification
│   ├── gulaDarah.ts          # Blood sugar classification
│   ├── kolesterol.ts         # Cholesterol classification
│   ├── asamUrat.ts           # Uric acid classification
│   ├── generateIdPasien.ts   # Patient ID generator
│   ├── formatters.ts         # Date & number formatters
│   ├── validators.ts         # Zod schemas
│   ├── errors.ts             # Custom error classes
│   ├── cookies.ts            # Cookie utilities
│   ├── failFast.ts           # Fail-fast assertions
│   ├── syncManager.ts        # Offline sync manager
│   ├── chartData.ts          # Chart data transformers
│   ├── healthCheck.ts        # Backend health check
│   └── index.ts
└── index.ts
```

### Layer Responsibilities

#### API Client Layer (`lib/api/`)
**Responsibility**: Komunikasi dengan backend API

**Principles**:
- **DIP**: Depend pada interface, bukan implementasi
- **SRP**: Setiap file hanya handle satu resource

**Example**:
```typescript
// lib/api/lansia.ts
export class LansiaAPI {
  private client: APIClient;

  async create(data: CreateLansiaData): Promise<APIResponse<Lansia>> {
    return this.client.post('/lansia', data);
  }

  async getAll(): Promise<APIResponse<Lansia[]>> {
    return this.client.get('/lansia');
  }
}
```

#### IndexedDB Layer (`lib/db/`)
**Responsibility**: Local data storage untuk offline support

**Principles**:
- **Repository Pattern**: Abstraksi data access
- **SRP**: Setiap repository handle satu entity

**Example**:
```typescript
// lib/db/repositories/lansiaRepository.ts
export class LansiaRepository {
  async create(lansia: LansiaDB): Promise<number> {
    return db.lansia.add(lansia);
  }

  async getByKode(kode: string): Promise<LansiaDB | undefined> {
    return db.lansia.where('kode').equals(kode).first();
  }
}
```

#### Hooks Layer (`lib/hooks/`)
**Responsibility**: Encapsulate business logic dan state management

**Principles**:
- **SRP**: Setiap hook hanya satu tanggung jawab
- **Custom Hooks**: Reusable logic extraction

**Example**:
```typescript
// lib/hooks/useLansiaForm.ts
export function useLansiaForm() {
  const [formData, setFormData] = useState<LansiaFormData>(initialState);
  const [errors, setErrors] = useState<LansiaFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // Validation logic
    // API call logic
    // Error handling
  };

  return { formData, errors, isSubmitting, handleSubmit };
}
```

#### Utils Layer (`lib/utils/`)
**Responsibility**: Pure functions untuk calculations dan transformations

**Principles**:
- **Pure Functions**: No side effects
- **Single Purpose**: Setiap file satu kategori utility

**Example**:
```typescript
// lib/utils/bmi.ts
export function hitungBMI(berat: number, tinggi: number): number {
  return berat / Math.pow(tinggi / 100, 2);
}

export function klasifikasiBMI(bmi: number): string {
  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  // ...
}
```

## Types Directory

TypeScript type definitions untuk type safety.

```
types/
├── index.ts                   # All type definitions
└── [future types]
```

### Type Categories

```typescript
// types/index.ts

// User & Auth Types
export type UserRole = 'ADMIN' | 'PETUGAS';
export type Gender = 'L' | 'P';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Lansia Types
export interface Lansia {
  id: number;
  kode: string;
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: Date;
  gender: Gender;
  alamat: string;
  createdAt: Date;
}

export interface CreateLansiaData {
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: string;
  gender: Gender;
  alamat: string;
}

// Pemeriksaan Types
export interface Pemeriksaan {
  id: number;
  lansiaId: number;
  tanggal: Date;
  tinggi?: number;
  berat?: number;
  bmi?: number;
  kategoriBmi?: string;
  sistolik?: number;
  diastolik?: number;
  tekananDarah?: string;
  asamUrat?: number;
  gulaPuasa?: number;
  gulaSewaktu?: number;
  gula2Jpp?: number;
  klasifikasiGula?: KlasifikasiGulaDarah;
  kolesterol?: number;
  klasifikasiKolesterol?: string;
  createdAt: Date;
}

// API Types
export interface APIResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
```

## Public Directory

Static assets yang di-serve langsung oleh Next.js.

```
public/
├── icons/                     # PWA icons
│   ├── icon-192x192.png      # Icon 192x192
│   ├── icon-512x512.png      # Icon 512x512
│   └── README.md             # Icon generation guide
├── manifest.json              # PWA manifest (generated)
└── sw.js                      # Service worker (generated by next-pwa)
```

### PWA Assets

Icons generated dengan script:
```bash
npm run generate-icons
```

Script location: `scripts/generate-icons.js`

## Configuration Files

### `next.config.ts`
- PWA configuration dengan `@ducanh2912/next-pwa`
- Workbox runtime caching strategies
- Image optimization
- Security headers
- Rewrites untuk manifest compatibility

### `tailwind.config.ts`
- Custom font: Montserrat
- Color palette: Neutral (50-950)
- Custom spacing scale
- Responsive breakpoints
- Custom utilities

### `tsconfig.json`
- Strict mode enabled
- Path aliases: `@/*` untuk root directory
- Target: ES2017
- Module: ESNext

### `eslint.config.mjs`
- Next.js recommended rules
- TypeScript support
- Custom rules untuk code quality

### `.prettierrc`
- Single quotes
- No semicolons
- 2 spaces indentation
- Trailing commas

## Design Principles

### 1. Separation of Concerns (SoC)

**Presentation Layer** (`app/`, `components/`):
- Hanya bertanggung jawab untuk UI rendering
- Tidak ada business logic
- Menggunakan hooks untuk data fetching

**Application Layer** (`lib/hooks/`, `lib/contexts/`):
- Business logic dan state management
- Orchestration antara UI dan data layer

**Data Access Layer** (`lib/api/`, `lib/db/`):
- Komunikasi dengan backend API
- Local storage dengan IndexedDB
- Data transformation

### 2. DRY (Don't Repeat Yourself)

- Reusable components di `components/ui/`
- Shared utilities di `lib/utils/`
- Custom hooks untuk logic reuse
- Barrel exports (`index.ts`) untuk clean imports

### 3. KISS (Keep It Simple, Stupid)

- Gunakan solusi paling sederhana yang bekerja
- Hindari over-engineering
- Clear naming conventions
- Minimal abstractions

### 4. YAGNI (You Aren't Gonna Need It)

- Jangan buat fitur yang belum diperlukan
- Implement hanya yang ada di requirements
- Refactor saat diperlukan, bukan sebelumnya

### 5. Fail Fast

- Validate input di awal function
- Throw error untuk invalid state
- Assert preconditions dengan `failFast.ts`

**Example**:
```typescript
// lib/utils/failFast.ts
export function assertNonEmptyString(value: string, fieldName: string): void {
  if (!value || value.trim() === '') {
    throw new ValidationError(`${fieldName} tidak boleh kosong`);
  }
}

// Usage
function createLansia(data: CreateLansiaData) {
  assertNonEmptyString(data.nik, 'NIK');
  assertNonEmptyString(data.nama, 'Nama');
  // ... proceed with creation
}
```

## File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `LansiaForm.tsx`)
- **Hooks**: camelCase dengan prefix `use` (`useAuth.ts`, `useLansiaForm.ts`)
- **Utils**: camelCase (`formatDate.ts`, `generateIdPasien.ts`)
- **Types**: camelCase (`index.ts`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **Constants**: UPPER_SNAKE_CASE dalam file

## Import Conventions

### Barrel Exports

Setiap directory memiliki `index.ts` untuk barrel exports:

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Usage
import { Button, Input, Card } from '@/components/ui';
```

### Import Order

1. External dependencies
2. Internal absolute imports
3. Internal relative imports
4. Types
5. Styles

```typescript
// External
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Internal absolute
import { Button, Input } from '@/components/ui';
import { useLansiaForm } from '@/lib/hooks';

// Internal relative
import { LansiaCard } from './LansiaCard';

// Types
import type { Lansia } from '@/types';
```

## Best Practices

### 1. Component Organization

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 3.1. Hooks
  const [state, setState] = useState('');
  
  // 3.2. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3.3. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

### 2. Hook Organization

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { lansiaAPI } from '@/lib/api';

// 2. Types
interface UseLansiaListReturn {
  lansia: Lansia[];
  isLoading: boolean;
  error: string | null;
}

// 3. Hook
export function useLansiaList(): UseLansiaListReturn {
  // 3.1. State
  const [lansia, setLansia] = useState<Lansia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 3.2. Effects
  useEffect(() => {
    fetchLansia();
  }, []);
  
  // 3.3. Functions
  const fetchLansia = async () => {
    // ...
  };
  
  // 3.4. Return
  return { lansia, isLoading, error };
}
```

### 3. Utility Organization

```typescript
// 1. Imports
import { ValidationError } from './errors';

// 2. Constants
const MIN_HEIGHT = 50;
const MAX_HEIGHT = 250;

// 3. Helper functions (private)
function validateHeight(height: number): void {
  if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
    throw new ValidationError('Tinggi badan tidak valid');
  }
}

// 4. Exported functions
export function hitungBMI(berat: number, tinggi: number): number {
  validateHeight(tinggi);
  return berat / Math.pow(tinggi / 100, 2);
}
```

## Maintenance Guidelines

### Adding New Feature

1. **Create types** di `types/index.ts`
2. **Create API client** di `lib/api/`
3. **Create repository** di `lib/db/repositories/` (jika perlu offline support)
4. **Create hooks** di `lib/hooks/`
5. **Create components** di `components/[feature]/`
6. **Create pages** di `app/[role]/[feature]/`
7. **Update documentation**

### Refactoring

1. **Identify duplication**: Look for repeated code
2. **Extract to utility**: Move to `lib/utils/`
3. **Extract to hook**: Move logic to `lib/hooks/`
4. **Extract to component**: Move UI to `components/`
5. **Test**: Ensure functionality unchanged

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] Has proper TypeScript types
- [ ] Follows SOLID principles
- [ ] Has error handling
- [ ] Has loading states
- [ ] Responsive design
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Comments dalam bahasa Indonesia
- [ ] No console.log in production code

## Troubleshooting

### Import Errors

**Problem**: `Module not found: Can't resolve '@/components/ui'`

**Solution**: Check `tsconfig.json` path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Type Errors

**Problem**: `Type 'X' is not assignable to type 'Y'`

**Solution**: Check type definitions di `types/index.ts` dan ensure consistency dengan backend types.

### Build Errors

**Problem**: Build fails dengan error di PWA

**Solution**: Check `next.config.ts` PWA configuration dan ensure icons exist di `public/icons/`.

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

