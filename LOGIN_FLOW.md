# Login Flow Documentation

## Overview

Dokumentasi lengkap tentang alur login dari frontend ke backend dan redirect ke dashboard yang sesuai berdasarkan role user.

## Flow Diagram

```
User Input Credentials
        ↓
Login Page (app/login/page.tsx)
        ↓
useLoginForm Hook
        ↓
AuthContext.login()
        ↓
authAPI.login() → Backend API
        ↓
Backend Auth Controller
        ↓
Auth Service (verify credentials)
        ↓
Generate JWT Token
        ↓
Return { token, user } + Set Cookie
        ↓
Frontend: Save token to localStorage & cookie
        ↓
Frontend: Get user role from response
        ↓
Redirect to appropriate dashboard:
  - ADMIN → /admin/dashboard
  - PETUGAS → /petugas/dashboard
```

## Components

### 1. Frontend Login Page
**File**: `app/login/page.tsx`

- Menampilkan form login dengan email dan password
- Menggunakan `useLoginForm` hook untuk handle form logic
- Responsive design dengan TailwindCSS

### 2. useLoginForm Hook
**File**: `lib/hooks/useLoginForm.ts`

**Responsibilities**:
- Handle form state (email, password)
- Validate input dengan Zod schema
- Call `AuthContext.login()` untuk autentikasi
- Redirect ke dashboard berdasarkan role

**Key Features**:
- Real-time validation
- Password visibility toggle
- Loading state management
- Error handling dengan notification

### 3. AuthContext
**File**: `lib/contexts/AuthContext.tsx`

**Responsibilities**:
- Manage authentication state
- Provide login/logout functions
- Store JWT token di localStorage dan cookie
- Decode JWT untuk extract user info

**Key Changes**:
- `login()` function sekarang return `User` data
- Memungkinkan immediate redirect tanpa setTimeout

### 4. Auth API Client
**File**: `lib/api/auth.ts`

**Responsibilities**:
- Call backend `/auth/login` endpoint
- Handle API response
- Save token to localStorage

**Request Format**:
```json
{
  "email": "admin@posyandu.local",
  "kataSandi": "admin182001"
}
```

**Response Format**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "Admin Posyandu",
    "email": "admin@posyandu.local",
    "role": "ADMIN"
  }
}
```

### 5. Backend Auth Controller
**File**: `backend/src/controllers/authController.ts`

**Responsibilities**:
- Handle POST `/api/auth/login` request
- Validate credentials via Auth Service
- Generate JWT token
- Set token in httpOnly cookie (for middleware)
- Return token and user data in response body (for frontend)

**Security Features**:
- httpOnly cookie (prevent XSS)
- sameSite: 'strict' (prevent CSRF)
- secure: true in production (HTTPS only)
- Token expiration: 15 minutes

### 6. Middleware
**File**: `frontend/middleware.ts`

**Responsibilities**:
- Protect routes based on authentication
- Role-based access control
- Redirect authenticated users from /login to dashboard
- Redirect root path (/) to appropriate dashboard

**Route Protection**:
- `/admin/*` → Only ADMIN
- `/petugas/*` → Only PETUGAS
- `/login` → Public (redirect if authenticated)
- `/offline` → Public

## Role-Based Redirect

### Admin Login
1. User login dengan email: `admin@posyandu.local`
2. Backend verify credentials
3. Return user data dengan `role: "ADMIN"`
4. Frontend redirect ke `/admin/dashboard`

### Petugas Login
1. User login dengan email petugas
2. Backend verify credentials
3. Return user data dengan `role: "PETUGAS"`
4. Frontend redirect ke `/petugas/dashboard`

## Security Considerations

### Token Storage
- **localStorage**: Untuk API client (dapat diakses JavaScript)
- **httpOnly Cookie**: Untuk middleware (tidak dapat diakses JavaScript)

### Why Both?
- localStorage: Frontend API client perlu token untuk Authorization header
- Cookie: Middleware perlu token untuk route protection (server-side)

### Token Expiration
- Token valid selama 15 menit
- Setelah expired, user harus login ulang
- Middleware akan redirect ke /login jika token expired

## Testing

### Manual Testing

1. **Test Admin Login**:
   ```
   Email: admin@posyandu.local
   Password: admin182001
   Expected: Redirect to /admin/dashboard
   ```

2. **Test Invalid Credentials**:
   ```
   Email: wrong@email.com
   Password: wrongpassword
   Expected: Error notification "Email atau kata sandi salah"
   ```

3. **Test Middleware Protection**:
   ```
   - Access /admin/dashboard without login
   Expected: Redirect to /login
   
   - Login as PETUGAS, try access /admin/dashboard
   Expected: Redirect to /petugas/dashboard
   ```

### Automated Testing

```typescript
// Example test case
describe('Login Flow', () => {
  it('should redirect admin to admin dashboard', async () => {
    // Mock login API
    // Submit form
    // Verify redirect to /admin/dashboard
  });
  
  it('should redirect petugas to petugas dashboard', async () => {
    // Mock login API
    // Submit form
    // Verify redirect to /petugas/dashboard
  });
});
```

## Troubleshooting

### Issue: Redirect tidak berfungsi
**Solution**: 
- Pastikan backend return format response yang benar (token + user)
- Pastikan AuthContext.login() return User data
- Check browser console untuk error

### Issue: Token tidak tersimpan
**Solution**:
- Check localStorage di browser DevTools
- Check cookie di browser DevTools
- Verify API response contains token

### Issue: Middleware tidak redirect
**Solution**:
- Check cookie name consistency (auth_token)
- Verify JWT_SECRET di backend .env
- Check middleware matcher config

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
NODE_ENV="development"
APP_URL="http://localhost:3000"
PORT="3001"
ADMIN_EMAIL="admin@posyandu.local"
ADMIN_PASS="admin182001"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Default Credentials

### Admin Account
- **Email**: admin@posyandu.local
- **Password**: admin182001
- **Role**: ADMIN
- **Access**: Full system access

### Creating Petugas Account
Admin dapat membuat akun petugas melalui dashboard admin.

## API Endpoints

### POST /api/auth/login
**Request**:
```json
{
  "email": "admin@posyandu.local",
  "kataSandi": "admin182001"
}
```

**Response (Success - 200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "Admin Posyandu",
    "email": "admin@posyandu.local",
    "role": "ADMIN"
  }
}
```

**Response (Error - 401)**:
```json
{
  "error": "Email atau kata sandi salah"
}
```

### POST /api/auth/logout
**Response (Success - 200)**:
```json
{
  "message": "Logout berhasil"
}
```

## Changes Made

### Frontend Changes

1. **AuthContext.tsx**:
   - Changed `login()` return type from `Promise<void>` to `Promise<User>`
   - Return user data untuk immediate redirect

2. **useLoginForm.ts**:
   - Remove setTimeout workaround
   - Use returned user data from login() untuk redirect
   - Remove unused `user` from useAuth

3. **middleware.ts**:
   - Already properly configured
   - No changes needed

### Backend Changes

1. **authController.ts**:
   - Update response format to include both `token` and `user`
   - Token also set in httpOnly cookie for middleware
   - Token in response body for frontend API client

## Conclusion

Login flow sekarang berfungsi dengan baik:
- ✅ Admin login redirect ke `/admin/dashboard`
- ✅ Petugas login redirect ke `/petugas/dashboard`
- ✅ Token disimpan di localStorage dan cookie
- ✅ Middleware protect routes berdasarkan role
- ✅ No setTimeout workaround needed
- ✅ Type-safe dengan TypeScript
- ✅ Proper error handling
