# API Integration Documentation

Dokumentasi lengkap integrasi Frontend dengan Backend API Posyandu Lansia.

## 📋 Daftar Isi

- [Base Configuration](#base-configuration)
- [Authentication](#authentication)
- [Lansia Management](#lansia-management)
- [Pemeriksaan Management](#pemeriksaan-management)
- [Petugas Management](#petugas-management)
- [Profile Management](#profile-management)
- [Error Handling](#error-handling)
- [Offline Sync](#offline-sync)

## Base Configuration

### API Client Setup

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 detik
```

### Request Headers

Semua request yang memerlukan autentikasi harus menyertakan JWT token:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## Authentication

### Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "admin@posyandu.com",
  "kataSandi": "password123"
}
```

**Response Success** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nama": "Admin Posyandu",
    "email": "admin@posyandu.com",
    "role": "ADMIN"
  }
}
```

**Response Error** (401):
```json
{
  "error": "Email atau password salah"
}
```

**Frontend Implementation**:
```typescript
// lib/api/auth.ts
const response = await authAPI.login(email, password);
if (response.data) {
  // Simpan token ke cookie
  setCookie('token', response.data.token, { maxAge: 900 }); // 15 menit
  // Update auth context
  setUser(response.data.user);
}
```

### Logout

**Endpoint**: `POST /auth/logout`

**Headers**: Requires Authorization

**Response Success** (200):
```json
{
  "message": "Logout berhasil"
}
```

**Frontend Implementation**:
```typescript
await authAPI.logout();
removeCookie('token');
setUser(null);
router.push('/login');
```

## Lansia Management

### Create Lansia

**Endpoint**: `POST /lansia`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "nik": "3201234567890123",
  "kk": "3201234567890123",
  "nama": "Siti Aminah",
  "tanggalLahir": "1950-05-15",
  "gender": "P",
  "alamat": "Jl. Merdeka No. 123, Jakarta"
}
```

**Response Success** (201):
```json
{
  "id": 1,
  "kode": "pasien202501151a",
  "nik": "3201234567890123",
  "kk": "3201234567890123",
  "nama": "Siti Aminah",
  "tanggalLahir": "1950-05-15T00:00:00.000Z",
  "gender": "P",
  "alamat": "Jl. Merdeka No. 123, Jakarta",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Response Error** (400):
```json
{
  "error": "NIK sudah terdaftar"
}
```

**Frontend Implementation**:
```typescript
// Generate ID unik
const kode = await generateIdPasien();

// Submit ke API
const response = await lansiaAPI.create({
  nik,
  kk,
  nama,
  tanggalLahir,
  gender,
  alamat
});

// Simpan ke IndexedDB untuk offline access
if (response.data) {
  await lansiaRepository.create({
    ...response.data,
    syncedAt: new Date()
  });
}
```

### Get All Lansia

**Endpoint**: `GET /lansia`

**Headers**: Requires Authorization

**Response Success** (200):
```json
[
  {
    "id": 1,
    "kode": "pasien202501151a",
    "nik": "3201234567890123",
    "kk": "3201234567890123",
    "nama": "Siti Aminah",
    "tanggalLahir": "1950-05-15T00:00:00.000Z",
    "gender": "P",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

**Frontend Implementation**:
```typescript
const response = await lansiaAPI.getAll();
if (response.data) {
  // Simpan ke IndexedDB
  await lansiaRepository.bulkUpsert(
    response.data.map(l => ({ ...l, syncedAt: new Date() }))
  );
}
```

### Get Lansia by Kode

**Endpoint**: `GET /lansia/:kode`

**Headers**: Requires Authorization

**Response Success** (200):
```json
{
  "id": 1,
  "kode": "pasien202501151a",
  "nik": "3201234567890123",
  "kk": "3201234567890123",
  "nama": "Siti Aminah",
  "tanggalLahir": "1950-05-15T00:00:00.000Z",
  "gender": "P",
  "alamat": "Jl. Merdeka No. 123, Jakarta",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Response Error** (404):
```json
{
  "error": "Lansia tidak ditemukan"
}
```

### Find Lansia (Search)

**Endpoint**: `POST /find`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "query": "siti"
}
```

**Response Success** (200):
```json
[
  {
    "id": 1,
    "kode": "pasien202501151a",
    "nama": "Siti Aminah",
    "tanggalLahir": "1950-05-15T00:00:00.000Z"
  }
]
```

**Frontend Implementation**:
```typescript
// Search dengan minimal 3 karakter
if (query.length >= 3) {
  const response = await lansiaAPI.find(query);
  setResults(response.data || []);
}
```

### Get Riwayat Pemeriksaan

**Endpoint**: `GET /lansia/:kode/pemeriksaan`

**Headers**: Requires Authorization

**Response Success** (200):
```json
[
  {
    "id": 1,
    "lansiaId": 1,
    "tanggal": "2025-01-15T10:30:00.000Z",
    "tinggi": 160,
    "berat": 65,
    "bmi": 25.4,
    "kategoriBmi": "Kelebihan Berat Badan (Overweight)",
    "sistolik": 130,
    "diastolik": 85,
    "tekananDarah": "Hipertensi Tahap 1",
    "asamUrat": 6.5,
    "gulaPuasa": 110,
    "gulaSewaktu": null,
    "gula2Jpp": null,
    "klasifikasiGula": {
      "gdp": "Pra-Diabetes"
    },
    "kolesterol": 210,
    "klasifikasiKolesterol": "Batas Tinggi",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

## Pemeriksaan Management

### Create Pemeriksaan Fisik

**Endpoint**: `POST /lansia/:kode/pemeriksaan/fisik`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "tinggi": 160,
  "berat": 65,
  "sistolik": 130,
  "diastolik": 85
}
```

**Response Success** (201):
```json
{
  "id": 1,
  "lansiaId": 1,
  "tanggal": "2025-01-15T10:30:00.000Z",
  "tinggi": 160,
  "berat": 65,
  "bmi": 25.4,
  "kategoriBmi": "Kelebihan Berat Badan (Overweight)",
  "sistolik": 130,
  "diastolik": 85,
  "tekananDarah": "Hipertensi Tahap 1",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Frontend Implementation**:
```typescript
// Hitung BMI dan klasifikasi di frontend untuk preview
const bmi = hitungBMI(berat, tinggi);
const kategoriBmi = klasifikasiBMI(bmi);
const { kategori, emergency } = klasifikasiTekananDarah(sistolik, diastolik);

// Submit ke API
const response = await pemeriksaanAPI.createFisik(kode, {
  tinggi,
  berat,
  sistolik,
  diastolik
});

// Tampilkan warning jika emergency
if (emergency) {
  showNotification({
    type: 'error',
    message: 'PERHATIAN: Krisis Hipertensi - Rujuk ke Fasilitas Kesehatan Segera'
  });
}
```

### Create Pemeriksaan Kesehatan

**Endpoint**: `POST /lansia/:kode/pemeriksaan/kesehatan`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "asamUrat": 6.5,
  "gulaPuasa": 110,
  "gulaSewaktu": null,
  "gula2Jpp": null,
  "kolesterol": 210
}
```

**Response Success** (201):
```json
{
  "id": 2,
  "lansiaId": 1,
  "tanggal": "2025-01-15T10:30:00.000Z",
  "asamUrat": 6.5,
  "gulaPuasa": 110,
  "gulaSewaktu": null,
  "gula2Jpp": null,
  "klasifikasiGula": {
    "gdp": "Pra-Diabetes"
  },
  "kolesterol": 210,
  "klasifikasiKolesterol": "Batas Tinggi",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### Create Pemeriksaan Gabungan

**Endpoint**: `POST /lansia/:kode/pemeriksaan`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "tinggi": 160,
  "berat": 65,
  "sistolik": 130,
  "diastolik": 85,
  "asamUrat": 6.5,
  "gulaPuasa": 110,
  "kolesterol": 210
}
```

**Response Success** (201):
```json
{
  "id": 3,
  "lansiaId": 1,
  "tanggal": "2025-01-15T10:30:00.000Z",
  "tinggi": 160,
  "berat": 65,
  "bmi": 25.4,
  "kategoriBmi": "Kelebihan Berat Badan (Overweight)",
  "sistolik": 130,
  "diastolik": 85,
  "tekananDarah": "Hipertensi Tahap 1",
  "asamUrat": 6.5,
  "gulaPuasa": 110,
  "klasifikasiGula": {
    "gdp": "Pra-Diabetes"
  },
  "kolesterol": 210,
  "klasifikasiKolesterol": "Batas Tinggi",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Petugas Management

### Create Petugas (Admin Only)

**Endpoint**: `POST /petugas`

**Headers**: Requires Authorization (Admin only)

**Request Body**:
```json
{
  "nama": "Budi Santoso",
  "email": "budi@posyandu.com",
  "kataSandi": "password123"
}
```

**Response Success** (201):
```json
{
  "id": 2,
  "nama": "Budi Santoso",
  "email": "budi@posyandu.com",
  "aktif": true,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**Response Error** (403):
```json
{
  "error": "Akses ditolak"
}
```

### Get All Petugas (Admin Only)

**Endpoint**: `GET /petugas`

**Headers**: Requires Authorization (Admin only)

**Response Success** (200):
```json
[
  {
    "id": 2,
    "nama": "Budi Santoso",
    "email": "budi@posyandu.com",
    "aktif": true,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Update Status Petugas (Admin Only)

**Endpoint**: `PATCH /petugas/:id/status`

**Headers**: Requires Authorization (Admin only)

**Request Body**:
```json
{
  "aktif": false
}
```

**Response Success** (200):
```json
{
  "id": 2,
  "nama": "Budi Santoso",
  "email": "budi@posyandu.com",
  "aktif": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Profile Management

### Get Profile

**Endpoint**: `GET /profile`

**Headers**: Requires Authorization

**Response Success** (200):
```json
{
  "id": 1,
  "nama": "Admin Posyandu",
  "email": "admin@posyandu.com",
  "role": "ADMIN"
}
```

### Update Nama

**Endpoint**: `PATCH /profile/nama`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "nama": "Admin Posyandu Baru"
}
```

**Response Success** (200):
```json
{
  "id": 1,
  "nama": "Admin Posyandu Baru",
  "email": "admin@posyandu.com",
  "role": "ADMIN"
}
```

### Update Password

**Endpoint**: `PATCH /profile/password`

**Headers**: Requires Authorization

**Request Body**:
```json
{
  "kataSandiLama": "password123",
  "kataSandiBaru": "newpassword456"
}
```

**Response Success** (200):
```json
{
  "message": "Password berhasil diubah"
}
```

**Response Error** (400):
```json
{
  "error": "Password lama tidak sesuai"
}
```

## Error Handling

### Error Response Format

Semua error response mengikuti format standar:

```json
{
  "error": "Pesan error dalam bahasa Indonesia",
  "details": {} // Optional, untuk error validation
}
```

### HTTP Status Codes

| Status Code | Meaning | Contoh |
|------------|---------|--------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Token tidak valid atau expired |
| 403 | Forbidden | Tidak memiliki akses |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah ada (duplicate) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Frontend Error Handling

```typescript
// lib/utils/errorHandler.ts
export function handleAPIError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Terjadi kesalahan yang tidak diketahui';
}

// Usage dalam component
try {
  await lansiaAPI.create(data);
  showNotification({ type: 'success', message: 'Lansia berhasil didaftarkan' });
} catch (error) {
  const message = handleAPIError(error);
  showNotification({ type: 'error', message });
}
```

## Offline Sync

### Sync Queue Mechanism

Ketika offline, semua operasi CREATE disimpan ke sync queue di IndexedDB:

```typescript
// lib/utils/syncManager.ts
if (!navigator.onLine) {
  // Simpan ke IndexedDB
  await lansiaRepository.create(data);
  
  // Tambahkan ke sync queue
  await syncQueueRepository.add({
    entity: 'LANSIA',
    type: 'CREATE',
    data: data,
    retryCount: 0,
    createdAt: new Date()
  });
}
```

### Auto Sync on Online

Ketika kembali online, sync manager otomatis memproses queue:

```typescript
// Detect online event
window.addEventListener('online', async () => {
  await syncManager.syncAll();
});

// syncManager.syncAll() flow:
// 1. Process semua items di sync queue
// 2. Kirim ke backend API
// 3. Hapus dari queue jika berhasil
// 4. Increment retry count jika gagal
// 5. Hapus dari queue jika retry > 3
// 6. Fetch latest data dari server
// 7. Update IndexedDB dengan data terbaru
```

### Sync Status Indicator

```typescript
// components/OfflineIndicator.tsx
const { isOnline } = useOffline({
  onOnline: async () => {
    await syncManager.syncAll();
    showNotification({ 
      type: 'success', 
      message: 'Kembali online, data sedang disinkronkan' 
    });
  }
});

return isOnline ? null : (
  <div className="bg-yellow-500 text-white px-4 py-2">
    Mode Offline - Data akan disinkronkan saat kembali online
  </div>
);
```

## Rate Limiting

Backend mengimplementasikan rate limiting untuk endpoint tertentu:

### Login Endpoint

- **Limit**: 5 percobaan per 15 menit
- **Response** (429):
```json
{
  "error": "Terlalu banyak percobaan login, coba lagi dalam 15 menit"
}
```

### Frontend Handling

```typescript
try {
  await authAPI.login(email, password);
} catch (error) {
  if (error instanceof RateLimitError) {
    showNotification({
      type: 'error',
      message: 'Terlalu banyak percobaan, silakan tunggu beberapa menit'
    });
  }
}
```

## Testing API Integration

### Manual Testing dengan cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@posyandu.com","kataSandi":"password123"}'

# Get Lansia (dengan token)
curl -X GET http://localhost:5000/api/lansia \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Lansia
curl -X POST http://localhost:5000/api/lansia \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nik":"3201234567890123",
    "kk":"3201234567890123",
    "nama":"Siti Aminah",
    "tanggalLahir":"1950-05-15",
    "gender":"P",
    "alamat":"Jl. Merdeka No. 123"
  }'
```

### Health Check

Backend menyediakan health check endpoint:

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Best Practices

### 1. Token Management

- Token disimpan di httpOnly cookie untuk keamanan
- Token expired setelah 15 menit
- Automatic logout saat token expired
- Refresh token tidak diimplementasikan (user harus login ulang)

### 2. Request Optimization

- Gunakan IndexedDB untuk cache data
- Fetch data hanya saat diperlukan
- Implement pagination untuk list data (future enhancement)

### 3. Error Recovery

- Retry logic untuk network errors
- Fallback ke IndexedDB saat offline
- User-friendly error messages dalam bahasa Indonesia

### 4. Security

- Semua request menggunakan HTTPS di production
- JWT token di httpOnly cookie
- CORS configured di backend
- Rate limiting untuk prevent abuse

## Troubleshooting

### CORS Error

**Problem**: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: Pastikan backend sudah configure CORS dengan benar:

```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Token Expired

**Problem**: Request return 401 Unauthorized

**Solution**: Token expired setelah 15 menit. User harus login ulang.

```typescript
// middleware.ts
if (error.statusCode === 401) {
  removeCookie('token');
  redirect('/login');
}
```

### Network Timeout

**Problem**: Request timeout setelah 30 detik

**Solution**: Check koneksi internet atau backend server status.

```typescript
// lib/api/client.ts
const REQUEST_TIMEOUT = 30000; // 30 detik

// Increase timeout jika diperlukan
const response = await fetchWithTimeout(url, { timeout: 60000 });
```

## Support

Untuk pertanyaan atau issue terkait API integration:

1. Check dokumentasi backend: `backend/README.md`
2. Check API logs di backend: `backend/logs/`
3. Test endpoint dengan Postman atau cURL
4. Contact backend team untuk API issues

