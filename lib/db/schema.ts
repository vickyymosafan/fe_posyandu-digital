/**
 * IndexedDB Schema dengan Dexie
 *
 * File ini berisi definisi database schema untuk offline storage.
 * Menggunakan Dexie.js sebagai wrapper untuk IndexedDB.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle database schema definition
 * - OCP: Mudah diperluas dengan table baru
 */

import Dexie, { type EntityTable } from 'dexie';
import type { Lansia, Pemeriksaan } from '@/types';

/**
 * Interface untuk Lansia di IndexedDB
 * Menambahkan field syncedAt untuk tracking sync status
 */
export interface LansiaDB extends Lansia {
  syncedAt?: Date;
}

/**
 * Interface untuk Pemeriksaan di IndexedDB
 * Menambahkan field syncedAt untuk tracking sync status
 */
export interface PemeriksaanDB extends Pemeriksaan {
  syncedAt?: Date;
}

/**
 * Interface untuk Sync Queue
 * Menyimpan operasi yang perlu di-sync ke server
 */
export interface SyncQueueDB {
  id?: number;
  entity: 'LANSIA' | 'PEMERIKSAAN';
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: unknown;
  retryCount: number;
  createdAt: Date;
}

/**
 * Database class dengan Dexie
 */
class PosyanduDatabase extends Dexie {
  // Tables
  lansia!: EntityTable<LansiaDB, 'id'>;
  pemeriksaan!: EntityTable<PemeriksaanDB, 'id'>;
  syncQueue!: EntityTable<SyncQueueDB, 'id'>;

  constructor() {
    super('PosyanduLansiaDB');

    // Define schema
    this.version(1).stores({
      // Lansia table
      // Index: id (primary), kode (unique), nik, nama
      lansia: '++id, kode, nik, nama, syncedAt',

      // Pemeriksaan table
      // Index: id (primary), lansiaId, tanggal
      pemeriksaan: '++id, lansiaId, tanggal, syncedAt',

      // Sync Queue table
      // Index: id (primary), entity, createdAt
      syncQueue: '++id, entity, createdAt',
    });
  }
}

/**
 * Export singleton database instance
 */
export const db = new PosyanduDatabase();
