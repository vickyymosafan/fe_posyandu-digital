/**
 * Lansia Repository
 *
 * File ini berisi CRUD operations untuk data lansia di IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk lansia
 * - DIP: Depend on abstraction (Dexie table)
 * - DRY: Extends BaseRepository untuk common operations
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada error
 */

import { db, type LansiaDB } from '../schema';
import { BaseRepository } from './BaseRepository';
import {
  assertNonEmptyString,
  assertHasProperties,
} from '@/lib/utils/failFast';

/**
 * Lansia Repository Class
 * Extends BaseRepository for common CRUD operations
 */
class LansiaRepository extends BaseRepository<LansiaDB> {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(db.lansia as any, 'Lansia');
  }

  /**
   * Override create to add custom validation
   */
  async create(lansia: LansiaDB): Promise<number> {
    // Validate required fields
    assertHasProperties(
      lansia,
      ['kode', 'nik', 'kk', 'nama', 'tanggalLahir', 'gender', 'alamat'],
      'Lansia'
    );
    assertNonEmptyString(lansia.kode, 'Kode');
    assertNonEmptyString(lansia.nik, 'NIK');
    assertNonEmptyString(lansia.nama, 'Nama');

    return super.create(lansia);
  }

  /**
   * Get lansia by kode
   */
  async getByKode(kode: string): Promise<LansiaDB | undefined> {
    assertNonEmptyString(kode, 'Kode');
    return await this.table.where('kode').equals(kode).first();
  }

  /**
   * Get lansia by NIK
   */
  async getByNik(nik: string): Promise<LansiaDB | undefined> {
    return await this.table.where('nik').equals(nik).first();
  }

  /**
   * Search lansia by kode, nama, atau NIK
   */
  async search(query: string): Promise<LansiaDB[]> {
    const lowerQuery = query.toLowerCase();

    return await this.table
      .filter(
        (lansia) =>
          lansia.kode.toLowerCase().includes(lowerQuery) ||
          lansia.nama.toLowerCase().includes(lowerQuery) ||
          lansia.nik.includes(query)
      )
      .toArray();
  }

  /**
   * Override update to add custom validation
   */
  async update(id: number, data: Partial<LansiaDB>): Promise<number> {
    // Validate string fields if provided
    if (data.kode !== undefined) assertNonEmptyString(data.kode, 'Kode');
    if (data.nik !== undefined) assertNonEmptyString(data.nik, 'NIK');
    if (data.nama !== undefined) assertNonEmptyString(data.nama, 'Nama');
    
    return super.update(id, data);
  }

  /**
   * Bulk upsert (insert or update) lansia
   */
  async bulkUpsert(lansiaList: LansiaDB[]): Promise<void> {
    await db.transaction('rw', this.table, async () => {
      for (const lansia of lansiaList) {
        const existing = await this.getByKode(lansia.kode);
        if (existing) {
          await this.update(existing.id, lansia);
        } else {
          await this.create(lansia);
        }
      }
    });
  }

  /**
   * Get lansia yang belum di-sync
   */
  async getUnsyncedLansia(): Promise<LansiaDB[]> {
    return await this.table.filter((lansia) => !lansia.syncedAt).toArray();
  }
}

/**
 * Export singleton instance
 */
export const lansiaRepository = new LansiaRepository();
