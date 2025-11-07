## Inversion of Control (IoC) Architecture

This document explains how Inversion of Control is implemented in this codebase.

## Overview

**Inversion of Control (IoC)** is a design principle where the control of object creation and dependency management is inverted from the application code to a framework or container.

### Traditional Control Flow (Without IoC)

```typescript
// ❌ Application code controls dependencies
class MyComponent {
  constructor() {
    this.repository = new IndexedDBLansiaRepository(); // Direct instantiation
    this.service = new HealthMetricsService();
    this.useCase = new RegisterLansiaUseCase(this.repository, generateCode);
  }
}
```

**Problems:**
- Tight coupling to concrete implementations
- Hard to test (can't inject mocks)
- Hard to swap implementations
- Violates Dependency Inversion Principle

### Inverted Control Flow (With IoC)

```typescript
// ✅ Container controls dependencies
class MyComponent {
  constructor(private container: DIContainer) {
    // Dependencies are injected, not created
    this.useCase = container.resolve(DependencyKeys.REGISTER_LANSIA_USE_CASE);
  }
}
```

**Benefits:**
- Loose coupling (depends on abstractions)
- Easy to test (inject mock container)
- Easy to swap implementations
- Follows SOLID principles

## Architecture Components

### 1. DI Container (`lib/di/Container.ts`)

The container manages the lifecycle and creation of dependencies.

```typescript
import { DIContainer, DependencyKeys } from '@/lib/di';

const container = new DIContainer();

// Register dependencies
container.registerSingleton('MyService', () => new MyService());

// Resolve dependencies
const service = container.resolve<MyService>('MyService');
```

**Features:**
- **Transient**: New instance created each time
- **Singleton**: Same instance returned each time
- **Lazy initialization**: Created on first use
- **Type-safe**: TypeScript generics

### 2. Dependency Registration (`lib/di/registerDependencies.ts`)

Central place where all dependencies are registered.

```typescript
export function registerDependencies(container: DIContainer): void {
  // Repositories (Singleton)
  container.registerSingleton(
    DependencyKeys.LANSIA_REPOSITORY,
    () => new IndexedDBLansiaRepository()
  );

  // Use Cases (Transient)
  container.registerTransient(
    DependencyKeys.REGISTER_LANSIA_USE_CASE,
    () => {
      const repo = container.resolve(DependencyKeys.LANSIA_REPOSITORY);
      const codeGen = container.resolve(DependencyKeys.PATIENT_CODE_GENERATOR);
      return new RegisterLansiaUseCase(repo, codeGen);
    }
  );
}
```

**Lifecycle Management:**
- **Singleton**: Repositories, Services (stateless, reusable)
- **Transient**: Use Cases (per-operation, stateful)

### 3. React Integration (`lib/di/DIProvider.tsx`)

Provides the container to React components via Context API.

```typescript
import { DIProvider, useDependency, DependencyKeys } from '@/lib/di';

// Wrap your app
function App() {
  return (
    <DIProvider>
      <YourApp />
    </DIProvider>
  );
}

// Use in components
function MyComponent() {
  const useCase = useDependency<RegisterLansiaUseCase>(
    DependencyKeys.REGISTER_LANSIA_USE_CASE
  );
  
  // Use the injected dependency
  const result = await useCase.execute(data);
}
```

### 4. Dependency Keys (`lib/di/Container.ts`)

Centralized constants for dependency identifiers.

```typescript
export const DependencyKeys = {
  LANSIA_REPOSITORY: 'ILansiaRepository',
  REGISTER_LANSIA_USE_CASE: 'RegisterLansiaUseCase',
  // ... other keys
} as const;
```

**Benefits:**
- Type-safe keys
- Prevents typos
- Autocomplete support
- Easy refactoring

## Usage Patterns

### Pattern 1: Hook with IoC

```typescript
// lib/hooks/useRegisterLansiaWithIoC.ts
export function useRegisterLansiaWithIoC() {
  // ✅ Dependency injected via container
  const useCase = useDependency<RegisterLansiaUseCase>(
    DependencyKeys.REGISTER_LANSIA_USE_CASE
  );

  const register = async (data: CreateLansiaDTO) => {
    return await useCase.execute(data);
  };

  return { register };
}
```

### Pattern 2: Component with IoC

```typescript
function RegisterForm() {
  const { register } = useRegisterLansiaWithIoC();

  const handleSubmit = async (formData) => {
    const result = await register(formData);
    // Handle result
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 3: Direct Container Access

```typescript
function MyComponent() {
  const container = useDIContainer();
  
  const repository = container.resolve(DependencyKeys.LANSIA_REPOSITORY);
  const service = container.resolve(DependencyKeys.HEALTH_METRICS_SERVICE);
  
  // Use dependencies
}
```

## Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                     DI Container                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Repositories (Singleton)                       │    │
│  │  - IndexedDBLansiaRepository                    │    │
│  │  - SyncQueueRepository                          │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  Domain Services (Singleton)                    │    │
│  │  - HealthMetricsDomainService                   │    │
│  │  - HealthMetricsAdapter                         │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  Use Cases (Transient)                          │    │
│  │  - RegisterLansiaUseCase                        │    │
│  │  - RecordPemeriksaanUseCase                     │    │
│  └────────────────────────────────────────────────┘    │
│                         ↓                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  React Hooks                                    │    │
│  │  - useRegisterLansiaWithIoC                     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Testing with IoC

### Unit Testing

```typescript
describe('useRegisterLansiaWithIoC', () => {
  it('should register lansia successfully', async () => {
    // Create mock use case
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue({
        success: true,
        lansia: mockLansia,
      }),
    };

    // Create test container with mock
    const testContainer = new DIContainer();
    testContainer.registerTransient(
      DependencyKeys.REGISTER_LANSIA_USE_CASE,
      () => mockUseCase
    );

    // Render hook with test container
    const { result } = renderHook(() => useRegisterLansiaWithIoC(), {
      wrapper: ({ children }) => (
        <DIProvider container={testContainer}>{children}</DIProvider>
      ),
    });

    // Test with mock
    await act(async () => {
      const response = await result.current.register(testData);
      expect(response.success).toBe(true);
    });

    expect(mockUseCase.execute).toHaveBeenCalledWith(testData);
  });
});
```

### Integration Testing

```typescript
describe('RegisterLansiaUseCase Integration', () => {
  it('should work with real dependencies', async () => {
    // Use real container with real dependencies
    const container = initializeContainer();
    const useCase = container.resolve<RegisterLansiaUseCase>(
      DependencyKeys.REGISTER_LANSIA_USE_CASE
    );

    const result = await useCase.execute(testData);
    expect(result.success).toBe(true);
  });
});
```

## Benefits of IoC

### 1. Loose Coupling

```typescript
// ❌ Without IoC: Tight coupling
class MyHook {
  private repository = new IndexedDBLansiaRepository(); // Coupled to IndexedDB
}

