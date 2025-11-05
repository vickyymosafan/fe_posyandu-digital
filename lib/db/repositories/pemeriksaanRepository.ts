/**
 * Pemeriksaan Repository
 *
 * File ini berisi CRUD operations untuk data pemeriksaan di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk pemeriksaan
 * - DIP: Depend on abstraction (Dexie table)
 * - KISS: Implementasi sederhana dan straightforward
 */

import { db, type PemeriksaanDB } from '../schema';

/**
 * Pemeriksaan Repository Class
 */
class PemeriksaanRepository {
  /**
   * Create pemeriksaan baru
   */
  async create(pemeriksaan: PemeriksaanDB): Promise<number> {
    const id = await db.pemeriksaan.add(pemeriksaan);
    return id as number;
  }

  /**
   * Get pemeriksaan by ID
   */
  async getById(id: number): Promise<PemeriksaanDB | undefined> {
    return await db.pemeriksaan.get(id);
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
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<PemeriksaanDB[]> {
    return await db.pemeriksaan
      .where('tanggal')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  /**
   * Update pemeriksaan
   */
  async update(id: number, data: Partial<PemeriksaanDB>): Promise<number> {
    return await db.pemeriksaan.update(id, data);
  }

  /**
   * Delete pemeriksaan
   */
  async delete(id: number): Promise<void> {
    await db.pemeriksaan.delete(id);
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
