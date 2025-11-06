# Fail Fast Implementation

## Overview

Fail Fast adalah prinsip software development dimana aplikasi segera menghentikan eksekusi dan throw error saat mendeteksi kondisi invalid, daripada membiarkan error propagate dan menyebabkan bug yang sulit di-debug.

## Prinsip Fail Fast

### 1. Validate Input Immediately

```typescript
// ❌ BAD: Tidak validate input
function hitungBMI(berat: number, tinggi: number) {
  return berat / ((tinggi / 100) ** 2);
}

// ✅ GOOD: Validate input immediately
function hitungBMI(berat: number, tinggi: number) {
  assertValidNumber(berat, 'Berat badan');
  assertValidNumber(tinggi, 'Tinggi badan');
  assertInRange(berat, 20, 300, 'Berat badan');
  assertInRange(tinggi, 50, 250, 'Tinggi badan');
  
  return berat / ((tinggi / 100) ** 2);
}
```

### 2. Throw Errors, Don't Return Null

```typescript
// ❌ BAD: Return null on error
function getUser(id: number): User | null {
  if (!id) return null;
  // ...
}

// ✅ GOOD: Throw error immediately
function getUser(id: number): User {
  assertValidNumber(id, 'User ID');
  // ...
}
```

### 3. Make Bugs Obvious and Loud

```typescript
// ❌ BAD: Silent failure
function updateUser(user: User) {
  if (!user) return; // Silent failure
  // ...
}

// ✅ GOOD: Loud failure
function updateUser(user: User) {
  assertDefined(user, 'User is required');
  assertHasProperties(user, ['id', 'name', 'email'], 'User');
  // ...
}
```

## Fail Fast Utilities

### assertDefined

Assert value is not null or undefined.

```typescript
const user = await getUser();
assertDefined(user, 'User not found');
// Now TypeScript knows user is defined
console.log(user.name);
```

### assert

Assert condition is true.

```typescript
const age = getUserAge();
assert(age >= 0, 'Age cannot be negative');
assert(age <= 150, 'Age is unrealistic');
```

### assertNonEmptyString

Assert string is not empty.

```typescript
assertNonEmptyString(email, 'Email');
assertNonEmptyString(password, 'Password');
```

### assertValidNumber

Assert number is valid (not NaN, not Infinity).

```typescript
assertValidNumber(age, 'Age');
assertValidNumber(price, 'Price');
```

### assertInRange

Assert number is within range.

```typescript
assertInRange(age, 0, 150, 'Age');
assertInRange(percentage, 0, 100, 'Percentage');
```

### assertNonEmptyArray

Assert array is not empty.

```typescript
assertNonEmptyArray(users, 'Users');
assertNonEmptyArray(items, 'Items');
```

### assertOneOf

Assert value is one of allowed values.

```typescript
assertOneOf(role, ['ADMIN', 'PETUGAS'], 'Role');
assertOneOf(status, ['active', 'inactive'], 'Status');
```

### assertHasProperties

Assert object has required properties.

```typescript
assertHasProperties(user, ['id', 'name', 'email'], 'User');
assertHasProperties(config, ['apiUrl', 'timeout'], 'Config');
```

### assertValidDate

Assert date is valid.

```typescript
assertValidDate(birthDate, 'Birth date');
assertValidDate(expiryDate, 'Expiry date');
```

### unreachable

Mark unreachable code (useful for exhaustive switch).

```typescript
function handleStatus(status: 'active' | 'inactive') {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    default:
      unreachable(status, 'Unknown status');
  }
}
```

## Implementation Examples

### Repository Layer

```typescript
class LansiaRepository {
  async create(lansia: LansiaDB): Promise<number> {
    // FAIL FAST: Validate input
    assertDefined(lansia, 'Lansia data is required');
    assertHasProperties(
      lansia,
      ['kode', 'nik', 'nama'],
      'Lansia'
    );
    assertNonEmptyString(lansia.kode, 'Kode');
    
    try {
      return await db.lansia.add(lansia);
    } catch (error) {
      console.error('❌ Failed to create lansia:', error);
      throw new Error(`Failed to create lansia: ${error.message}`);
    }
  }
}
```

### Service Layer

```typescript
async function login(email: string, password: string): Promise<User> {
  // FAIL FAST: Validate input
  assertNonEmptyString(email, 'Email');
  assertNonEmptyString(password, 'Password');
  
  const response = await authAPI.login(email, password);
  
  // FAIL FAST: Validate response
  assertDefined(response.data, 'Login response data');
  assertHasProperties(response.data, ['token', 'user'], 'Login response');
  
  return response.data.user;
}
```

### Utility Functions

```typescript
export function hitungBMI(berat: number, tinggi: number): number {
  // FAIL FAST: Validate input
  assertValidNumber(berat, 'Berat badan');
  assertValidNumber(tinggi, 'Tinggi badan');
  assertInRange(berat, 20, 300, 'Berat badan');
  assertInRange(tinggi, 50, 250, 'Tinggi badan');
  
  const tinggiMeter = tinggi / 100;
  return berat / (tinggiMeter * tinggiMeter);
}
```

## Benefits

### 1. Early Bug Detection

Bugs are caught immediately at the source, not after they propagate through the system.

