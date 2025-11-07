# Single Source of Truth (SSOT) Architecture

This document explains how the Single Source of Truth principle is implemented in this codebase.

## Overview

**Single Source of Truth (SSOT)** means that every piece of data, logic, or configuration exists in exactly one authoritative location. All other references derive from or point to that single source.

## Benefits

1. **Consistency**: Changes in one place automatically propagate everywhere
2. **Maintainability**: No need to update multiple locations
3. **Reliability**: Eliminates synchronization issues
4. **Clarity**: Clear ownership of data and logic

## SSOT Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                   Single Sources of Truth                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Domain Entities (lib/domain/entities/)              │
│     └─ Canonical business object definitions            │
│                                                          │
│  2. Validation Rules (lib/domain/validation/)           │
│     └─ All validation logic and error messages          │
│                                                          │
│  3. Constants (lib/constants/config.ts)                 │
│     └─ All configuration values and limits              │
│                                                          │
│  4. Domain Services (lib/domain/services/)              │
│     └─ Pure business logic and calculations             │
│                                                          │
│  5. Repository Interfaces (lib/domain/repositories/)    │
│     └─ Data access contracts                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## SSOT Implementation

### 1. Type Definitions

**SSOT Location**: `lib/domain/entities/`

Domain entities are the canonical type definitions. All other types derive from them.

```typescript
// ✅ SSOT: Domain Entity
// lib/domain/entities/Lansia.ts
export interface LansiaDomainEntity {
  readonly id: number;
  readonly kode: string;
  readonly nik: string;
  // ... other fields
}

// ✅ Derived: UI Type (via mapper)
// types/index.ts
export interface Lansia {
  // Same structure, but derived from domain
}

// ✅ Derived: DB Type (via mapper)
// lib/db/schema.ts
export interface LansiaDB extends Lansia {
  syncedAt?: Date; // Additional DB-specific field
}
```

**Type Mappers** (`lib/domain/mappers/`) ensure consistent transformations:

```typescript
// lib/domain/mappers/LansiaMapper.ts
export class LansiaMapper {
  static toUIType(domain: LansiaDomainEntity): Lansia { }
  static fromUIType(ui: Lansia): LansiaDomainEntity { }
  static toDBModel(domain: LansiaDomainEntity): LansiaDB { }
  static fromDBModel(db: LansiaDB): LansiaDomainEntity { }
}
```

### 2. Validation Rules

**SSOT Location**: `lib/domain/validation/ValidationRules.ts`

All validation rules, patterns, and error messages are defined once.

```typescript
// ✅ SSOT: Validation Rules
export const ValidationRules = {
  NIK: {
    LENGTH: 16,
    PATTERN: /^\d{16}$/,
    ERROR_MESSAGES: {
      INVALID_LENGTH: 'NIK harus 16 digit',
      INVALID_FORMAT: 'NIK harus berisi angka saja',
    },
  },
  // ... other rules
} as const;
```

**Usage in Domain Validation**:

```typescript
// lib/domain/entities/Lansia.ts
import { ValidationRules, matchesPattern } from '../validation/ValidationRules';

export class LansiaValidation {
  static isValidNIK(nik: string): boolean {
    return matchesPattern(nik, ValidationRules.NIK.PATTERN);
  }
}
```

**Usage in Zod Schemas**:

```typescript
// lib/utils/validators.ts
import { ValidationRules } from '@/lib/domain/validation/ValidationRules';

export const nikSchema = z
  .string()
  .length(ValidationRules.NIK.LENGTH, ValidationRules.NIK.ERROR_MESSAGES.INVALID_LENGTH)
  .regex(ValidationRules.NIK.PATTERN, ValidationRules.NIK.ERROR_MESSAGES.INVALID_FORMAT);
```

### 3. Constants and Configuration

**SSOT Location**: `lib/constants/config.ts`

All magic numbers, timeouts, limits, and configuration values.

```typescript
// ✅ SSOT: Constants
export const HEALTH_LIMITS = {
  HEIGHT: { MIN: 50, MAX: 250, UNIT: 'cm' },
  WEIGHT: { MIN: 20, MAX: 300, UNIT: 'kg' },
  // ... other limits
} as const;

export const API_REQUEST_TIMEOUT_MS = 30_000;
export const NOTIFICATION_DURATION_MS = 5_000;
```

**Usage Everywhere**:

```typescript
// ✅ Import from SSOT
import { HEALTH_LIMITS, API_REQUEST_TIMEOUT_MS } from '@/lib/constants';

// Use the constant
if (height < HEALTH_LIMITS.HEIGHT.MIN) {
  // ...
}
```

### 4. Business Logic

**SSOT Location**: `lib/domain/services/`

Pure business logic and calculations.

```typescript
// ✅ SSOT: Health Metrics Domain Service
export class HealthMetricsDomainService {
  calculateBMI(weight: number, height: number) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return {
      value: Math.round(bmi * 10) / 10,
      category: this.categorizeBMI(bmi),
    };
  }
}
```

**Other Services Delegate**:

```typescript
// ✅ Delegates to domain service
// lib/services/healthMetricsService.ts
import { HealthMetricsDomainService } from '@/lib/domain/services/HealthMetricsService';

const domainService = new HealthMetricsDomainService();

export function calculateBMI(weight: number, height: number) {
  return domainService.calculateBMI(weight, height);
}
```

### 5. Data Access Contracts

**SSOT Location**: `lib/domain/repositories/` (interfaces)

