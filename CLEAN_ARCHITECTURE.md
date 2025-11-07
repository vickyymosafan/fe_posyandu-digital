# Clean Architecture Implementation

This document explains the Clean Architecture implementation in this codebase.

## Overview

Clean Architecture separates concerns into layers with clear dependency rules:
- **Dependencies flow inward** - outer layers depend on inner layers, never the reverse
- **Business logic is independent** - core logic doesn't depend on frameworks, UI, or databases
- **Testable** - business logic can be tested without external dependencies

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frameworks & Drivers                  │
│              (React, IndexedDB, Fetch API)              │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Interface Adapters                    │    │
│  │     (Repositories, Controllers, Presenters)     │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │          Use Cases                        │  │    │
│  │  │   (Application Business Rules)            │  │    │
│  │  │                                            │  │    │
│  │  │  ┌────────────────────────────────────┐  │  │    │
│  │  │  │         Domain                      │  │  │    │
│  │  │  │  (Entities, Business Rules)         │  │  │    │
│  │  │  └────────────────────────────────────┘  │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
lib/
├── domain/                      # Domain Layer (innermost)
│   ├── entities/               # Business entities
│   │   ├── Lansia.ts          # Lansia entity + validation
│   │   └── Pemeriksaan.ts     # Pemeriksaan entity + validation
│   ├── repositories/           # Repository interfaces (ports)
│   │   ├── ILansiaRepository.ts
│   │   └── IPemeriksaanRepository.ts
│   └── services/               # Domain services
│       └── HealthMetricsService.ts
│
├── use-cases/                  # Use Cases Layer
│   ├── RegisterLansiaUseCase.ts
│   └── RecordPemeriksaanUseCase.ts
│
├── infrastructure/             # Infrastructure Layer (outermost)
│   ├── repositories/          # Repository implementations
│   │   └── IndexedDBLansiaRepository.ts
│   └── adapters/              # Adapters for external services
│       └── HealthMetricsAdapter.ts
│
└── hooks/                      # React Hooks (Framework Layer)
    └── useRegisterLansia.example.ts
```

## Layer Responsibilities

### 1. Domain Layer (`lib/domain/`)

**Purpose**: Contains pure business logic and rules

**Characteristics**:
- No dependencies on external frameworks
- Pure TypeScript/JavaScript
- Highly testable
- Stable (rarely changes)

**Components**:

#### Entities (`domain/entities/`)
- Core business objects
- Contain business validation rules
- Immutable data structures

Example:
```typescript
// domain/entities/Lansia.ts
export interface LansiaDomainEntity {
  readonly id: number;
  readonly kode: string;
  readonly nik: string;
  // ... other fields
}

export class LansiaValidation {
  static isValidNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik);
  }
}
```

#### Repository Interfaces (`domain/repositories/`)
- Define contracts for data access
- Domain defines what it needs
- Infrastructure provides implementation

Example:
```typescript
// domain/repositories/ILansiaRepository.ts
export interface ILansiaRepository {
  findByKode(kode: string): Promise<LansiaDomainEntity | null>;
  save(lansia: Omit<LansiaDomainEntity, 'id'>): Promise<LansiaDomainEntity>;
  // ... other methods
}
```

#### Domain Services (`domain/services/`)
- Business logic that doesn't fit in a single entity
- Stateless operations
- Pure functions

Example:
```typescript
// domain/services/HealthMetricsService.ts
export class HealthMetricsDomainService {
  calculateBMI(weight: number, height: number) {
    // Pure calculation logic
  }
}
```

### 2. Use Cases Layer (`lib/use-cases/`)

**Purpose**: Application-specific business rules

**Characteristics**:
- Orchestrates flow of data
- Depends only on domain layer
- Independent of UI and database
- One use case per user action

**Example**:
```typescript
// use-cases/RegisterLansiaUseCase.ts
export class RegisterLansiaUseCase {
  constructor(
    private repository: ILansiaRepository,
    private generateCode: () => Promise<string>
  ) {}

  async execute(data: CreateLansiaDTO) {
    // 1. Validate input
    // 2. Check uniqueness
    // 3. Generate code
    // 4. Save to repository
    // 5. Return result
  }
}
```

### 3. Infrastructure Layer (`lib/infrastructure/`)

**Purpose**: Implements interfaces defined by domain

**Characteristics**:
- Adapts external services to domain interfaces
- Contains framework-specific code
- Can be swapped without changing domain

**Components**:

#### Repository Implementations (`infrastructure/repositories/`)
- Implement domain repository interfaces
- Handle database-specific logic
- Translate between domain entities and database models

Example:
```typescript
// infrastructure/repositories/IndexedDBLansiaRepository.ts
export class IndexedDBLansiaRepository implements ILansiaRepository {
  async findByKode(kode: string): Promise<LansiaDomainEntity | null> {
    const dbResult = await dexieRepo.getByKode(kode);
    return dbResult ? this.toDomainEntity(dbResult) : null;
  }
}
```

#### Adapters (`infrastructure/adapters/`)
- Adapt external services to domain interfaces
- Wrap third-party libraries

### 4. Framework Layer (`lib/hooks/`, `components/`)

**Purpose**: UI and framework-specific code

**Characteristics**:
- Thin wrappers around use cases
- Manage React state and effects
- Handle UI concerns only

**Example**:
```typescript
// hooks/useRegisterLansia.ts
export function useRegisterLansia() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useCallback(async (data) => {
    setIsSubmitting(true);
    const useCase = new RegisterLansiaUseCase(repository, generateCode);
    const result = await useCase.execute(data);
    setIsSubmitting(false);
    return result;
  }, []);

  return { register, isSubmitting };
}
```

## Dependency Rule

**The Dependency Rule**: Source code dependencies must point inward only.

```
Framework → Infrastructure → Use Cases → Domain
   ↓              ↓              ↓          ↓
 React      IndexedDB/API    Orchestration  Pure Logic