```typescript
// Without fail fast: Bug propagates
const bmi = hitungBMI(NaN, 170); // Returns NaN
const kategori = klasifikasiBMI(bmi); // Returns wrong category
// Bug discovered much later

// With fail fast: Bug caught immediately
const bmi = hitungBMI(NaN, 170); // ❌ Throws: "Berat badan is NaN"
// Bug discovered immediately
```

### 2. Better Error Messages

Clear, specific error messages make debugging easier.

```typescript
// Without fail fast
// Error: Cannot read property 'name' of undefined

// With fail fast
// ❌ Assertion failed: User is required
// ❌ Stack trace: ...
```

### 3. Type Safety

Assertions help TypeScript understand your code better.

```typescript
function processUser(user: User | null) {
  assertDefined(user, 'User is required');
  // TypeScript now knows user is not null
  console.log(user.name); // No type error
}
```

### 4. Self-Documenting Code

Assertions serve as inline documentation.

```typescript
function updateAge(age: number) {
  assertInRange(age, 0, 150, 'Age');
  // Clearly documents that age must be 0-150
}
```

## Best Practices

### 1. Validate at Boundaries

Always validate input at system boundaries (API, database, user input).

```typescript
// API boundary
async function createLansia(data: CreateLansiaData) {
  assertDefined(data, 'Lansia data is required');
  assertNonEmptyString(data.nik, 'NIK');
  // ...
}

// Database boundary
async function save(entity: Entity) {
  assertDefined(entity, 'Entity is required');
  assertValidNumber(entity.id, 'Entity ID');
  // ...
}
```

### 2. Use Specific Assertions

Use the most specific assertion available.

```typescript
// ❌ Generic
assert(typeof age === 'number', 'Age must be number');

// ✅ Specific
assertValidNumber(age, 'Age');
assertInRange(age, 0, 150, 'Age');
```

### 3. Provide Context

Always provide meaningful error messages.

```typescript
// ❌ Bad
assertDefined(user, 'Value is null');

// ✅ Good
assertDefined(user, 'User not found for ID: ' + userId);
```

### 4. Log Before Throwing

Log error details before throwing for debugging.

```typescript
try {
  await db.save(entity);
} catch (error) {
  console.error('❌ Failed to save entity:', {
    entity,
    error,
  });
  throw new Error(`Failed to save entity: ${error.message}`);
}
```

## Files with Fail Fast Implementation

### Repositories
- ✅ `lib/db/repositories/lansiaRepository.ts`
- ✅ `lib/db/repositories/pemeriksaanRepository.ts`
- ✅ `lib/db/repositories/syncQueueRepository.ts`

### Contexts
- ✅ `lib/contexts/AuthContext.tsx`

### Utils
- ✅ `lib/utils/bmi.ts`
- ✅ `lib/utils/tekananDarah.ts`
- ✅ `lib/utils/gulaDarah.ts`
- ✅ `lib/utils/kolesterol.ts`
- ✅ `lib/utils/asamUrat.ts`
- ✅ `lib/utils/failFast.ts` (utility functions)

### Hooks
- ✅ `lib/hooks/useAuth.ts`
- ✅ `lib/hooks/useDashboardStats.ts`

## Testing Fail Fast

### Unit Tests

```typescript
describe('hitungBMI', () => {
  it('should throw on invalid berat', () => {
    expect(() => hitungBMI(NaN, 170)).toThrow('Berat badan is NaN');
  });
  
  it('should throw on out of range berat', () => {
    expect(() => hitungBMI(500, 170)).toThrow('Berat badan must be between 20 and 300');
  });
  
  it('should calculate BMI correctly', () => {
    expect(hitungBMI(70, 170)).toBe(24.22);
  });
});
```

### Integration Tests

```typescript
describe('LansiaRepository', () => {
  it('should throw on invalid lansia data', async () => {
    await expect(
      lansiaRepository.create(null as any)
    ).rejects.toThrow('Lansia data is required');
  });
  
  it('should throw on missing required fields', async () => {
    await expect(
      lansiaRepository.create({ kode: 'test' } as any)
    ).rejects.toThrow('Lansia is missing required properties');
  });
});
```

## Migration Guide

### Before (Without Fail Fast)

```typescript
async function updateUser(id: number, data: Partial<User>) {
  const user = await db.users.get(id);
  if (!user) return null;
  
  await db.users.update(id, data);
  return user;
}
```

### After (With Fail Fast)

```typescript
async function updateUser(id: number, data: Partial<User>) {
  // FAIL FAST: Validate input
  assertValidNumber(id, 'User ID');
  assertDefined(data, 'Update data is required');
  
  const user = await db.users.get(id);
  
  // FAIL FAST: Validate user exists
  assertDefined(user, `User not found for ID: ${id}`);
  
  try {
    await db.users.update(id, data);
    return user;
  } catch (error) {
    console.error('❌ Failed to update user:', { id, error });
    throw new Error(`Failed to update user: ${error.message}`);
  }
}
```

## Conclusion

Fail Fast principle membantu:
- ✅ Detect bugs earlier
- ✅ Provide better error messages
- ✅ Make code more maintainable
- ✅ Improve type safety
- ✅ Self-document code

Selalu validate input, throw errors immediately, dan make bugs obvious and loud!
