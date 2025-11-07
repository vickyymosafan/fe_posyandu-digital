/**
 * Dependency Registration
 *
 * Central place where all dependencies are registered with the DI container.
 * This is where Inversion of Control happens - the container manages dependencies,
 * not the application code.
 *
 * IoC Principle:
 * - Application code doesn't create dependencies
 * - Container creates and injects dependencies
 * - Easy to swap implementations
 * - Testable (can register mocks)
 */

import { DIContainer, DependencyKeys } from './Container';
import { IndexedDBLansiaRepository } from '../infrastructure/repositories/IndexedDBLansiaRepository';
import { HealthMetricsDomainService } from '../domain/services/HealthMetricsService';
import { HealthMetricsAdapter } from '../infrastructure/adapters/HealthMetricsAdapter';
import { RegisterLansiaUseCase } from '../use-cases/RegisterLansiaUseCase';
import { RecordPemeriksaanUseCase } from '../use-cases/RecordPemeriksaanUseCase';
import { generateIdPasien } from '../utils/generateIdPasien';
import { syncQueueRepository, pemeriksaanRepository } from '../db';
import type { ILansiaRepository } from '../domain/repositories/ILansiaRepository';
import type { IPemeriksaanRepository } from '../domain/repositories/IPemeriksaanRepository';
import type { IHealthMetricsCalculator } from '../use-cases/RecordPemeriksaanUseCase';

/**
 * Register all application dependencies
 * 
 * This function is called once at application startup to configure
 * the DI container with all necessary dependencies.
 * 
 * @param container - The DI container to register dependencies in
 */
export function registerDependencies(container: DIContainer): void {
  // ============================================
  // Repositories (Singleton)
  // ============================================
  
  /**
   * Lansia Repository
   * Singleton: Same instance used throughout the app
   */
  container.registerSingleton(
    DependencyKeys.LANSIA_REPOSITORY,
    () => new IndexedDBLansiaRepository() as ILansiaRepository
  );

  /**
   * Sync Queue Repository
   * Singleton: Existing singleton from db module
   */
  container.registerSingleton(
    DependencyKeys.SYNC_QUEUE_REPOSITORY,
    () => syncQueueRepository
  );

  // ============================================
  // Domain Services (Singleton)
  // ============================================

  /**
   * Health Metrics Domain Service
   * Singleton: Stateless service, can be reused
   */
  container.registerSingleton(
    DependencyKeys.HEALTH_METRICS_SERVICE,
    () => new HealthMetricsDomainService()
  );

  /**
   * Health Metrics Calculator (Adapter)
   * Singleton: Adapts existing utilities to domain interface
   */
  container.registerSingleton(
    DependencyKeys.HEALTH_METRICS_CALCULATOR,
    () => new HealthMetricsAdapter()
  );

  // ============================================
  // Utilities (Singleton)
  // ============================================

  /**
   * Patient Code Generator
   * Singleton: Function reference
   */
  container.registerSingleton(
    DependencyKeys.PATIENT_CODE_GENERATOR,
    () => generateIdPasien
  );

  // ============================================
  // Use Cases (Transient)
  // ============================================

  /**
   * Register Lansia Use Case
   * Transient: New instance for each operation
   * Dependencies are resolved from container
   */
  container.registerTransient(
    DependencyKeys.REGISTER_LANSIA_USE_CASE,
    () => {
      const repository = container.resolve<ILansiaRepository>(DependencyKeys.LANSIA_REPOSITORY);
      const codeGenerator = container.resolve<() => Promise<string>>(DependencyKeys.PATIENT_CODE_GENERATOR);
      return new RegisterLansiaUseCase(repository, codeGenerator);
    }
  );

  /**
   * Record Pemeriksaan Use Case
   * Transient: New instance for each operation
   * Dependencies are resolved from container
   */
  container.registerTransient(
    DependencyKeys.RECORD_PEMERIKSAAN_USE_CASE,
    () => {
      const pemeriksaanRepo = pemeriksaanRepository as unknown as IPemeriksaanRepository;
      const lansiaRepo = container.resolve<ILansiaRepository>(DependencyKeys.LANSIA_REPOSITORY);
      const healthCalculator = container.resolve<IHealthMetricsCalculator>(DependencyKeys.HEALTH_METRICS_CALCULATOR);
      return new RecordPemeriksaanUseCase(pemeriksaanRepo, lansiaRepo, healthCalculator);
    }
  );
}

/**
 * Initialize the DI container with all dependencies
 * Call this once at application startup
 * 
 * @returns Configured DI container
 */
export function initializeContainer(): DIContainer {
  const container = new DIContainer();
  registerDependencies(container);
  return container;
}
