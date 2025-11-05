# Offline & Sync Manager Implementation

## Overview

Sistem Offline & Sync Manager telah diimplementasikan untuk memungkinkan aplikasi bekerja offline dan otomatis sinkronisasi data saat kembali online. Implementasi mengikuti prinsip SOLID, design patterns, dan best practices.

## Files Created (6 files)

### Core Files

1. **lib/hooks/useOffline.ts** - Hook untuk detect online/offline status
   - Real-time detection dengan browser API
   - Event-driven dengan window.addEventListener
   - Callback support untuk trigger actions
   - Clean and simple API

2. **lib/utils/syncManager.ts** - Class untuk orchestrate sync process
   - Process sync queue items
   - Retry mechanism dengan max 3 retries
   - Bidirectional sync (queue → API, API → IndexedDB)
   - Graceful error handling
   - Singleton pattern untuk reuse

3. **components/OfflineIndicator.tsx** - Component untuk display offline indicator
   - Auto-hide/show based on online status
   - Trigger sync saat kembali online
   - Accessible dengan ARIA attributes
   - Responsive design

### Supporting Files

4. **lib/hooks/index.ts** (updated) - Export useOffline
5. **lib/utils/index.ts** (updated) - Export syncManager
6. **components/index.ts** (new) - Central export untuk components

### Documentation

7. **lib/utils/SYNC_MANAGER.md** - Comprehensive documentation
   - Architecture overview
   - Usage examples
   - Integration guide
   - Best practices
   - Troubleshooting guide

## Features Implemented

### ✅ Online/Offline Detection

**useOffline Hook:**
- Detect browser online/offline status
- Real-time updates dengan event listeners
- Callback support untuk custom actions
- Type-safe dengan TypeScript

**Usage:**
```typescript
const { isOnline } = useOffline({
  onOnline: () => console.log('Back online!'),
  onOffline: () => console.log('Gone offline!')
});
```

### ✅ Sync Queue Processing

**SyncManager Class:**
- Process all items di sync queue
- Call appropriate API untuk each item
- Remove item jika success
- Increment retry count jika error
- Remove item setelah 3 retries

**Supported Operations:**
- CREATE Lansia
- CREATE Pemeriksaan
- (UPDATE dan DELETE akan diimplementasi nanti)

### ✅ Bidirectional Sync

**Queue → API:**
- Process offline actions saat kembali online
- Retry mechanism untuk handle transient errors
- Graceful degradation untuk permanent errors

**API → IndexedDB:**
- Fetch latest data dari server
- Bulk upsert ke IndexedDB
- Update syncedAt timestamp

### ✅ Auto-Sync

**Trigger Conditions:**
- Saat browser kembali online (via useOffline callback)
- Manual trigger via syncManager.syncAll()
- (Future: Periodic sync, background sync)

**Prevent Concurrent Sync:**
- isSyncing flag untuk prevent multiple sync
- Queue subsequent sync requests
- Log sync status untuk debugging

### ✅ Error Handling

**Retry Mechanism:**
- Max 3 retries per item
- Increment retry count on error
- Remove from queue after max retries
- Log errors untuk monitoring

**Graceful Degradation:**
- Don't throw errors to caller
- Continue processing other items
- Show user-friendly messages
- Log errors untuk debugging

### ✅ Offline Indicator

**OfflineIndicator Component:**
- Display "Mode Offline" badge saat offline
- Auto-hide saat online
- Trigger sync saat kembali online
- Accessible dan responsive

## Design Principles Applied

### SOLID Principles

#### Single Responsibility Principle (SRP)
- ✅ useOffline: Hanya detect online/offline status
- ✅ SyncManager: Hanya handle sync logic
- ✅ OfflineIndicator: Hanya display offline status

#### Open/Closed Principle (OCP)
- ✅ useOffline extensible dengan callbacks
- ✅ SyncManager extensible untuk new entity types
- ✅ OfflineIndicator customizable dengan props (future)

#### Liskov Substitution Principle (LSP)
- ✅ SyncManager bisa diganti dengan mock untuk testing
- ✅ Repositories bisa diganti dengan mock implementations

#### Interface Segregation Principle (ISP)
- ✅ useOffline return minimal interface (isOnline)
- ✅ SyncManager expose minimal public API
- ✅ Clear separation of concerns

#### Dependency Inversion Principle (DIP)
- ✅ SyncManager depend on repository abstraction
- ✅ Components depend on hooks, bukan direct implementation
- ✅ Easy to mock dan test

### Other Design Principles

#### Separation of Concerns (SoC)
- ✅ Online/offline detection terpisah dari sync logic
- ✅ UI components terpisah dari business logic
- ✅ Clear layer separation

#### Don't Repeat Yourself (DRY)
- ✅ Reuse existing repositories dan APIs
- ✅ Single source of truth untuk sync logic
- ✅ Centralized exports

#### Keep It Simple, Stupid (KISS)
- ✅ Simple browser API untuk online detection
- ✅ Straightforward sync flow
- ✅ Minimal complexity

#### You Aren't Gonna Need It (YAGNI)
- ✅ Hanya implement yang diperlukan
- ✅ No over-engineering
- ✅ Future enhancements documented tapi tidak implemented

## Integration Points

### 1. With IndexedDB

**Repositories Used:**
- syncQueueRepository: Manage sync queue
- lansiaRepository: Store lansia data
- pemeriksaanRepository: Store pemeriksaan data (future)

