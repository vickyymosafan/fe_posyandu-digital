# Dashboard Authorization Fix

## Problem

Dashboard mengalami error "Akses ditolak" (AuthorizationError) saat user dengan role **PETUGAS** login dan mengakses dashboard.

### Root Cause

Hook `useDashboardStats` memanggil `petugasAPI.getAll()` yang merupakan endpoint **Admin only**. Ketika Petugas mencoba mengakses endpoint ini, backend mengembalikan error 403 Forbidden dengan pesan "Akses ditolak".

### Error Log

```
[API Client] Error Response: {}
❌ [useDashboardStats] CRITICAL ERROR - Dashboard failed to load!
❌ [useDashboardStats] Error message: "Akses ditolak"
AuthorizationError: Akses ditolak
```

## Solution

### 1. Smart Role-Based Data Fetching

Mengubah `useDashboardStats` hook untuk menjadi **role-aware**:

```typescript
// Before: Always fetch petugas data (fails for PETUGAS role)
const [petugasResponse, lansiaResponse] = await Promise.all([
  petugasAPI.getAll(), // ❌ Fails for PETUGAS
  lansiaAPI.getAll(),
]);

// After: Conditional fetch based on user role
if (user?.role === 'ADMIN') {
  // Admin: Fetch all data including petugas
  const [petugasResponse, lansiaResponse] = await Promise.all([
    petugasAPI.getAll(), // ✅ OK for ADMIN
    lansiaAPI.getAll(),
  ]);
} else {
  // Petugas: Only fetch lansia (no access to petugas endpoint)
  const lansiaResponse = await lansiaAPI.getAll(); // ✅ OK for PETUGAS
  totalPetugasAktif = 0; // Set to 0 for Petugas
}
```

### 2. Fallback to IndexedDB

Menambahkan fallback ke IndexedDB jika API call gagal (untuk offline support):

```typescript
try {
  const lansiaResponse = await lansiaAPI.getAll();
  totalLansia = lansiaResponse.data ? lansiaResponse.data.length : 0;
} catch (apiError) {
  console.warn('[useDashboardStats] API fetch failed, using IndexedDB fallback');
  const lansiaFromDB = await lansiaRepository.getAll();
  totalLansia = lansiaFromDB.length;
}
```

### 3. User-Aware useEffect

Menambahkan dependency pada `user?.role` untuk re-fetch saat user berubah:

```typescript
useEffect(() => {
  // Only fetch if user is authenticated
  if (!user) {
    console.log('[useDashboardStats] No user, skipping fetch');
    setIsLoading(false);
    return;
  }

  checkBackendHealthVerbose().then(() => {
    fetchStats();
  });
}, [user?.role]); // Re-fetch when user role changes
```

## Design Principles Applied

### SOLID Principles

1. **SRP (Single Responsibility Principle)**
   - Hook tetap hanya bertanggung jawab untuk fetch dashboard stats
   - Logic role-based fetching encapsulated dalam hook

2. **OCP (Open/Closed Principle)**
   - Hook mudah diperluas untuk role baru tanpa mengubah existing code
   - Conditional logic based on role, bukan hardcoded

3. **DIP (Dependency Inversion Principle)**
   - Hook depend pada `useAuth` abstraction, bukan detail implementasi
   - Components depend pada hook interface, bukan fetch logic

### Design Principles

1. **SoC (Separation of Concerns)**
   - Data fetching logic di hook
   - UI rendering di components
   - Role-based logic di hook, bukan di component

2. **DRY (Don't Repeat Yourself)**
   - Single hook untuk both Admin dan Petugas dashboard
   - Reusable logic untuk different roles

3. **KISS (Keep It Simple, Stupid)**
   - Simple conditional based on user role
   - No complex abstraction

4. **Fail Fast**
   - Early return jika user tidak authenticated
   - Clear error messages untuk debugging

## Files Changed

1. **frontend/lib/hooks/useDashboardStats.ts**
   - Added `useAuth` import
   - Added role-based conditional fetching
   - Added IndexedDB fallback
   - Added user-aware useEffect dependency

## Testing

### Test Case 1: Admin Login
- ✅ Should fetch petugas data
- ✅ Should fetch lansia data
- ✅ Should display "Total Petugas Aktif" stat
- ✅ Should display "Total Lansia Terdaftar" stat
- ✅ Should display "Pemeriksaan Hari Ini" stat

### Test Case 2: Petugas Login
- ✅ Should NOT fetch petugas data (no access)
- ✅ Should fetch lansia data
- ✅ Should NOT display "Total Petugas Aktif" stat (already hidden in UI)
- ✅ Should display "Total Lansia Terdaftar" stat
- ✅ Should display "Pemeriksaan Hari Ini" stat

### Test Case 3: Offline Mode
- ✅ Should fallback to IndexedDB for lansia data
- ✅ Should still display stats from local data

## Benefits

1. **No More Authorization Errors**
   - Petugas can access dashboard without errors
   - Admin still gets full data

2. **Better Performance**
   - Petugas dashboard loads faster (fewer API calls)
   - No unnecessary requests to restricted endpoints

3. **Offline Support**
   - Fallback to IndexedDB when API fails
   - Better user experience in poor network conditions

4. **Maintainable**
   - Clear separation of concerns
   - Easy to add new roles in the future
   - Well-documented code

## Related Issues

- Error: "Akses ditolak" on Petugas dashboard
- AuthorizationError when fetching dashboard stats
- Dashboard fails to load for non-admin users

## Prevention

To prevent similar issues in the future:

1. **Always check user role** before calling role-restricted endpoints
2. **Use role-aware hooks** for data fetching
3. **Add proper error handling** with fallbacks
4. **Test with different user roles** during development
5. **Document role restrictions** in API documentation

## References

- [API_INTEGRATION.md](./API_INTEGRATION.md) - API endpoint documentation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Hook organization
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

