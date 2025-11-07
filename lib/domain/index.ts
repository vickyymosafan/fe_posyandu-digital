/**
 * Domain Layer Exports
 *
 * Central export point for all domain layer components.
 * This enforces SSOT by providing a single import location.
 *
 * Usage:
 * ```typescript
 * import { LansiaDomainEntity, LansiaValidation, LansiaMapper } from '@/lib/domain';
 * ```
 */

// Entities
export * from './entities/Lansia';
export * from './entities/Pemeriksaan';

// Repository Interfaces (Ports)
export type { ILansiaRepository } from './repositories/ILansiaRepository';
export type { IPemeriksaanRepository } from './repositories/IPemeriksaanRepository';

// Domain Services
export { HealthMetricsDomainService } from './services/HealthMetricsService';

// Mappers
export { LansiaMapper } from './mappers/LansiaMapper';
export { PemeriksaanMapper } from './mappers/PemeriksaanMapper';

// Validation (SSOT)
export { ValidationRules, isInRange, matchesPattern, isOneOf } from './validation/ValidationRules';