Repository interfaces define the contract for data access.

```typescript
// ✅ SSOT: Repository Interface
export interface ILansiaRepository {
  findByKode(kode: string): Promise<LansiaDomainEntity | null>;
  save(lansia: Omit<LansiaDomainEntity, 'id'>): Promise<LansiaDomainEntity>;
  // ... other methods
}
```

**Implementations Adapt**:

```typescript
// ✅ Implementation adapts to interface
export class IndexedDBLansiaRepository implements ILansiaRepository {
  async findByKode(kode: string): Promise<LansiaDomainEntity | null> {
    const dbResult = await dexieRepo.getByKode(kode);
    return dbResult ? LansiaMapper.fromDBModel(dbResult) : null;
  }
}
```

## Data Flow with SSOT

### Example: Creating a Lansia

```
1. UI Form Data
   ↓
2. Convert to Domain DTO (via mapper)
   ↓
3. Validate using Domain Validation (SSOT rules)
   ↓
4. Use Case processes (domain logic)
   ↓
5. Save via Repository Interface (SSOT contract)
   ↓
6. Implementation converts to DB Model (via mapper)
   ↓
7. Store in Database
```

### Example: Calculating BMI

```
1. Get weight and height from form
   ↓
2. Call Domain Service (SSOT for calculation)
   ↓
3. Domain Service uses constants (SSOT for limits)
   ↓
4. Return result with category
   ↓
5. Display in UI
```

## SSOT Checklist

When adding new features, ensure:

- [ ] **Types**: Domain entity is the SSOT
- [ ] **Validation**: Rules defined in ValidationRules.ts
- [ ] **Constants**: No magic numbers, use config.ts
- [ ] **Logic**: Business logic in domain services
- [ ] **Data Access**: Use repository interfaces
- [ ] **Transformations**: Use mappers for type conversions

## Anti-Patterns to Avoid

### ❌ Duplicating Validation

```typescript
// ❌ BAD: Validation logic duplicated
// In validators.ts
export const nikSchema = z.string().length(16).regex(/^\d{16}$/);

// In domain entity
export class LansiaValidation {
  static isValidNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik) && nik.length === 16; // DUPLICATED!
  }
}
```

```typescript
// ✅ GOOD: Single source
// In ValidationRules.ts
export const ValidationRules = {
  NIK: { LENGTH: 16, PATTERN: /^\d{16}$/ }
};

// Both use the same source
export const nikSchema = z.string()
  .length(ValidationRules.NIK.LENGTH)
  .regex(ValidationRules.NIK.PATTERN);

export class LansiaValidation {
  static isValidNIK(nik: string): boolean {
    return matchesPattern(nik, ValidationRules.NIK.PATTERN);
  }
}
```

### ❌ Duplicating Constants

```typescript
// ❌ BAD: Magic numbers everywhere
const timeout = 30000; // In file A
const REQUEST_TIMEOUT = 30000; // In file B
const apiTimeout = 30 * 1000; // In file C
```

```typescript
// ✅ GOOD: Single source
// In config.ts
export const API_REQUEST_TIMEOUT_MS = 30_000;

// Import everywhere
import { API_REQUEST_TIMEOUT_MS } from '@/lib/constants';
```

### ❌ Duplicating Business Logic

```typescript
// ❌ BAD: BMI calculation in multiple places
// In serviceA.ts
const bmi = weight / ((height / 100) ** 2);

// In serviceB.ts
const bmi = weight / Math.pow(height / 100, 2);

// In utilC.ts
const bmi = (weight * 10000) / (height * height);
```

```typescript
// ✅ GOOD: Single source
// In HealthMetricsDomainService.ts
export class HealthMetricsDomainService {
  calculateBMI(weight: number, height: number) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }
}

// Everyone uses the service
const service = new HealthMetricsDomainService();
const bmi = service.calculateBMI(weight, height);
```

## Migration Guide

### Step 1: Identify Duplications

Look for:
- Same validation logic in multiple files
- Magic numbers repeated
- Similar type definitions
- Duplicated calculations

### Step 2: Create SSOT

1. Move to appropriate SSOT location
2. Make it the canonical source
3. Document it clearly

### Step 3: Update References

1. Find all usages
2. Replace with imports from SSOT
3. Remove duplicated code

### Step 4: Add Mappers

1. Create type mappers for transformations
2. Use mappers consistently
3. Never manually transform types

## Testing SSOT

### Unit Tests

```typescript
// Test the SSOT directly
describe('ValidationRules', () => {
  it('should validate NIK correctly', () => {
    expect(matchesPattern('1234567890123456', ValidationRules.NIK.PATTERN)).toBe(true);
    expect(matchesPattern('invalid', ValidationRules.NIK.PATTERN)).toBe(false);
  });
});
```

### Integration Tests

```typescript
// Test that all consumers use the same SSOT
describe('NIK Validation Consistency', () => {
  it('should use same rules in domain and Zod', () => {
    const validNIK = '1234567890123456';
    
    // Domain validation
    expect(LansiaValidation.isValidNIK(validNIK)).toBe(true);
    
    // Zod validation
    expect(nikSchema.safeParse(validNIK).success).toBe(true);
  });
});
```

## Conclusion

SSOT ensures:
- **One place** to define each piece of data/logic
- **One place** to update when changes are needed
- **Zero duplication** across the codebase
- **Complete consistency** throughout the application

By following SSOT principles, we create a maintainable, reliable, and consistent codebase where every piece of information has a clear, authoritative source.
