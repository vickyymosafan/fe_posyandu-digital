/**
 * Sync Queue Repository
 *
 * File ini berisi CRUD operations untuk sync queue di IndexedDB.
 * Sync queue menyimpan operasi yang perlu di-sync ke server saat offline.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle operasi database untuk sync queue
 * - DIP: Depend on abstraction (Dexie table)
 * - KISS: Implementasi sederhana dan straightforward
 */

import { db, type SyncQueueDB } from '../schema';

/**
 * Sync Queue Repository Class
 */
class SyncQueueRepository {
  /**
   * Add item ke sync queue
   */
  async add(item: Omit<SyncQueueDB, 'id' | 'retryCount' | 'createdAt'>): Promise<number> {
    const id = await db.syncQueue.add({
      ...item,
      retryCount: 0,
      createdAt: new Date(),
    });
    return id as number;
  }

  /**
   * Get item by ID
   */
  async getById(id: number): Promise<SyncQueueDB | undefined> {
    return await db.syncQueue.get(id);
  }

  /**
   * Get semua items dalam queue
   */
  async getAll(): Promise<SyncQueueDB[]> {
    return await db.syncQueue.orderBy('createdAt').toArray();
  }

  /**
   * Get items by entity type
   */
  async getByEntity(entity: 'LANSIA' | 'PEMERIKSAAN'): Promise<SyncQueueDB[]> {
    return await db.syncQueue.where('entity').equals(entity).toArray();
  }

  /**
   * Update item
   */
  async update(id: number, data: Partial<SyncQueueDB>): Promise<number> {
    return await db.syncQueue.update(id, data);
  }

  /**
   * Delete item
   */
  async delete(id: number): Promise<void> {
    await db.syncQueue.delete(id);
  }

  /**
   * Increment retry count
   */
  async incrementRetryCount(id: number): Promise<void> {
    const item = await this.getById(id);
    if (item) {
      await this.update(id, {
        retryCount: item.retryCount + 1,
      });
    }
  }

  /**
   * Delete items dengan retry count > maxRetries
   */
  async deleteFailedItems(maxRetries: number = 3): Promise<void> {
    const items = await db.syncQueue.filter((item) => item.retryCount > maxRetries).toArray();

    for (const item of items) {
      if (item.id) {
        await this.delete(item.id);
      }
    }
  }

  /**
   * Clear all sync queue
   */
  async clear(): Promise<void> {
    await db.syncQueue.clear();
  }

  /**
   * Count total items dalam queue
   */
  async count(): Promise<number> {
    return await db.syncQueue.count();
  }

  /**
   * Check if queue is empty
   */
  async isEmpty(): Promise<boolean> {
    const count = await this.count();
    return count === 0;
  }

  /**
   * Get oldest item (FIFO)
   */
  async getOldest(): Promise<SyncQueueDB | undefined> {
    return await db.syncQueue.orderBy('createdAt').first();
  }

  /**
   * Bulk delete items by IDs
   */
  async bulkDelete(ids: number[]): Promise<void> {
    await db.syncQueue.bulkDelete(ids);
  }
}

/**
 * Export singleton instance
 */
export const syncQueueRepository = new SyncQueueRepository();
