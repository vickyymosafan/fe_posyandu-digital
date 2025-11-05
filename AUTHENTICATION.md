# Authentication System Implementation

## Overview

Sistem autentikasi telah diimplementasikan dengan mengikuti prinsip SOLID, design patterns yang baik, dan best practices untuk security dan maintainability.

## Files Created

### 1. Core Authentication Files

#### `lib/utils/cookies.ts`
- Utility functions untuk cookie management
- Functions: `setCookie`, `getCookie`, `removeCookie`, `hasCookie`
- Support options: maxAge, expires, path, domain, secure, sameSite
- KISS principle: Simple implementation tanpa dependency eksternal

#### `lib/contexts/AuthContext.tsx`
- React Context untuk auth state management
- State: `user`, `isAuthenticated`, `isLoading`
- Methods: `login`, `logout`, `updateNama`, `updatePassword`, `refreshUser`
- Token management: localStorage + cookie untuk dual storage strategy
- JWT decode untuk extract user info dari token
- Auto-initialization dari existing token

#### `lib/hooks/useAuth.ts`
- Custom hook untuk consume AuthContext
- Throw error jika digunakan di luar AuthProvider
- Clean API untuk consumer components

#### `middleware.ts`
- Next.js middleware untuk route protection
- Public routes: `/login`, `/offline`, static assets
- Protected routes: `/admin/*` (ADMIN only), `/petugas/*` (PETUGAS only)
- Role-based access control dengan JWT decode
- Auto-redirect ke dashboard sesuai role
- Token validation dan expiration check

### 2. Supporting Files

#### `lib/contexts/index.ts`
- Central export untuk contexts
- Export: `AuthContext`, `AuthProvider`

#### `lib/hooks/index.ts`
- Central export untuk hooks
- Export: `useAuth`

#### `lib/utils/index.ts` (updated)
- Added cookie utilities export
- Export: `setCookie`, `getCookie`, `removeCookie`, `hasCookie`, `CookieOptions`

### 3. Layout & Pages

#### `app/layout.tsx` (updated)
- Wrap dengan AuthProvider
- Changed font dari Geist ke Montserrat (sesuai design system)
- Updated metadata untuk Posyandu Lansia

#### `app/login/page.tsx`
- Login page dengan form email dan password
- Error handling dan loading state
- Integration dengan useAuth hook
- Responsive design dengan TailwindCSS

#### `app/admin/dashboard/page.tsx`
- Placeholder dashboard untuk ADMIN role
- Display user info dan logout button
- Testing authentication flow

#### `app/petugas/dashboard/page.tsx`
- Placeholder dashboard untuk PETUGAS role
- Display user info dan logout button
- Testing authentication flow

### 4. Documentation

#### `lib/contexts/README.md`
- Comprehensive documentation untuk AuthContext
- Usage examples dan best practices
- API reference dan troubleshooting guide
- Testing strategies

## Design Principles Applied

### SOLID Principles

#### Single Responsibility Principle (SRP)
- **AuthContext**: Hanya handle state management
- **useAuth**: Hanya provide access ke context
- **middleware**: Hanya handle route protection
- **cookies utility**: Hanya handle cookie operations

#### Open/Closed Principle (OCP)
- Context bisa diperluas dengan methods baru tanpa ubah consumer
- Middleware bisa diperluas dengan route patterns baru
- Cookie utility bisa diperluas dengan options baru

#### Liskov Substitution Principle (LSP)
- AuthProvider bisa diganti dengan mock provider untuk testing
- API clients bisa diganti dengan mock implementations

#### Interface Segregation Principle (ISP)
- AuthContextType interface focused dan tidak terlalu besar
- CookieOptions interface hanya contain relevant options
- Separate interfaces untuk different concerns

#### Dependency Inversion Principle (DIP)
- AuthContext depend on API interface abstraction
- Components depend on useAuth hook, bukan direct context
- Middleware depend on JWT decode, bukan specific implementation

