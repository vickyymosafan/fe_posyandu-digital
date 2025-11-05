# Authentication Context

## Overview

AuthContext menyediakan state management untuk autentikasi di seluruh aplikasi. Context ini mengikuti prinsip SOLID dan design patterns yang baik.

## Prinsip Design

### Single Responsibility Principle (SRP)
- AuthContext hanya handle state management
- Business logic API calls di service layer (authAPI, profileAPI)
- UI logic di components

### Open/Closed Principle (OCP)
- Context bisa diperluas dengan menambah methods baru tanpa ubah existing code
- Consumer tidak perlu diubah saat ada perubahan internal

### Dependency Inversion Principle (DIP)
- Context depend on abstraction (API interface), bukan concrete implementation
- Mudah untuk mock atau replace API implementation untuk testing

## Usage

### 1. Wrap aplikasi dengan AuthProvider

```tsx
// app/layout.tsx
import { AuthProvider } from '@/lib/contexts';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Gunakan useAuth hook di components

```tsx
// components/LoginForm.tsx
'use client';

import { useAuth } from '@/lib/hooks';

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect akan dihandle oleh middleware
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Access user info

```tsx
'use client';

import { useAuth } from '@/lib/hooks';

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Nama: {user.nama}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### 4. Logout

```tsx
'use client';

import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 5. Update profile

```tsx
'use client';

import { useAuth } from '@/lib/hooks';

export function UpdateProfileForm() {
  const { updateNama, updatePassword } = useAuth();

  const handleUpdateNama = async (nama: string) => {
    try {
      await updateNama(nama);
      alert('Nama berhasil diupdate');
    } catch (error) {
      console.error('Update nama error:', error);
    }
  };

  const handleUpdatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await updatePassword(oldPassword, newPassword);
      alert('Password berhasil diupdate');
    } catch (error) {
      console.error('Update password error:', error);
    }
  };

  return (
    <div>
      {/* Form fields */}
    </div>
  );
}
```

## API Reference

### AuthContextType

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNama: (nama: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

### Properties

- `user`: User object atau null jika belum login
- `isAuthenticated`: Boolean indicating apakah user sudah login
- `isLoading`: Boolean indicating apakah sedang loading (login, logout, update, dll)

### Methods

- `login(email, password)`: Login user dengan email dan password
- `logout()`: Logout user dan clear token
- `updateNama(nama)`: Update nama user
- `updatePassword(oldPassword, newPassword)`: Update password user
- `refreshUser()`: Refresh user data dari server

## Token Management

### Storage Strategy

Token disimpan di 2 tempat:
1. **localStorage**: Untuk APIClient di client-side
2. **Cookie**: Untuk middleware di server-side

### Token Lifecycle

1. **Login**: Token disimpan ke localStorage dan cookie
2. **Request**: APIClient otomatis attach token dari localStorage
3. **Middleware**: Check token dari cookie untuk route protection
4. **Logout**: Token dihapus dari localStorage dan cookie
5. **Expiration**: Token expired otomatis dihapus saat initialization

### Security

- Token expiration: 15 menit (sesuai backend)
- Cookie sameSite: 'strict' untuk CSRF protection
- Cookie secure: true di production (HTTPS only)
- Token validation di backend, bukan di client

## Error Handling

AuthContext throw error yang bisa di-catch di consumer:

```tsx
try {
  await login(email, password);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle authentication error
  } else {
    // Handle other errors
  }
}
```

## Testing

### Mock AuthProvider untuk testing

```tsx
import { AuthContext } from '@/lib/contexts';

const mockAuthValue = {
  user: { id: 1, nama: 'Test User', email: 'test@example.com', role: 'ADMIN' },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  updateNama: jest.fn(),
  updatePassword: jest.fn(),
  refreshUser: jest.fn(),
};

function TestComponent() {
  return (
    <AuthContext.Provider value={mockAuthValue}>
      <YourComponent />
    </AuthContext.Provider>
  );
}
```

## Best Practices

1. **Selalu wrap dengan AuthProvider**: Pastikan root layout wrap dengan AuthProvider
2. **Gunakan useAuth hook**: Jangan langsung consume AuthContext
3. **Handle loading state**: Tampilkan loading indicator saat isLoading true
4. **Handle errors**: Wrap API calls dengan try-catch
5. **Redirect setelah login/logout**: Gunakan Next.js router untuk redirect
6. **Check isAuthenticated**: Sebelum access user data, check isAuthenticated dulu

## Troubleshooting

### Error: "useAuth must be used within an AuthProvider"

Pastikan component yang menggunakan useAuth dibungkus dengan AuthProvider:

```tsx
// ❌ Wrong
export default function App() {
  return <MyComponent />; // MyComponent uses useAuth
}

// ✅ Correct
export default function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}
```

### Token tidak persist setelah refresh

Pastikan token disimpan ke localStorage dan cookie dengan benar. Check browser DevTools:
- Application > Local Storage > auth_token
- Application > Cookies > auth_token

### Middleware redirect loop

Pastikan public routes (seperti /login) tidak require authentication di middleware.
