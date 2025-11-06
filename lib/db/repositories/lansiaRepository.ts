/**
 * Lansia Repository
 *
 * File ini berisi CRUD operations untuk data lansia di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk lansia
 * - DIP: Depend on abstraction (Dexie table)
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada error
 */

import { db, type LansiaDB } from '../schema';
import {
  assertDefined,
  assertNonEmptyString,
  assertValidNumber,
  assertHasProperties,
} from '@/lib/utils/failFast';

/**
 * Lansia Repository Class
 */
class LansiaRepository {
  /**
   * Create lansia baru
   * FAIL FAST: Validate input sebelum insert
   */
  async create(lansia: LansiaDB): Promise<number> {
    // Validate required fields
    assertDefined(lansia, 'Lansia data is required');
    assertHasProperties(
      lansia,
      ['kode', 'nik', 'kk', 'nama', 'tanggalLahir', 'gender', 'alamat'],
      'Lansia'
    );
    assertNonEmptyString(lansia.kode, 'Kode');
    assertNonEmptyString(lansia.nik, 'NIK');
    assertNonEmptyString(lansia.nama, 'Nama');

    try {
      const id = await db.lansia.add(lansia);
      console.log('[LansiaRepository] Created lansia:', { id, kode: lansia.kode });
      return id as number;
    } catch (error) {
      console.error('❌ [LansiaRepository] Failed to create lansia:', error);
      throw new Error(`Failed to create lansia: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get lansia by ID
   * FAIL FAST: Validate ID before query
   */
  async getById(id: number): Promise<LansiaDB | undefined> {
    assertValidNumber(id, 'Lansia ID');
    
    try {
      return await db.lansia.get(id);
    } catch (error) {
      console.error('❌ [LansiaRepository] Failed to get lansia by ID:', { id, error });
      throw new Error(`Failed to get lansia by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get lansia by kode
   * FAIL FAST: Validate kode before query
   */
  async getByKode(kode: string): Promise<LansiaDB | undefined> {
    assertNonEmptyString(kode, 'Kode');
    
    try {
      return await db.lansia.where('kode').equals(kode).first();
    } catch (error) {
      console.error('❌ [LansiaRepository] Failed to get lansia by kode:', { kode, error });
      throw new Error(`Failed to get lansia by kode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
   * FAIL FAST: Validate input before update
   */
  async update(id: number, data: Partial<LansiaDB>): Promise<number> {
    assertValidNumber(id, 'Lansia ID');
    assertDefined(data, 'Update data is required');
    
    // Validate string fields if provided
    if (data.kode !== undefined) assertNonEmptyString(data.kode, 'Kode');
    if (data.nik !== undefined) assertNonEmptyString(data.nik, 'NIK');
    if (data.nama !== undefined) assertNonEmptyString(data.nama, 'Nama');
    
    try {
      const result = await db.lansia.update(id, data);
      console.log('[LansiaRepository] Updated lansia:', { id, result });
      return result;
    } catch (error) {
      console.error('❌ [LansiaRepository] Failed to update lansia:', { id, error });
      throw new Error(`Failed to update lansia: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete lansia
   * FAIL FAST: Validate ID before delete
   */
  async delete(id: number): Promise<void> {
    assertValidNumber(id, 'Lansia ID');
    
    try {
      await db.lansia.delete(id);
      console.log('[LansiaRepository] Deleted lansia:', { id });
    } catch (error) {
      console.error('❌ [LansiaRepository] Failed to delete lansia:', { id, error });
      throw new Error(`Failed to delete lansia: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