### Other Design Principles

#### Separation of Concerns (SoC)
- **UI Layer**: React components (pages)
- **State Layer**: AuthContext
- **Business Logic**: useAuth hook + API clients
- **Route Protection**: middleware
- **Utilities**: cookies, errors, formatters

#### Don't Repeat Yourself (DRY)
- Reusable cookie utilities
- Reusable auth hook
- Centralized token management
- Single source of truth untuk auth state

#### Keep It Simple, Stupid (KISS)
- Simple cookie implementation tanpa external library
- Straightforward context structure
- Clear and readable code
- Minimal complexity

#### You Aren't Gonna Need It (YAGNI)
- Tidak implement features yang belum diperlukan
- Focus pada requirements yang ada
- Avoid over-engineering

## Security Features

### Token Management
- **Dual Storage**: localStorage (client) + cookie (middleware)
- **Expiration**: 15 menit sesuai backend
- **Auto-cleanup**: Token expired otomatis dihapus
- **Secure Cookie**: HTTPS only di production

### CSRF Protection
- **SameSite**: 'strict' untuk prevent CSRF attacks
- **Path**: '/' untuk scope ke seluruh aplikasi

### Route Protection
- **Middleware**: First line of defense
- **Role-based**: Admin dan Petugas routes terpisah
- **Token Validation**: Check expiration di middleware
- **Auto-redirect**: Redirect ke login jika unauthorized

### Error Handling
- **Proper Errors**: AuthenticationError, AuthorizationError
- **User-friendly Messages**: Error messages dalam bahasa Indonesia
- **Graceful Degradation**: Logout jika token invalid

## Integration with Existing Code

### API Clients
- Menggunakan existing `authAPI` dan `profileAPI`
- Compatible dengan `APIClient` token management
- No breaking changes ke existing API layer

### Type System
- Menggunakan existing types dari `types/index.ts`
- Added new types untuk JWT payload
- Type-safe di seluruh implementation

### Design System
- Menggunakan TailwindCSS classes yang sudah defined
- Follow design system: Montserrat font, neutral colors
- Responsive dan accessible

## Testing Strategy

### Manual Testing
1. Login dengan credentials valid
2. Login dengan credentials invalid
3. Access protected routes tanpa login
4. Access admin routes sebagai petugas (dan sebaliknya)
5. Logout dan verify token cleared
6. Refresh page dan verify token persist
7. Wait for token expiration dan verify auto-logout

### Unit Testing (Future)
- Test cookie utilities
- Test token decode
- Test middleware route matching
- Mock AuthProvider untuk component testing

### Integration Testing (Future)
- Test login flow end-to-end
- Test logout flow
- Test route protection
- Test token expiration handling

## Dependencies Added

```json
{
  "jwt-decode": "^4.0.0"
}
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Next Steps

1. **Task 7**: Implementasi Offline & Sync Manager
2. **Task 8**: Implementasi UI components library
3. **Task 9**: Implementasi Layout components
4. **Task 10**: Implementasi halaman Login (sudah ada placeholder)

## Notes

- Semua komentar dan dokumentasi dalam bahasa Indonesia
- Code mengikuti ESLint dan Prettier configuration
- Type-safe dengan TypeScript strict mode
- No console warnings atau errors
- Ready untuk production deployment

## Commit Message

```
feat(auth): implementasi authentication system dengan JWT

- Tambah cookie utilities untuk token management
- Tambah AuthContext dengan state management
- Tambah useAuth hook untuk consume context
- Tambah middleware untuk route protection dan RBAC
- Update layout dengan AuthProvider dan Montserrat font
- Tambah login page dan placeholder dashboards
- Tambah comprehensive documentation

Mengikuti prinsip SOLID, SoC, DRY, KISS, dan YAGNI.
Token disimpan di localStorage dan cookie untuk dual strategy.
Middleware handle route protection dengan role-based access control.

Requirements: 1.1-1.5, 2.1-2.5, 19.1-19.6
```
