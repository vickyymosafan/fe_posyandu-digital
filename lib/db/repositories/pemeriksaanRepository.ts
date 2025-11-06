/**
 * Pemeriksaan Repository
 *
 * File ini berisi CRUD operations untuk data pemeriksaan di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk pemeriksaan
 * - DIP: Depend on abstraction (Dexie table)
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada error
 */

import { db, type PemeriksaanDB } from '../schema';
import {
  assertDefined,
  assertValidNumber,
  assertValidDate,
  assertHasProperties,
} from '@/lib/utils/failFast';

/**
 * Pemeriksaan Repository Class
 */
class PemeriksaanRepository {
  /**
   * Create pemeriksaan baru
   * FAIL FAST: Validate input sebelum insert
   */
  async create(pemeriksaan: PemeriksaanDB): Promise<number> {
    // Validate required fields
    assertDefined(pemeriksaan, 'Pemeriksaan data is required');
    assertHasProperties(pemeriksaan, ['lansiaId', 'tanggal'], 'Pemeriksaan');
    assertValidNumber(pemeriksaan.lansiaId, 'Lansia ID');
    assertValidDate(pemeriksaan.tanggal, 'Tanggal pemeriksaan');

    try {
      const id = await db.pemeriksaan.add(pemeriksaan);
      console.log('[PemeriksaanRepository] Created pemeriksaan:', {
        id,
        lansiaId: pemeriksaan.lansiaId,
      });
      return id as number;
    } catch (error) {
      console.error('❌ [PemeriksaanRepository] Failed to create pemeriksaan:', error);
      throw new Error(
        `Failed to create pemeriksaan: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get pemeriksaan by ID
   * FAIL FAST: Validate ID before query
   */
  async getById(id: number): Promise<PemeriksaanDB | undefined> {
    assertValidNumber(id, 'Pemeriksaan ID');

    try {
      return await db.pemeriksaan.get(id);
    } catch (error) {
      console.error('❌ [PemeriksaanRepository] Failed to get pemeriksaan by ID:', {
        id,
        error,
      });
      throw new Error(
        `Failed to get pemeriksaan by ID: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get semua pemeriksaan by lansiaId
   */
  async getByLansiaId(lansiaId: number): Promise<PemeriksaanDB[]> {
    return await db.pemeriksaan
      .where('lansiaId')
      .equals(lansiaId)
      .reverse()
      .sortBy('tanggal');
  }

  /**
   * Get pemeriksaan terbaru by lansiaId
   */
  async getLatestByLansiaId(lansiaId: number): Promise<PemeriksaanDB | undefined> {
    return await db.pemeriksaan
      .where('lansiaId')
      .equals(lansiaId)
      .reverse()
      .sortBy('tanggal')
      .then((results) => results[0]);
  }

  /**
   * Get semua pemeriksaan
   */
  async getAll(): Promise<PemeriksaanDB[]> {
    return await db.pemeriksaan.toArray();
  }

  /**
   * Get pemeriksaan dalam range tanggal
   * FAIL FAST: Validate dates before query
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<PemeriksaanDB[]> {
    assertValidDate(startDate, 'Start date');
    assertValidDate(endDate, 'End date');

    if (startDate > endDate) {
      console.error('❌ [PemeriksaanRepository] Invalid date range:', {
        startDate,
        endDate,
      });
      throw new Error('Start date must be before or equal to end date');
    }

    try {
      return await db.pemeriksaan
        .where('tanggal')
        .between(startDate, endDate, true, true)
        .toArray();
    } catch (error) {
      console.error('❌ [PemeriksaanRepository] Failed to get pemeriksaan by date range:', {
        startDate,
        endDate,
        error,
      });
      throw new Error(
        `Failed to get pemeriksaan by date range: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update pemeriksaan
   */
  async update(id: number, data: Partial<PemeriksaanDB>): Promise<number> {
    return await db.pemeriksaan.update(id, data);
  }

  /**
   * Delete pemeriksaan
   * FAIL FAST: Validate ID before delete
   */
  async delete(id: number): Promise<void> {
    assertValidNumber(id, 'Pemeriksaan ID');

    try {
      await db.pemeriksaan.delete(id);
      console.log('[PemeriksaanRepository] Deleted pemeriksaan:', { id });
    } catch (error) {
      console.error('❌ [PemeriksaanRepository] Failed to delete pemeriksaan:', { id, error });
      throw new Error(
        `Failed to delete pemeriksaan: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete semua pemeriksaan by lansiaId
   */
  async deleteByLansiaId(lansiaId: number): Promise<void> {
    await db.pemeriksaan.where('lansiaId').equals(lansiaId).delete();
  }

  /**
   * Bulk upsert (insert or update) pemeriksaan
   * Digunakan untuk sync data dari server
   */
  async bulkUpsert(pemeriksaanList: PemeriksaanDB[]): Promise<void> {
    await db.transaction('rw', db.pemeriksaan, async () => {
      for (const pemeriksaan of pemeriksaanList) {
        // Check if exists by id
        const existing = await this.getById(pemeriksaan.id);

        if (existing) {
          // Update existing
          await this.update(existing.id, pemeriksaan);
        } else {
          // Insert new
          await this.create(pemeriksaan);
        }
      }
    });
  }

  /**
   * Clear all pemeriksaan data
   */
  async clear(): Promise<void> {
    await db.pemeriksaan.clear();
  }

  /**
   * Count total pemeriksaan
   */
  async count(): Promise<number> {
    return await db.pemeriksaan.count();
  }

  /**
   * Count pemeriksaan by lansiaId
   */
  async countByLansiaId(lansiaId: number): Promise<number> {
    return await db.pemeriksaan.where('lansiaId').equals(lansiaId).count();
  }

  /**
   * Get pemeriksaan yang belum di-sync
   */
  async getUnsyncedPemeriksaan(): Promise<PemeriksaanDB[]> {
    return await db.pemeriksaan.filter((pemeriksaan) => !pemeriksaan.syncedAt).toArray();
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
