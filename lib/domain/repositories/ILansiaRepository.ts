/**
 * Lansia Repository Interface (Port)
 *
 * Defines the contract for Lansia data access.
 * This is a port in Clean Architecture - an abstraction that the domain layer defines.
 *
 * Clean Architecture Principle:
 * - Domain layer defines interfaces
 * - Infrastructure layer implements them
 * - Dependency Inversion: high-level modules don't depend on low-level modules
 */

import type { LansiaDomainEntity, MinimalLansiaDTO } from '../entities/Lansia';

/**
 * Repository interface for Lansia data access
 * Implementation details (IndexedDB, API, etc.) are hidden behind this interface
 */
export interface ILansiaRepository {
  /**
   * Find lansia by unique code
   */
  findByKode(kode: string): Promise<LansiaDomainEntity | null>;

  /**
   * Find lansia by NIK
   */
  findByNIK(nik: string): Promise<LansiaDomainEntity | null>;

  /**
   * Find lansia by ID
   */
  findById(id: number): Promise<LansiaDomainEntity | null>;

  /**
   * Get all lansia
   */
  findAll(): Promise<LansiaDomainEntity[]>;

  /**
   * Search lansia by query (kode, nama, or NIK)
   */
  search(query: string): Promise<MinimalLansiaDTO[]>;

  /**
   * Save new lansia
   */
  save(lansia: Omit<LansiaDomainEntity, 'id' | 'createdAt'>): Promise<LansiaDomainEntity>;

  /**
   * Update existing lansia
   */
  update(id: number, data: Partial<LansiaDomainEntity>): Promise<LansiaDomainEntity>;

  /**
   * Delete lansia
   */
  delete(id: number): Promise<void>;

  /**
   * Count total lansia
   */
  count(): Promise<number>;

  /**
   * Check if NIK already exists
   */
  existsByNIK(nik: string): Promise<boolean>;

  /**
   * Check if kode already exists
   */
  existsByKode(kode: string): Promise<boolean>;
}