```

- **Domain** depends on nothing
- **Use Cases** depend only on Domain
- **Infrastructure** depends on Domain (implements interfaces)
- **Framework** depends on Use Cases and Infrastructure

## Benefits

### 1. Testability
```typescript
// Test use case without database or UI
test('RegisterLansiaUseCase validates NIK', async () => {
  const mockRepo = new MockLansiaRepository();
  const useCase = new RegisterLansiaUseCase(mockRepo, mockCodeGenerator);
  
  const result = await useCase.execute({ nik: 'invalid' });
  
  expect(result.success).toBe(false);
  expect(result.validationErrors.nik).toBeDefined();
});
```

### 2. Flexibility
- Swap IndexedDB for API without changing business logic
- Change UI framework without touching use cases
- Replace validation library without affecting domain

### 3. Maintainability
- Clear separation of concerns
- Easy to locate and modify code
- Changes in one layer don't affect others

### 4. Independence
- Business logic doesn't depend on frameworks
- Can test business rules without UI or database
- Domain logic is portable across projects

## Migration Strategy

### Existing Code → Clean Architecture

1. **Identify Business Logic**
   - Extract validation from hooks
   - Move calculations to domain services
   - Separate data access from business rules

2. **Create Domain Layer**
   - Define entities
   - Create repository interfaces
   - Extract domain services

3. **Create Use Cases**
   - One use case per user action
   - Orchestrate domain logic
   - Return structured results

4. **Implement Adapters**
   - Wrap existing repositories
   - Implement domain interfaces
   - Keep existing code working

5. **Refactor Hooks**
   - Make hooks thin wrappers
   - Delegate to use cases
   - Handle only React concerns

## Example: Complete Flow

### 1. User Action (UI)
```typescript
// Component
function RegisterForm() {
  const { register } = useRegisterLansia();
  
  const handleSubmit = async (formData) => {
    const result = await register(formData);
    // Handle result
  };
}
```

### 2. Hook (Framework Layer)
```typescript
// Hook manages React state
export function useRegisterLansia() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const register = async (data) => {
    setIsSubmitting(true);
    const useCase = new RegisterLansiaUseCase(repository, generateCode);
    const result = await useCase.execute(data);
    setIsSubmitting(false);
    return result;
  };
}
```

### 3. Use Case (Application Layer)
```typescript
// Use case orchestrates business logic
export class RegisterLansiaUseCase {
  async execute(data: CreateLansiaDTO) {
    // Validate using domain rules
    const errors = this.validateInput(data);
    if (errors) return { success: false, errors };
    
    // Check uniqueness via repository interface
    const exists = await this.repository.existsByNIK(data.nik);
    if (exists) return { success: false, error: 'NIK exists' };
    
    // Generate code and save
    const kode = await this.generateCode();
    const lansia = await this.repository.save({ ...data, kode });
    
    return { success: true, lansia };
  }
}
```

### 4. Repository (Infrastructure Layer)
```typescript
// Repository implements domain interface
export class IndexedDBLansiaRepository implements ILansiaRepository {
  async save(lansia) {
    const dbModel = this.toDBModel(lansia);
    const id = await dexieRepo.create(dbModel);
    return this.toDomainEntity(await dexieRepo.getById(id));
  }
}
```

### 5. Domain (Core Layer)
```typescript
// Domain defines validation rules
export class LansiaValidation {
  static isValidNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik);
  }
}
```

## Best Practices

1. **Keep Domain Pure**
   - No framework imports in domain layer
   - No database-specific code
   - Pure business logic only

2. **Use Dependency Injection**
   - Pass dependencies to use cases
   - Don't create dependencies inside use cases
   - Makes testing easier

3. **Define Interfaces in Domain**
   - Domain defines what it needs
   - Infrastructure provides implementation
   - Enables Dependency Inversion

4. **One Use Case Per Action**
   - RegisterLansia, RecordPemeriksaan, etc.
   - Clear, focused responsibility
   - Easy to test and maintain

5. **Keep Hooks Thin**
   - Manage React state only
   - Delegate logic to use cases
   - Handle UI concerns

## Testing Strategy

### Domain Layer
```typescript
// Pure unit tests, no mocks needed
test('LansiaValidation.isValidNIK', () => {
  expect(LansiaValidation.isValidNIK('1234567890123456')).toBe(true);
  expect(LansiaValidation.isValidNIK('invalid')).toBe(false);
});
```

### Use Cases
```typescript
// Test with mock repositories
test('RegisterLansiaUseCase', async () => {
  const mockRepo = {
    existsByNIK: jest.fn().mockResolvedValue(false),
    save: jest.fn().mockResolvedValue(mockLansia),
  };
  
  const useCase = new RegisterLansiaUseCase(mockRepo, mockCodeGen);
  const result = await useCase.execute(validData);
  
  expect(result.success).toBe(true);
});
```

### Infrastructure
```typescript
// Integration tests with real database
test('IndexedDBLansiaRepository', async () => {
  const repo = new IndexedDBLansiaRepository();
  const lansia = await repo.save(testData);
  
  expect(lansia.id).toBeDefined();
  expect(lansia.kode).toBe(testData.kode);
});
```

## Conclusion

Clean Architecture provides:
- **Separation of Concerns**: Each layer has clear responsibility
- **Testability**: Business logic is easily testable
- **Flexibility**: Easy to swap implementations
- **Maintainability**: Changes are localized
- **Independence**: Core logic doesn't depend on frameworks

The initial setup requires more files and structure, but pays off with:
- Easier testing
- Better maintainability
- More flexible codebase
- Clearer code organization
