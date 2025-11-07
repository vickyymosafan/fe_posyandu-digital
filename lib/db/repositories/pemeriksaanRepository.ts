/**
 * Pemeriksaan Repository
 *
 * File ini berisi CRUD operations untuk data pemeriksaan di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk pemeriksaan
 * - DIP: Depend on abstraction (Dexie table)
 * - DRY: Extends BaseRepository untuk common operations
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada error
 */

import { db, type PemeriksaanDB } from '../schema';
import { BaseRepository } from './BaseRepository';
import {
  assertValidNumber,
  assertValidDate,
  assertHasProperties,
} from '@/lib/utils/failFast';

/**
 * Pemeriksaan Repository Class
 * Extends BaseRepository for common CRUD operations
 */
class PemeriksaanRepository extends BaseRepository<PemeriksaanDB> {
  constructor() {
    super(db.pemeriksaan as any, 'Pemeriksaan');
  }

  /**
   * Override create to add custom validation
   */
  async create(pemeriksaan: PemeriksaanDB): Promise<number> {
    assertHasProperties(pemeriksaan, ['lansiaId', 'tanggal'], 'Pemeriksaan');
    assertValidNumber(pemeriksaan.lansiaId, 'Lansia ID');
    assertValidDate(pemeriksaan.tanggal, 'Tanggal pemeriksaan');

    return super.create(pemeriksaan);
  }

  /**
   * Get semua pemeriksaan by lansiaId
   */
  async getByLansiaId(lansiaId: number): Promise<PemeriksaanDB[]> {
    return await this.table
      .where('lansiaId')
      .equals(lansiaId)
      .reverse()
      .sortBy('tanggal');
  }

  /**
   * Get pemeriksaan terbaru by lansiaId
   */
  async getLatestByLansiaId(lansiaId: number): Promise<PemeriksaanDB | undefined> {
    return await this.table
      .where('lansiaId')
      .equals(lansiaId)
      .reverse()
      .sortBy('tanggal')
      .then((results) => results[0]);
  }

  /**
   * Get pemeriksaan dalam range tanggal
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<PemeriksaanDB[]> {
    assertValidDate(startDate, 'Start date');
    assertValidDate(endDate, 'End date');

    if (startDate > endDate) {
      throw new Error('Start date must be before or equal to end date');
    }

    return await this.table
      .where('tanggal')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  /**
   * Delete semua pemeriksaan by lansiaId
   */
  async deleteByLansiaId(lansiaId: number): Promise<void> {
    await this.table.where('lansiaId').equals(lansiaId).delete();
  }

  /**
   * Bulk upsert (insert or update) pemeriksaan
   */
  async bulkUpsert(pemeriksaanList: PemeriksaanDB[]): Promise<void> {
    await db.transaction('rw', this.table, async () => {
      for (const pemeriksaan of pemeriksaanList) {
        const existing = await this.getById(pemeriksaan.id);
        if (existing) {
          await this.update(existing.id, pemeriksaan);
        } else {
          await this.create(pemeriksaan);
        }
      }
    });
  }

  /**
   * Count pemeriksaan by lansiaId
   */
  async countByLansiaId(lansiaId: number): Promise<number> {
    return await this.table.where('lansiaId').equals(lansiaId).count();
  }

  /**
   * Get pemeriksaan yang belum di-sync
   */
  async getUnsyncedPemeriksaan(): Promise<PemeriksaanDB[]> {
    return await this.table.filter((pemeriksaan) => !pemeriksaan.syncedAt).toArray();
  }

  /**
   * Get pemeriksaan hari ini
   */
  async getTodayPemeriksaan(): Promise<PemeriksaanDB[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.getByDateRange(today, tomorrow);
  }
}

/**
 * Export singleton instance
 */
export const pemeriksaanRepository = new PemeriksaanRepository();
