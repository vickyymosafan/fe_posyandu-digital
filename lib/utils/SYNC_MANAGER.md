# Sync Manager Documentation

## Overview

SyncManager adalah class yang mengelola sinkronisasi data antara IndexedDB (offline storage) dan Backend API. System ini memungkinkan aplikasi untuk bekerja offline dan otomatis sync data saat kembali online.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Actions                         │
│  (Create Lansia, Create Pemeriksaan, etc.)             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Online Check                           │
│  navigator.onLine ? Direct API : Queue to IndexedDB    │
└─────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴───────┐
                    │               │
              Online│               │Offline
                    ↓               ↓
        ┌──────────────────┐  ┌──────────────────┐
        │   Backend API    │  │   Sync Queue     │
        │                  │  │   (IndexedDB)    │
        └──────────────────┘  └──────────────────┘
                                      ↓
                              ┌──────────────────┐
                              │  Back Online?    │
                              │  Auto Sync!      │
                              └──────────────────┘
                                      ↓
                              ┌──────────────────┐
                              │  Process Queue   │
                              │  → Backend API   │
                              └──────────────────┘
```

## Components

### 1. useOffline Hook

Hook untuk detect online/offline status browser.

**Features:**
- Real-time online/offline detection
- Event-driven dengan browser API
- Callback support untuk trigger actions
- Clean and simple API

**Usage:**

```typescript
import { useOffline } from '@/lib/hooks';

function MyComponent() {
  const { isOnline } = useOffline({
    onOnline: () => {
      console.log('Back online!');
      // Trigger sync atau actions lain
    },
    onOffline: () => {
      console.log('Gone offline!');
      // Show notification atau update UI
    },
  });

  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
```

**API:**

```typescript
interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

interface UseOfflineReturn {
  isOnline: boolean;
}

function useOffline(options?: UseOfflineOptions): UseOfflineReturn;
```

### 2. SyncManager Class

Class untuk orchestrate sync process antara IndexedDB dan Backend API.

**Features:**
- Automatic sync queue processing
- Retry mechanism dengan max 3 retries
- Graceful error handling
- Prevent concurrent sync
- Bidirectional sync (queue → API, API → IndexedDB)

**Usage:**

```typescript
import { syncManager } from '@/lib/utils';

// Trigger manual sync
await syncManager.syncAll();

// Check sync status
if (syncManager.isSyncInProgress()) {
  console.log('Syncing...');
}
```

**API:**

```typescript
class SyncManager {
  /**
   * Sync semua data dari queue ke server dan fetch latest data
   */
  async syncAll(): Promise<void>;

  /**
   * Check if currently syncing
   */
  isSyncInProgress(): boolean;
}
```

### 3. OfflineIndicator Component

Component untuk display offline indicator di UI.

**Features:**
- Auto-hide saat online
- Auto-show saat offline
- Trigger sync saat kembali online
- Accessible dengan ARIA attributes

**Usage:**

```typescript
import { OfflineIndicator } from '@/components';

function Layout({ children }) {
  return (
    <div>
      <OfflineIndicator />
      {children}
    </div>
  );
}
```

## Sync Flow

### Offline → Online Sync

1. **User performs action offline**
   - Data disimpan ke IndexedDB
   - Item ditambahkan ke sync queue

2. **Browser detects online**
   - useOffline hook trigger onOnline callback
   - SyncManager.syncAll() dipanggil

3. **Process sync queue**
   - Iterate semua items di queue
   - Call appropriate API untuk each item
   - Remove item dari queue jika success
   - Increment retry count jika error
   - Remove item jika retry count > 3

4. **Sync from server**
   - Fetch latest data dari Backend API
   - Bulk upsert ke IndexedDB
   - Update syncedAt timestamp

### Error Handling

**Retry Mechanism:**
- Max retries: 3
- Increment retry count on error
- Remove from queue after max retries
- Log errors untuk debugging

**Graceful Degradation:**
- Don't throw errors to caller
- Continue processing other items
- Log errors untuk monitoring
- Show user-friendly messages

**Network Errors:**
- Timeout: 30 seconds (dari APIClient)
- Retry on network error
- Skip sync jika offline

## Data Models

### SyncQueueDB

```typescript
interface SyncQueueDB {
  id?: number;
  entity: 'LANSIA' | 'PEMERIKSAAN';
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: unknown;
  retryCount: number;
  createdAt: Date;
}
```

### Queue Item Examples

**Lansia Create:**
```typescript
{
  entity: 'LANSIA',
  type: 'CREATE',
  data: {
    nik: '1234567890123456',
    kk: '1234567890123456',
    nama: 'John Doe',
    tanggalLahir: '1950-01-01',
    gender: 'L',
    alamat: 'Jl. Example No. 123'
  },
  retryCount: 0,
  createdAt: new Date()
}
```

**Pemeriksaan Create:**
```typescript
{
  entity: 'PEMERIKSAAN',
  type: 'CREATE',
  data: {
    kode: 'pasien202501011A',
    tinggi: 170,
    berat: 70,
    sistolik: 120,
    diastolik: 80,
    gulaPuasa: 90,
    kolesterol: 180
  },
  retryCount: 0,
  createdAt: new Date()
}
```

## Integration Guide

### 1. Add to Layout

```typescript
// app/layout.tsx
import { OfflineIndicator } from '@/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <OfflineIndicator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use in Components

```typescript
// components/LansiaForm.tsx
import { useOffline } from '@/lib/hooks';
import { syncQueueRepository } from '@/lib/db';
import { lansiaAPI } from '@/lib/api';

function LansiaForm() {
  const { isOnline } = useOffline();

  const handleSubmit = async (data: CreateLansiaData) => {
    if (isOnline) {
      // Direct API call
      const response = await lansiaAPI.create(data);
      // Handle response
    } else {
      // Add to sync queue
      await syncQueueRepository.add({
        entity: 'LANSIA',
        type: 'CREATE',
        data,
      });
      // Show success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Manual Sync Trigger

```typescript
// components/SyncButton.tsx
import { syncManager } from '@/lib/utils';

function SyncButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncManager.syncAll();
      alert('Sync completed!');
    } catch (error) {
      alert('Sync failed!');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button onClick={handleSync} disabled={syncing}>
      {syncing ? 'Syncing...' : 'Sync Now'}
    </button>
  );
}
```

## Best Practices

### 1. Always Check Online Status

```typescript
// ✅ Good
if (isOnline) {
  await api.create(data);
} else {
  await syncQueue.add({ entity: 'LANSIA', type: 'CREATE', data });
}