// ✅ With IoC: Loose coupling
class MyHook {
  constructor(private repository: ILansiaRepository) {} // Coupled to interface
}
```

### 2. Easy Testing

```typescript
// ❌ Without IoC: Hard to test
test('myFunction', () => {
  // Can't inject mock, uses real IndexedDB
  const result = myFunction();
});

// ✅ With IoC: Easy to test
test('myFunction', () => {
  const mockRepo = createMockRepository();
  container.registerTransient('ILansiaRepository', () => mockRepo);
  const result = myFunction(); // Uses mock
});
```

### 3. Easy to Swap Implementations

```typescript
// Development: Use IndexedDB
container.registerSingleton(
  DependencyKeys.LANSIA_REPOSITORY,
  () => new IndexedDBLansiaRepository()
);

// Testing: Use in-memory
container.registerSingleton(
  DependencyKeys.LANSIA_REPOSITORY,
  () => new InMemoryLansiaRepository()
);

// Production: Use API
container.registerSingleton(
  DependencyKeys.LANSIA_REPOSITORY,
  () => new APILansiaRepository()
);

// Application code doesn't change!
```

### 4. Single Responsibility

```typescript
// ❌ Without IoC: Multiple responsibilities
class MyComponent {
  constructor() {
    // Responsible for creating dependencies
    this.repo = new Repository();
    this.service = new Service();
    // AND using them
    this.doWork();
  }
}

// ✅ With IoC: Single responsibility
class MyComponent {
  constructor(private repo: IRepository, private service: IService) {
    // Only responsible for using dependencies
    this.doWork();
  }
}
```

## Migration Guide

### Step 1: Wrap App with DIProvider

```typescript
// app/layout.tsx
import { DIProvider } from '@/lib/di';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DIProvider>
          {children}
        </DIProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Hooks to Use IoC

```typescript
// Before
export function useMyFeature() {
  const repository = new IndexedDBRepository();
  const useCase = new MyUseCase(repository);
  // ...
}

// After
export function useMyFeature() {
  const useCase = useDependency<MyUseCase>(DependencyKeys.MY_USE_CASE);
  // ...
}
```

### Step 3: Register New Dependencies

```typescript
// lib/di/registerDependencies.ts
export function registerDependencies(container: DIContainer): void {
  // Add your new dependency
  container.registerSingleton(
    DependencyKeys.MY_NEW_SERVICE,
    () => new MyNewService()
  );
}
```

## Best Practices

### 1. Register at Startup

```typescript
// Register all dependencies once at app startup
const container = initializeContainer();
```

### 2. Use Dependency Keys

```typescript
// ✅ Use constants
const useCase = container.resolve(DependencyKeys.REGISTER_LANSIA_USE_CASE);

// ❌ Don't use strings directly
const useCase = container.resolve('RegisterLansiaUseCase');
```

### 3. Choose Correct Lifecycle

```typescript
// Singleton: Stateless, reusable
container.registerSingleton('Repository', () => new Repository());

// Transient: Stateful, per-operation
container.registerTransient('UseCase', () => new UseCase());
```

### 4. Depend on Abstractions

```typescript
// ✅ Depend on interface
constructor(private repo: ILansiaRepository) {}

// ❌ Depend on concrete class
constructor(private repo: IndexedDBLansiaRepository) {}
```

### 5. Keep Container Configuration Centralized

```typescript
// ✅ All registrations in one place
// lib/di/registerDependencies.ts

// ❌ Scattered registrations
// Multiple files registering dependencies
```

## Conclusion

Inversion of Control provides:
- **Flexibility**: Easy to swap implementations
- **Testability**: Easy to inject mocks
- **Maintainability**: Centralized dependency management
- **SOLID Principles**: Follows Dependency Inversion Principle

By delegating dependency management to the DI container, we achieve loose coupling, better testability, and more maintainable code.
