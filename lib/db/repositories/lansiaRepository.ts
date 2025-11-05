/**
 * Lansia Repository
 *
 * File ini berisi CRUD operations untuk data lansia di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk lansia
 * - DIP: Depend on abstraction (Dexie table)
 * - KISS: Implementasi sederhana dan straightforward
 */

import { db, type LansiaDB } from '../schema';

/**
 * Lansia Repository Class
 */
class LansiaRepository {
  /**
   * Create lansia baru
   */
  async create(lansia: LansiaDB): Promise<number> {
    const id = await db.lansia.add(lansia);
    return id as number;
  }

  /**
   * Get lansia by ID
   */
  async getById(id: number): Promise<LansiaDB | undefined> {
    return await db.lansia.get(id);
  }

  /**
   * Get lansia by kode
   */
  async getByKode(kode: string): Promise<LansiaDB | undefined> {
    return await db.lansia.where('kode').equals(kode).first();
  }

  /**
   * Get lansia by NIK
   */
  async getByNik(nik: string): Promise<LansiaDB | undefined> {
    return await db.lansia.where('nik').equals(nik).first();
  }

  /**
   * Get semua lansia
   */
  async getAll(): Promise<LansiaDB[]> {
    return await db.lansia.toArray();
  }

  /**
   * Search lansia by kode, nama, atau NIK
   */
  async search(query: string): Promise<LansiaDB[]> {
    const lowerQuery = query.toLowerCase();

    return await db.lansia
      .filter(
        (lansia) =>
          lansia.kode.toLowerCase().includes(lowerQuery) ||
          lansia.nama.toLowerCase().includes(lowerQuery) ||
          lansia.nik.includes(query)
      )
      .toArray();
  }

  /**
   * Update lansia
   */
  async update(id: number, data: Partial<LansiaDB>): Promise<number> {
    return await db.lansia.update(id, data);
  }

  /**
   * Delete lansia
   */
  async delete(id: number): Promise<void> {
    await db.lansia.delete(id);
  }

  /**
   * Bulk upsert (insert or update) lansia
   * Digunakan untuk sync data dari server
   */
  async bulkUpsert(lansiaList: LansiaDB[]): Promise<void> {
    await db.transaction('rw', db.lansia, async () => {
      for (const lansia of lansiaList) {
        // Check if exists by kode
        const existing = await this.getByKode(lansia.kode);

        if (existing) {
          // Update existing
          await this.update(existing.id, lansia);
        } else {
          // Insert new
          await this.create(lansia);
        }
      }
    });
  }

  /**
   * Clear all lansia data
   */
  async clear(): Promise<void> {
    await db.lansia.clear();
  }

  /**
   * Count total lansia
   */
  async count(): Promise<number> {
    return await db.lansia.count();
  }

  /**
   * Get lansia yang belum di-sync (syncedAt is undefined or old)
   */
  async getUnsyncedLansia(): Promise<LansiaDB[]> {
    return await db.lansia.filter((lansia) => !lansia.syncedAt).toArray();
  }
}

/**
 * Export singleton instance
 */
export const lansiaRepository = new LansiaRepository();
