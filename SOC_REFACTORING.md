# Separation of Concerns (SoC) Refactoring

## Summary

Applied Separation of Concerns principle by creating a dedicated Services Layer that isolates business logic from UI components and hooks. This improves maintainability, testability, and code organization.

## Principle Applied

**Separation of Concerns (SoC)**: Different concerns should be separated into distinct modules/layers, each with a single, well-defined responsibility.

## Problem Identified

### Before Refactoring

Hooks were mixing multiple concerns:

```typescript
// usePemeriksaanGabunganForm - MIXING TOO MANY CONCERNS
export function usePemeriksaanGabunganForm() {
  // 1. Form state management (React concern)
  const [formData, setFormData] = useState(...);
  
  // 2. Business logic - BMI calculation (Domain concern)
  useEffect(() => {
    const bmi = hitungBMISafe(berat, tinggi);
    const kategori = klasifikasiBMISafe(bmi);
    setBmiResult({ nilai: bmi, kategori });
  }, [formData.berat, formData.tinggi]);
  
  // 3. Business logic - Blood pressure classification (Domain concern)
  useEffect(() => {
    const result = klasifikasiTekananDarahSafe(sistolik, diastolik);
    setTekananDarahResult(result);
  }, [formData.sistolik, formData.diastolik]);
  
  // 4. Data layer - API calls (Data concern)
  const response = await pemeriksaanAPI.createGabungan(kode, data);
  
  // 5. UI concern - Navigation
  router.push(`/petugas/lansia/${kode}`);
  
  // 6. UI concern - Notifications
  showNotification('success', 'Pemeriksaan berhasil disimpan');
}
```

**Problems**:
1. ❌ Business logic scattered in hooks (hard to test)
2. ❌ Difficult to reuse calculations outside React
3. ❌ Hooks become too complex and hard to maintain
4. ❌ Violates SoC - mixing UI, business, and data concerns
5. ❌ Hard to unit test business logic independently

## Solution Implemented

### Services Layer Architecture

Created a **Services Layer** that separates concerns into distinct layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components, Hooks, UI Logic)          │
│  - React state management               │
│  - User interactions                    │
│  - Rendering                            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Services Layer (NEW)            │
│  (Business Logic, Domain Operations)    │
│  - Health calculations                  │
│  - Data transformations                 │
│  - Business rules                       │
│  - Coordination logic                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Layer                      │
│  (API, IndexedDB, Repositories)         │
│  - Data persistence                     │
│  - External communication               │
│  - Data access                          │
└─────────────────────────────────────────┘
```

## Files Created

### 1. `lib/services/healthMetricsService.ts`

**Responsibility**: Health metric calculations and classifications

**Separates**:
- BMI calculation logic from hooks
- Blood pressure classification from hooks
- Blood glucose classification from hooks
- Cholesterol classification from hooks
- Uric acid classification from hooks

**Benefits**:
```typescript
// Before: Logic scattered in hooks
useEffect(() => {
  const bmi = hitungBMISafe(berat, tinggi);
  const kategori = klasifikasiBMISafe(bmi);
  setBmiResult({ nilai: bmi, kategori });
}, [berat, tinggi]);

// After: Clean service function
const bmiResult = calculateBMIFromStrings(berat, tinggi);
```

### 2. `lib/services/lansiaService.ts`

**Responsibility**: Lansia (patient) business operations

**Separates**:
- ID generation logic from hooks
- Online/offline coordination from hooks
- Data transformation from hooks
- CRUD operations orchestration

**Benefits**:
```typescript
// Before: Complex logic in hook
const kode = await generateIdPasien();
if (isOnline) {
  const response = await lansiaAPI.create(data);
  await lansiaRepository.create({...response.data, syncedAt: new Date()});
} else {
  await lansiaRepository.create({...data, id: Date.now()});
  await syncQueueRepository.add({entity: 'LANSIA', type: 'CREATE', data});
}

// After: Simple service call
const result = await createLansia(data, isOnline);
```

### 3. `lib/services/pemeriksaanService.ts`

**Responsibility**: Pemeriksaan (examination) business operations

**Separates**:
- Data transformation from hooks
- Online/offline coordination from hooks
- Examination creation logic

**Benefits**:
```typescript
// Before: Transformation logic in hook
const data: PemeriksaanGabunganData = {
  tinggi: parseFloat(formData.tinggi),
  berat: parseFloat(formData.berat),
  // ... more transformations
};

