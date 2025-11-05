# Arsitektur Aplikasi Posyandu Lansia Frontend

## Overview

Aplikasi ini dibangun dengan arsitektur berlapis (layered architecture) yang memisahkan concerns dan memudahkan maintenance.

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js App Router                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Admin      │  │ Petugas    │  │ Auth       │    │  │
│  │  │ Pages      │  │ Pages      │  │ Pages      │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth         │  │ Lansia       │  │ Pemeriksaan  │     │
│  │ Context      │  │ Hooks        │  │ Hooks        │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Offline      │  │ Sync         │  │ Notification │     │
│  │ Manager      │  │ Manager      │  │ Manager      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ API Client   │  │ IndexedDB    │  │ Cache        │     │
│  │              │  │ Repository   │  │ Manager      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Prinsip Design

### 1. Separation of Concerns (SoC)

Setiap layer memiliki tanggung jawab yang jelas:

- **Presentation Layer**: Menampilkan UI dan handle user interactions
- **Application Layer**: Business logic dan state management
- **Data Access Layer**: Komunikasi dengan backend API dan local storage

### 2. Dependency Inversion Principle (DIP)

- High-level modules tidak depend pada low-level modules
- Keduanya depend pada abstractions (interfaces/types)
- Contoh: Components depend pada hooks, bukan langsung ke API client

### 3. Single Responsibility Principle (SRP)

- Setiap component/function hanya satu tanggung jawab
- Contoh: `Button` component hanya handle rendering button, bukan business logic

### 4. Open/Closed Principle (OCP)

- Components terbuka untuk extension (via props)
- Tertutup untuk modification (tidak perlu ubah internal code)

### 5. Interface Segregation Principle (ISP)

- Interface props kecil dan spesifik
- Tidak memaksa component implement props yang tidak digunakan

## Folder Structure Detail

### `/app`
Next.js App Router dengan file-based routing:
- `layout.tsx`: Root layout dengan global providers
- `page.tsx`: Home page
- `(auth)/`: Auth layout group untuk halaman login
- `(admin)/`: Admin layout group dengan sidebar
- `(petugas)/`: Petugas layout group dengan sidebar

### `/components`
Reusable UI components:
- `/ui`: Basic UI components (Button, Input, Card, Modal, dll)
- `/forms`: Form components (FormPendaftaran, FormPemeriksaan, dll)
- `/charts`: Chart components (GrafikBMI, GrafikTekananDarah, dll)
- `/features`: Feature-specific components (CardPemeriksaan, TabelRiwayat, dll)

### `/lib`
Core libraries dan utilities:
- `/api`: API client dan endpoint functions
- `/db`: IndexedDB dengan Dexie.js
  - `/repositories`: Data access patterns
- `/utils`: Utility functions (klasifikasi, formatters, validators)
- `/hooks`: Custom React hooks
- `/contexts`: React Context providers

### `/types`
TypeScript type definitions untuk seluruh aplikasi

### `/public`
Static assets (images, icons, fonts)

## Data Flow

### 1. User Interaction
```
User → Component → Hook → API Client → Backend
                    ↓
                IndexedDB (offline)
```

### 2. Data Fetching
```
Component → Hook → API Client → Backend
                    ↓
                IndexedDB (cache)
                    ↓
                Component (render)
```

### 3. Offline Mode
```
Component → Hook → IndexedDB → Component (render)
                    ↓
                Sync Queue (untuk sync nanti)
```

## State Management

### Global State
- **AuthContext**: User authentication state
- **OfflineContext**: Online/offline status
- **NotificationContext**: Global notifications

### Local State
- React useState untuk component-specific state
- React useReducer untuk complex state logic

### Server State
- Custom hooks untuk data fetching
- Cache di IndexedDB untuk offline access

## Error Handling

### API Errors
```typescript
try {
  const response = await apiClient.get('/endpoint');
  // Handle success
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
  } else if (error instanceof ValidationError) {
    // Show validation errors
  } else {
    // Show generic error
  }
}
```

### Component Errors
- Error boundaries untuk catch rendering errors
- Fallback UI untuk error states

## Performance Optimization

### 1. Code Splitting
- Automatic dengan Next.js App Router
- Dynamic imports untuk large components

### 2. Image Optimization
- Next.js Image component
- WebP/AVIF formats
- Lazy loading

### 3. Caching
- Service Worker untuk assets
- IndexedDB untuk data
- React Query (optional) untuk server state

### 4. Bundle Size
- Tree shaking
- Minimize dependencies
- Analyze dengan @next/bundle-analyzer

## Security

### 1. XSS Prevention
- React's built-in XSS protection
- Sanitize user input
- Avoid dangerouslySetInnerHTML

### 2. CSRF Protection
- Backend uses sameSite cookies
- Token validation

### 3. Authentication
- JWT in httpOnly cookies
- Token expiration handling
- Automatic logout

### 4. Authorization
- Route guards
- Role-based access control
- Component-level permissions

## Testing Strategy

### Unit Tests
- Test utility functions
- Test custom hooks
- Test components in isolation

### Integration Tests
- Test API client
- Test IndexedDB operations
- Test sync manager

### E2E Tests
- Test user flows
- Test offline functionality
- Test PWA features

## Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
- Development: `.env.local`
- Production: Vercel dashboard

### CI/CD
- Automatic deployment on push to main
- Preview deployments for PRs
- Environment-specific builds

## Monitoring

### Error Tracking
- Console errors in development
- Sentry/LogRocket in production (optional)

### Performance Monitoring
- Web Vitals tracking
- Lighthouse CI

### Analytics
- Google Analytics (optional)
- User behavior tracking

## Future Enhancements

### Phase 2
- Push notifications
- Export to PDF/Excel
- Multi-language support
- Dark mode

### Phase 3
- Mobile app (React Native)
- Advanced analytics
- AI-powered recommendations
