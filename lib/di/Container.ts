/**
 * Dependency Injection Container
 *
 * Implements Inversion of Control (IoC) pattern.
 * Instead of code creating its own dependencies, they are injected by the container.
 *
 * Benefits:
 * - Loose coupling between components
 * - Easy to test (inject mocks)
 * - Easy to swap implementations
 * - Centralized dependency management
 * - Single Responsibility (container manages lifecycle)
 */

type Factory<T> = () => T;
type Singleton<T> = { instance: T };

/**
 * Simple Dependency Injection Container
 * 
 * Supports two registration modes:
 * - Transient: New instance created each time
 * - Singleton: Same instance returned each time
 */
export class DIContainer {
  private factories = new Map<string, Factory<unknown>>();
  private singletons = new Map<string, Singleton<unknown>>();

  /**
   * Register a transient dependency
   * New instance created on each resolve
   * 
   * @param key - Unique identifier for the dependency
   * @param factory - Function that creates the dependency
   */
  registerTransient<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }

  /**
   * Register a singleton dependency
   * Same instance returned on each resolve
   * 
   * @param key - Unique identifier for the dependency
   * @param factory - Function that creates the dependency
   */
  registerSingleton<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory as Factory<unknown>);
    // Mark as singleton but don't create yet (lazy initialization)
    this.singletons.set(key, { instance: null as unknown });
  }

  /**
   * Resolve a dependency from the container
   * 
   * @param key - Unique identifier for the dependency
   * @returns The resolved dependency instance
   * @throws Error if dependency not registered
   */
  resolve<T>(key: string): T {
    const factory = this.factories.get(key);
    
    if (!factory) {
      throw new Error(`Dependency '${key}' not registered in container`);
    }

    // Check if it's a singleton
    const singleton = this.singletons.get(key);
    if (singleton) {
      // Lazy initialization: create on first resolve
      if (!singleton.instance) {
        singleton.instance = factory();
      }
      return singleton.instance as T;
    }

    // Transient: create new instance
    return factory() as T;
  }

  /**
   * Check if a dependency is registered
   */
  has(key: string): boolean {
    return this.factories.has(key);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.factories.clear();
    this.singletons.clear();
  }

  /**
   * Get all registered keys (useful for debugging)
   */
  getRegisteredKeys(): string[] {
    return Array.from(this.factories.keys());
  }
}

/**
 * Dependency Keys
 * Centralized constants for dependency identifiers
 * Prevents typos and provides type safety
 */
export const DependencyKeys = {
  // Repositories
  LANSIA_REPOSITORY: 'ILansiaRepository',
  PEMERIKSAAN_REPOSITORY: 'IPemeriksaanRepository',
  SYNC_QUEUE_REPOSITORY: 'SyncQueueRepository',

  // Domain Services
  HEALTH_METRICS_SERVICE: 'HealthMetricsDomainService',

  // Use Cases
  REGISTER_LANSIA_USE_CASE: 'RegisterLansiaUseCase',
  RECORD_PEMERIKSAAN_USE_CASE: 'RecordPemeriksaanUseCase',

  // Utilities
  PATIENT_CODE_GENERATOR: 'PatientCodeGenerator',
  HEALTH_METRICS_CALCULATOR: 'IHealthMetricsCalculator',
} as const;

/**
 * Global container instance
 * Singleton pattern for the container itself
 */
let globalContainer: DIContainer | null = null;

/**
 * Get the global DI container
 * Creates it if it doesn't exist
 */
export function getContainer(): DIContainer {
  if (!globalContainer) {
    globalContainer = new DIContainer();
  }
  return globalContainer;
}

/**
 * Reset the global container (useful for testing)
 */
export function resetContainer(): void {
  globalContainer = null;
}