// ❌ Bad
await api.create(data); // Will fail offline
```

### 2. Handle Sync Errors Gracefully

```typescript
// ✅ Good
try {
  await syncManager.syncAll();
} catch (error) {
  console.error('Sync failed:', error);
  // Show user-friendly message
  // Don't block user
}

// ❌ Bad
await syncManager.syncAll(); // Unhandled error
```

### 3. Show Sync Status to User

```typescript
// ✅ Good
<OfflineIndicator />
{syncing && <SyncingIndicator />}

// ❌ Bad
// No feedback to user
```

### 4. Test Offline Scenarios

```typescript
// Test offline mode
// 1. Open DevTools
// 2. Go to Network tab
// 3. Set throttling to "Offline"
// 4. Test create/update operations
// 5. Go back online
// 6. Verify auto-sync works
```

## Troubleshooting

### Sync Not Triggering

**Problem:** Auto-sync tidak jalan saat kembali online

**Solution:**
1. Check useOffline hook properly setup
2. Verify onOnline callback calls syncManager.syncAll()
3. Check browser console untuk errors
4. Verify navigator.onLine works di browser

### Queue Items Not Processing

**Problem:** Items stuck di queue

**Solution:**
1. Check network connectivity
2. Verify API endpoints working
3. Check retry count (max 3)
4. Look for errors di console
5. Manually trigger sync dengan syncManager.syncAll()

### Data Not Syncing from Server

**Problem:** Latest data tidak muncul di IndexedDB

**Solution:**
1. Verify API returns data correctly
2. Check bulkUpsert implementation
3. Verify syncedAt timestamp updated
4. Check IndexedDB di DevTools

## Performance Considerations

### 1. Batch Operations

SyncManager process queue items sequentially untuk avoid overwhelming server. Untuk large queues, consider:
- Batch API calls
- Implement progress indicator
- Add delay between batches

### 2. Debounce Sync Triggers

Avoid excessive sync calls dengan debounce:

```typescript
const debouncedSync = debounce(() => syncManager.syncAll(), 1000);

useOffline({
  onOnline: debouncedSync
});
```

### 3. Background Sync

Consider using Background Sync API untuk better UX:

```typescript
// Register background sync
if ('serviceWorker' in navigator && 'sync' in registration) {
  await registration.sync.register('sync-data');
}
```

## Future Enhancements

### Phase 2
- [ ] Implement UPDATE and DELETE sync
- [ ] Add conflict resolution strategy
- [ ] Implement partial sync (by entity type)
- [ ] Add sync progress indicator
- [ ] Implement background sync API

### Phase 3
- [ ] Add sync scheduling (periodic sync)
- [ ] Implement delta sync (only changed data)
- [ ] Add sync analytics and monitoring
- [ ] Implement multi-device sync
- [ ] Add sync conflict UI

## References

- [MDN: Online and offline events](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN: Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
- [IndexedDB Best Practices](https://developers.google.com/web/ilt/pwa/working-with-indexeddb)
