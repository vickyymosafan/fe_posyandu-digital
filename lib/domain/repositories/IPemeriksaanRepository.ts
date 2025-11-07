/**
 * Pemeriksaan Repository Interface (Port)
 *
 * Defines the contract for Pemeriksaan data access.
 * This is a port in Clean Architecture.
 *
 * Clean Architecture Principle:
 * - Domain defines what it needs
 * - Infrastructure provides implementation
 * - Business logic doesn't know about database details
 */

import type { PemeriksaanDomainEntity } from '../entities/Pemeriksaan';

/**
 * Repository interface for Pemeriksaan data access
 */
export interface IPemeriksaanRepository {
  /**
   * Find pemeriksaan by ID
   */
  findById(id: number): Promise<PemeriksaanDomainEntity | null>;

  /**
   * Find all pemeriksaan for a lansia
   */
  findByLansiaId(lansiaId: number): Promise<PemeriksaanDomainEntity[]>;

  /**
   * Find latest pemeriksaan for a lansia
   */
  findLatestByLansiaId(lansiaId: number): Promise<PemeriksaanDomainEntity | null>;

  /**
   * Find pemeriksaan within date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<PemeriksaanDomainEntity[]>;

  /**
   * Find today's pemeriksaan
   */
  findToday(): Promise<PemeriksaanDomainEntity[]>;

  /**
   * Get all pemeriksaan
   */
  findAll(): Promise<PemeriksaanDomainEntity[]>;

  /**
   * Save new pemeriksaan
   */
  save(
    pemeriksaan: Omit<PemeriksaanDomainEntity, 'id' | 'createdAt'>
  ): Promise<PemeriksaanDomainEntity>;

  /**
   * Update existing pemeriksaan
   */
  update(
    id: number,
    data: Partial<PemeriksaanDomainEntity>
  ): Promise<PemeriksaanDomainEntity>;

  /**
   * Delete pemeriksaan
   */
  delete(id: number): Promise<void>;

  /**
   * Delete all pemeriksaan for a lansia
   */
  deleteByLansiaId(lansiaId: number): Promise<void>;

  /**
   * Count pemeriksaan for a lansia
   */
  countByLansiaId(lansiaId: number): Promise<number>;

  /**
   * Count total pemeriksaan
   */
  count(): Promise<number>;
}
