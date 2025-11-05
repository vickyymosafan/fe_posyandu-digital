# Debugging Login - Logging Guide

## Overview

Dokumentasi ini menjelaskan sistem logging yang telah ditambahkan untuk membantu debug masalah login, terutama error "Tidak dapat terhubung ke server".

## Logging Locations

### 1. API Client (`lib/api/client.ts`)

**Log saat module dimuat:**
```
[API Client] Initialized with BASE_URL: http://localhost:3001/api
```

**Log setiap request:**
```
[API Client] Request: {
  url: "http://localhost:3001/api/auth/login",
  method: "POST",
  headers: {...},
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**Log response sukses:**
```
[API Client] Response: {
  url: "http://localhost:3001/api/auth/login",
  status: 200,
  statusText: "OK",
  ok: true,
  timestamp: "2024-01-01T00:00:00.000Z"
}

[API Client] Response Data: {
  status: 200,
  data: {...},
  timestamp: "2024-01-01T00:00:00.000Z"
}

[API Client] Success Response: {
  status: 200,
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**Log error:**
```
[API Client] Request Failed: {
  url: "http://localhost:3001/api/auth/login",
  error: "Failed to fetch",
  errorName: "TypeError",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[API Client] Network Error: {
  url: "http://localhost:3001/api/auth/login",
  message: "Tidak dapat terhubung ke server",
  baseUrl: "http://localhost:3001/api",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

### 2. Auth API (`lib/api/auth.ts`)

**Log login request:**
```
[AuthAPI] Login request: {
  email: "admin@posyandu.local",
  endpoint: "/auth/login",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**Log login response:**
```
[AuthAPI] Login response: {
  hasData: true,
  hasToken: true,
  hasUser: true,
  hasError: false,
  timestamp: "2024-01-01T00:00:00.000Z"
}

[AuthAPI] Token saved to localStorage
```

**Log login error:**
```
[AuthAPI] Login failed: {
  error: "Tidak dapat terhubung ke server",
  errorType: "NetworkError",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

### 3. Auth Context (`lib/contexts/AuthContext.tsx`)

**Log login attempt:**
```
[AuthContext] Login attempt: {
  email: "admin@posyandu.local",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[AuthContext] Calling authAPI.login...
```

**Log login success:**
```
[AuthContext] Login response received: {
  hasData: true,
  hasError: false,
  timestamp: "2024-01-01T00:00:00.000Z"
}

[AuthContext] Login successful: {
  userId: 1,
  userName: "Admin Posyandu",
  userRole: "ADMIN",
  hasToken: true,
  timestamp: "2024-01-01T00:00:00.000Z"
}

[AuthContext] Token saved to localStorage and cookie
[AuthContext] User state updated
```

**Log login error:**
```
[AuthContext] Login failed - no data: {
  error: "Email atau kata sandi salah",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[AuthContext] Login error: {
  error: "Tidak dapat terhubung ke server",
  errorType: "NetworkError",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

### 4. useLoginForm Hook (`lib/hooks/useLoginForm.ts`)

**Log form submit:**
```
[useLoginForm] Form submitted: {
  email: "admin@posyandu.local",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[useLoginForm] Validation passed
[useLoginForm] Submitting login...
[useLoginForm] Calling login function...
```

**Log login success:**
```
[useLoginForm] Login successful: {
  userId: 1,
  userName: "Admin Posyandu",
  userRole: "ADMIN",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[useLoginForm] Redirecting to: /admin/dashboard
[useLoginForm] Submit completed
```

**Log login error:**
```
[useLoginForm] Login failed: {
  error: "Tidak dapat terhubung ke server",
  errorType: "NetworkError",
  timestamp: "2024-01-01T00:00:00.000Z"
}

[useLoginForm] Error message: Tidak dapat terhubung ke server
[useLoginForm] Submit completed
```

## Debugging Steps

### Step 1: Check BASE_URL

Buka browser console dan cari log:
```
[API Client] Initialized with BASE_URL: http://localhost:3001/api
```

**Verify:**
- URL harus `http://localhost:3001/api` (bukan 5000)
- Jika salah, check file `.env.local` di folder frontend

### Step 2: Check Backend Running

Pastikan backend berjalan di port 3001:
```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 3001
```

### Step 3: Test Backend Directly

Buka browser atau Postman dan test endpoint:
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@posyandu.local",
  "kataSandi": "admin182001"
}
```

Expected response:
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

### Step 4: Check CORS

Jika backend berjalan tapi frontend tidak bisa connect, check CORS settings di backend.

Backend `.env`:
```env
APP_URL="http://localhost:3000"
```

Backend `src/app.ts` harus include CORS middleware:
```typescript
app.use(cors({
  origin: process.env.APP_URL,
  credentials: true
}));
```

### Step 5: Check Network Tab

Buka browser DevTools → Network tab:
1. Filter by "Fetch/XHR"
2. Submit login form
3. Look for request to `/api/auth/login`
4. Check:
   - Request URL
   - Request Method (should be POST)
   - Request Headers
   - Request Payload
   - Response Status
   - Response Headers
   - Response Body

### Step 6: Check Console Logs

Buka browser DevTools → Console tab dan cari log sequence:

**Normal Flow (Success):**
```
[API Client] Initialized with BASE_URL: http://localhost:3001/api
[useLoginForm] Form submitted: {...}
[useLoginForm] Validation passed
[useLoginForm] Submitting login...
[useLoginForm] Calling login function...
[AuthContext] Login attempt: {...}
[AuthContext] Calling authAPI.login...
[AuthAPI] Login request: {...}
[API Client] Request: {...}
[API Client] Response: {...}
[API Client] Response Data: {...}
[API Client] Success Response: {...}
[AuthAPI] Login response: {...}
[AuthAPI] Token saved to localStorage
[AuthContext] Login response received: {...}
[AuthContext] Login successful: {...}
[AuthContext] Token saved to localStorage and cookie
[AuthContext] User state updated
[useLoginForm] Login successful: {...}
[useLoginForm] Redirecting to: /admin/dashboard
[useLoginForm] Submit completed
```

**Error Flow (Network Error):**
```
[API Client] Initialized with BASE_URL: http://localhost:3001/api
[useLoginForm] Form submitted: {...}
[useLoginForm] Validation passed
[useLoginForm] Submitting login...
[useLoginForm] Calling login function...
[AuthContext] Login attempt: {...}
[AuthContext] Calling authAPI.login...
[AuthAPI] Login request: {...}
[API Client] Request: {...}
[API Client] Request Failed: {...}
[API Client] Network Error: {...}
[AuthAPI] Login failed: {...}
[AuthContext] Login error: {...}
[useLoginForm] Login failed: {...}
[useLoginForm] Error message: Tidak dapat terhubung ke server
[useLoginForm] Submit completed
```

## Common Issues

### Issue 1: "Tidak dapat terhubung ke server"

**Possible Causes:**
1. Backend tidak berjalan
2. Backend berjalan di port yang salah
3. CORS issue
4. Firewall blocking connection
5. Wrong BASE_URL in .env.local

**Solution:**
1. Check backend is running: `cd backend && npm run dev`
2. Check backend port in backend/.env: `PORT="3001"`
3. Check frontend BASE_URL in frontend/.env.local: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
4. Check CORS settings in backend
5. Try accessing backend directly in browser: `http://localhost:3001/api/auth/login`

### Issue 2: "Email atau kata sandi salah"

**Possible Causes:**
1. Wrong credentials
2. Admin user not seeded in database
3. Database connection issue

**Solution:**
1. Use correct credentials:
   - Email: `admin@posyandu.local`
   - Password: `admin182001`
2. Run database seed: `cd backend && npm run seed`
3. Check database connection in backend/.env

### Issue 3: Token not saved

**Check:**
1. Browser console for "[AuthAPI] Token saved to localStorage"
2. Browser DevTools → Application → Local Storage → Check for `auth_token`
3. Browser DevTools → Application → Cookies → Check for `auth_token`

### Issue 4: Redirect not working

**Check:**
1. Console log for "[useLoginForm] Redirecting to: /admin/dashboard"
2. User role in response
3. Middleware configuration

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Posyandu Lansia
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:Admin@localhost:5433/posyandu_digital"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
APP_URL="http://localhost:3000"
PORT="3001"
ADMIN_EMAIL="admin@posyandu.local"
ADMIN_PASS="admin182001"
```

## Testing Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Database running and seeded
- [ ] .env files configured correctly
- [ ] Browser console shows BASE_URL log
- [ ] Network tab shows request to correct URL
- [ ] No CORS errors in console
- [ ] Login with admin credentials works
- [ ] Redirect to /admin/dashboard works
- [ ] Token saved in localStorage and cookie
- [ ] Middleware protects routes correctly

## Additional Tips

1. **Clear browser cache** if you changed .env files
2. **Restart Next.js dev server** after changing .env.local
3. **Check browser console** for all log messages
4. **Use Network tab** to see actual HTTP requests
5. **Test backend directly** with Postman or curl
6. **Check database** to verify admin user exists

## Contact

Jika masih ada masalah setelah mengikuti guide ini, provide:
1. Full console log dari browser
2. Network tab screenshot
3. Backend console output
4. .env file contents (without sensitive data)