// After: Clean service function
const data = transformGabunganFormData(formData);
```

### 4. `lib/services/index.ts`

Central export for all services with clear documentation.

## Benefits

### 1. Clear Separation of Concerns

Each layer has a single, well-defined responsibility:

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Presentation** | UI, React state, user interaction | Components, Hooks |
| **Services** | Business logic, calculations, coordination | healthMetricsService, lansiaService |
| **Data** | Persistence, API calls, data access | API clients, Repositories |

### 2. Improved Testability

Business logic can now be tested independently:

```typescript
// Easy to unit test without React
describe('healthMetricsService', () => {
  it('should calculate BMI correctly', () => {
    const result = calculateBMI(70, 170);
    expect(result.nilai).toBe(24.22);
    expect(result.kategori).toBe('Kelebihan Berat Badan');
  });
});
```

### 3. Better Reusability

Services can be used anywhere, not just in React:

```typescript
// Can use in hooks
const bmiResult = calculateBMIFromStrings(berat, tinggi);

// Can use in utilities
const bmi = calculateBMI(70, 170);

// Can use in workers
self.onmessage = (e) => {
  const result = calculateAllHealthMetrics(e.data, 'L');
  self.postMessage(result);
};
```

### 4. Simplified Hooks

Hooks become simpler and focus on React concerns:

```typescript
// Before: 200+ lines with business logic
export function usePemeriksaanGabunganForm() {
  // Complex calculations
  // Data transformations
  // API calls
  // Offline handling
}

// After: Focused on React state and coordination
export function usePemeriksaanGabunganForm() {
  const [formData, setFormData] = useState(...);
  
  // Delegate to services
  const metrics = calculateAllHealthMetrics(formData, gender);
  
  const handleSubmit = async () => {
    const data = transformGabunganFormData(formData);
    const result = await createPemeriksaanGabungan(kode, lansiaId, data, isOnline);
  };
}
```

### 5. Easier Maintenance

Changes to business logic don't affect UI:

```typescript
// Change BMI calculation algorithm
// Only need to update healthMetricsService.ts
// Hooks and components remain unchanged
```

## Layer Responsibilities

### Presentation Layer (Components & Hooks)
- ✅ React state management
- ✅ User interactions
- ✅ UI rendering
- ✅ Form handling
- ✅ Routing/navigation
- ❌ Business logic
- ❌ Data transformations
- ❌ Calculations

### Services Layer (Business Logic)
- ✅ Business logic
- ✅ Calculations
- ✅ Data transformations
- ✅ Coordination between layers
- ✅ Domain operations
- ❌ UI rendering
- ❌ React state
- ❌ Direct data access

### Data Layer (API & Repositories)
- ✅ Data persistence
- ✅ API communication
- ✅ Data access
- ✅ Caching
- ❌ Business logic
- ❌ UI concerns
- ❌ Calculations

## Usage Examples

### Example 1: Calculate Health Metrics

```typescript
import { calculateAllHealthMetrics } from '@/lib/services';

const metrics = calculateAllHealthMetrics({
  tinggi: '170',
  berat: '70',
  sistolik: '120',
  diastolik: '80',
  gulaPuasa: '95',
  kolesterol: '180',
  asamUrat: '5.5',
}, 'L');

console.log(metrics.bmi.kategori); // "Kelebihan Berat Badan"
console.log(metrics.tekananDarah.kategori); // "Batas Waspada"
```

### Example 2: Create Lansia

```typescript
import { createLansia, transformFormDataToCreateLansiaData } from '@/lib/services';

const formData = { nik: '...', kk: '...', nama: '...', ... };
const data = transformFormDataToCreateLansiaData(formData);
const result = await createLansia(data, isOnline);

if (result.success) {
  console.log('Patient created:', result.kode);
}
```

### Example 3: Create Pemeriksaan

```typescript
import { transformGabunganFormData, createPemeriksaanGabungan } from '@/lib/services';

const data = transformGabunganFormData(formData);
const result = await createPemeriksaanGabungan(kode, lansiaId, data, isOnline);

if (result.success) {
  console.log('Examination created');
}
```

## Migration Path

Existing hooks can gradually migrate to use services:

1. **Phase 1**: Create services (✅ Done)
2. **Phase 2**: Update hooks to use services (Optional)
3. **Phase 3**: Remove duplicated logic from hooks (Optional)

**Note**: Existing code continues to work. Services provide an alternative, cleaner approach.

## Testing Strategy

### Unit Tests for Services

```typescript
// Test business logic independently
describe('healthMetricsService', () => {
  test('BMI calculation', () => { ... });
  test('Blood pressure classification', () => { ... });
  test('Aggregate metrics', () => { ... });
});
```

### Integration Tests for Hooks

```typescript
// Test React integration
describe('usePemeriksaanGabunganForm', () => {
  test('form submission', () => { ... });
  test('real-time calculations', () => { ... });
});
```

## Impact

- **Separation of Concerns**: ⬆️⬆️⬆️ Dramatically improved
- **Testability**: ⬆️⬆️⬆️ Much easier to test
- **Maintainability**: ⬆️⬆️ Easier to maintain
- **Reusability**: ⬆️⬆️⬆️ Logic can be reused anywhere
- **Code Organization**: ⬆️⬆️ Clearer structure
- **Breaking Changes**: ✅ None - fully additive

Date: November 7, 2025