**Operations:**
- getAll(): Fetch all queue items
- delete(): Remove processed items
- incrementRetryCount(): Track retries
- bulkUpsert(): Sync data from server

### 2. With Backend API

**APIs Used:**
- lansiaAPI: Create lansia, fetch all lansia
- pemeriksaanAPI: Create pemeriksaan
- (Future: Update, delete operations)

**Error Handling:**
- Timeout: 30 seconds (dari APIClient)
- Retry on network error
- Handle 401, 403, 500 errors

### 3. With React Components

**Hooks:**
- useOffline: Detect online/offline status
- useAuth: Access user context (future integration)

**Components:**
- OfflineIndicator: Display offline status
- (Future: SyncProgress, SyncButton)

## Usage Examples

### 1. Basic Online/Offline Detection

```typescript
import { useOffline } from '@/lib/hooks';

function MyComponent() {
  const { isOnline } = useOffline();
  
  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
```

### 2. Auto-Sync on Online

```typescript
import { useOffline } from '@/lib/hooks';
import { syncManager } from '@/lib/utils';

function MyComponent() {
  const { isOnline } = useOffline({
    onOnline: async () => {
      await syncManager.syncAll();
    }
  });
  
  return <div>...</div>;
}
```

### 3. Manual Sync Trigger

```typescript
import { syncManager } from '@/lib/utils';

async function handleSync() {
  try {
    await syncManager.syncAll();
    alert('Sync completed!');
  } catch (error) {
    alert('Sync failed!');
  }
}
```

### 4. Offline Indicator in Layout

```typescript
import { OfflineIndicator } from '@/components';

export default function Layout({ children }) {
  return (
    <div>
      <OfflineIndicator />
      {children}
    </div>
  );
}
```

### 5. Queue Offline Actions

```typescript
import { useOffline } from '@/lib/hooks';
import { syncQueueRepository } from '@/lib/db';
import { lansiaAPI } from '@/lib/api';

async function handleSubmit(data: CreateLansiaData) {
  const { isOnline } = useOffline();
  
  if (isOnline) {
    // Direct API call
    await lansiaAPI.create(data);
  } else {
    // Add to sync queue
    await syncQueueRepository.add({
      entity: 'LANSIA',
      type: 'CREATE',
      data
    });
  }
}
```

## Testing Strategy

### Manual Testing

1. **Online → Offline:**
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Verify offline indicator shows
   - Try create lansia → should queue

2. **Offline → Online:**
   - Go back online
   - Verify offline indicator hides
   - Verify auto-sync triggers
   - Check queue is empty

3. **Sync Errors:**
   - Mock API error
   - Verify retry mechanism
   - Verify item removed after 3 retries

### Unit Testing (Future)

- Test useOffline hook
- Test SyncManager methods
- Test error handling
- Test retry mechanism

### Integration Testing (Future)

- Test end-to-end sync flow
- Test with real IndexedDB
- Test with mock API
- Test concurrent sync prevention

## Performance Considerations

### 1. Prevent Concurrent Sync

**Problem:** Multiple sync triggers bisa cause race conditions

**Solution:**
- isSyncing flag untuk prevent concurrent sync
- Queue subsequent sync requests
- Log sync status

### 2. Batch Operations

**Current:** Sequential processing
**Future:** Batch API calls untuk better performance

### 3. Debounce Sync Triggers

**Current:** Immediate sync on online
**Future:** Debounce untuk avoid excessive calls

## Security Considerations

### 1. Token Management

- Sync requires valid JWT token
- Token checked di APIClient
- Auto-logout on 401 error

### 2. Data Validation

- Validate data before queue
- Validate data before API call
- Handle validation errors gracefully

### 3. Error Logging

- Log errors untuk monitoring
- Don't expose sensitive data
- Use proper error messages

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

## Dependencies

**No new dependencies added!**

All implementation menggunakan:
- Browser API (navigator.onLine, window.addEventListener)
- Existing repositories dan APIs
- React hooks (useState, useEffect, useCallback)

## Documentation

### 1. Code Documentation
- ✅ Semua functions documented dengan JSDoc
- ✅ Semua comments dalam bahasa Indonesia
- ✅ Usage examples di comments

### 2. README Documentation
- ✅ SYNC_MANAGER.md dengan comprehensive guide
- ✅ Architecture overview
- ✅ Integration guide
- ✅ Best practices
- ✅ Troubleshooting guide

### 3. Type Safety
- ✅ Full TypeScript support
- ✅ Proper interfaces dan types
- ✅ No any types

## Commit Message

```bash
feat(offline): implementasi offline & sync manager dengan auto-sync

- Tambah useOffline hook untuk detect online/offline status browser
- Tambah SyncManager class untuk orchestrate sync process
- Tambah OfflineIndicator component untuk display offline status
- Implementasi auto-sync saat kembali online
- Implementasi retry mechanism dengan max 3 retries
- Implementasi bidirectional sync (queue → API, API → IndexedDB)
- Tambah comprehensive documentation dan usage examples

Implementasi mengikuti prinsip SOLID (SRP, OCP, LSP, ISP, DIP) dan
design principles (SoC, DRY, KISS, YAGNI). SyncManager process sync
queue items dengan graceful error handling dan retry mechanism.
useOffline hook detect online/offline status dengan browser API dan
trigger auto-sync saat kembali online.

Features: Online/offline detection, sync queue processing, auto-sync,
retry mechanism, offline indicator, bidirectional sync.

No new dependencies added. Semua implementation menggunakan browser API
dan existing repositories/APIs.

Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
```
