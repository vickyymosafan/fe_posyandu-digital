# Posyandu Lansia - Frontend

Aplikasi Progressive Web App (PWA) untuk manajemen data lansia dan pemeriksaan kesehatan di Posyandu, dibangun dengan Next.js 14, TailwindCSS, dan TypeScript.

## 🚀 Teknologi Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Styling**: TailwindCSS 4.x
- **Language**: TypeScript 5.x
- **State Management**: React Context API + Custom Hooks
- **Data Storage**: IndexedDB (via Dexie.js)
- **Form Validation**: Zod
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📁 Struktur Project

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles dengan TailwindCSS
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # UI components (Button, Input, Card, dll)
│   ├── forms/                   # Form components
│   ├── charts/                  # Chart components
│   └── features/                # Feature-specific components
├── lib/                         # Core libraries
│   ├── api/                     # API client
│   ├── db/                      # IndexedDB dengan Dexie
│   │   └── repositories/        # Data repositories
│   ├── utils/                   # Utility functions
│   ├── hooks/                   # Custom React hooks
│   └── contexts/                # React contexts
├── types/                       # TypeScript type definitions
├── public/                      # Static assets
│   └── icons/                   # PWA icons
├── .env.local                   # Environment variables (local)
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── package.json                 # Dependencies dan scripts
```

## 🛠️ Setup dan Instalasi

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalasi

1. Clone repository dan masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy file environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` dan sesuaikan dengan konfigurasi Anda:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting dan Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Format code dengan Prettier
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## 🎨 Design System

### Font

Aplikasi menggunakan **Montserrat** sebagai font utama dengan berbagai weight (300-900).

### Color Palette

Menggunakan neutral palette dari TailwindCSS:

- `neutral-50` sampai `neutral-950`
- Tidak menggunakan dark mode
- Background utama: `neutral-50`
- Text utama: `neutral-900`

### Component Classes

#### Buttons

```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

#### Cards

```tsx
<div className="card">Card Content</div>
```

#### Input Fields

```tsx
<input className="input-field" />
<input className="input-field input-error" />
<input className="input-field input-success" />
```

### Spacing

- Minimum touch target: `44px x 44px`
- Grid gap: `gap-x-6 gap-y-8`
- Section padding: `py-12` atau `py-16`

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 Environment Variables

| Variable                  | Description     | Default                     |
| ------------------------- | --------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`     | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_NAME`    | Nama aplikasi   | `Posyandu Lansia`           |
| `NEXT_PUBLIC_APP_VERSION` | Versi aplikasi  | `1.0.0`                     |

## 📦 Dependencies Utama

### Production

- `next`: Framework React untuk production
- `react` & `react-dom`: Library React
- `zod`: Schema validation
- `dexie`: IndexedDB wrapper
- `date-fns`: Date manipulation
- `recharts`: Charting library

### Development

- `typescript`: Type checking
- `tailwindcss`: Utility-first CSS framework
- `eslint`: Code linting
- `prettier`: Code formatting

## 🏗️ Prinsip Development

### SOLID Principles

- **SRP (Single Responsibility)**: Setiap komponen hanya satu tanggung jawab
- **OCP (Open/Closed)**: Komponen mudah diperluas lewat props
- **LSP (Liskov Substitution)**: Komponen turunan dapat menggantikan komponen utama
- **ISP (Interface Segregation)**: Interface props kecil dan spesifik
- **DIP (Dependency Inversion)**: Depend pada abstraksi, bukan implementasi

### Design Principles

- **Separation of Concerns**: Pisahkan UI, state, dan business logic
- **DRY (Don't Repeat Yourself)**: Reuse komponen dan utility
- **KISS (Keep It Simple, Stupid)**: Gunakan solusi paling sederhana
- **YAGNI (You Aren't Gonna Need It)**: Jangan buat fitur yang belum diperlukan
- **Composition Over Inheritance**: Gunakan komposisi komponen

## 📝 Coding Standards

### TypeScript

- Gunakan type definitions yang jelas
- Hindari `any`, gunakan `unknown` jika perlu
- Export types dari `types/index.ts`

### React Components

- Gunakan functional components dengan hooks
- Props interface harus didefinisikan
- Gunakan destructuring untuk props
- Implementasi error boundaries

### Naming Conventions

- Components: PascalCase (`Button.tsx`)
- Hooks: camelCase dengan prefix `use` (`useAuth.ts`)
- Utils: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### File Organization

- Satu component per file
- Co-locate related files
- Index files untuk barrel exports

## 🚢 Deployment ke Vercel

### Setup

1. Push code ke GitHub repository

2. Import project di Vercel:
   - Kunjungi [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository GitHub Anda

3. Configure environment variables di Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: URL backend API production

4. Deploy:
   - Vercel akan otomatis build dan deploy
   - Setiap push ke main branch akan trigger deployment

### Build Configuration

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 📱 PWA (Progressive Web App)

### Cara Mengaktifkan PWA

#### Di Chrome (Desktop)

1. Buka aplikasi di browser
2. Klik icon install di address bar (sebelah kanan)
3. Klik "Install"

#### Di Chrome (Mobile)

1. Buka aplikasi di browser
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"
4. Tap "Add"

#### Di Safari (iOS)

1. Buka aplikasi di Safari
2. Tap tombol Share
3. Tap "Add to Home Screen"
4. Tap "Add"

### Features PWA

- ✅ Offline support dengan Service Worker
- ✅ Install sebagai aplikasi native
- ✅ Fast loading dengan caching
- ✅ Responsive design
- ✅ Secure (HTTPS required di production)

## 🧪 Testing

### Unit Testing

```bash
# Coming soon
npm test
```

### E2E Testing

```bash
# Coming soon
npm run test:e2e
```

## 📚 Dokumentasi Tambahan

### Dokumentasi Project

- **[API Integration](./API_INTEGRATION.md)** - Dokumentasi lengkap integrasi dengan Backend API
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Penjelasan detail struktur folder dan file
- **[Deployment Guide](./DEPLOYMENT.md)** - Panduan lengkap deployment ke Vercel
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Panduan mengatasi masalah umum

### Dokumentasi External

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Dexie.js Documentation](https://dexie.org)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Perubahan dokumentasi
- `style:` - Perubahan formatting (tidak mengubah logic)
- `refactor:` - Refactoring code
- `test:` - Menambah atau update tests
- `chore:` - Maintenance tasks

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- Developer: [Your Name]
- Designer: [Designer Name]
- Project Manager: [PM Name]

## 📞 Support

Untuk bantuan atau pertanyaan, silakan hubungi:

- Email: support@posyandu.com
- GitHub Issues: [repository-url]/issues
