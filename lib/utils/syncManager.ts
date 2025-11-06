/**
 * Sync Manager
 *
 * Class untuk mengelola sinkronisasi data antara IndexedDB dan Backend API.
 * Mengikuti prinsip:
 * - SRP: Hanya handle sync logic
 * - DIP: Depend on repository abstraction
 * - Error Handling: Graceful degradation dengan retry mechanism
 */

import { syncQueueRepository, lansiaRepository } from '@/lib/db';
// import { pemeriksaanRepository } from '@/lib/db'; // TODO: Will be used when pemeriksaan sync is implemented
import { lansiaAPI, pemeriksaanAPI } from '@/lib/api';
import type { SyncQueueDB } from '@/lib/db/schema';
import type { CreateLansiaData, PemeriksaanGabunganData } from '@/types';

// ============================================
// Sync Manager Class
// ============================================

export class SyncManager {
  private isSyncing: boolean = false;
  private readonly MAX_RETRIES = 3;

  /**
   * Sync semua data dari queue ke server dan fetch latest data
   *
   * Flow:
   * 1. Check jika sudah syncing atau offline -> skip
   * 2. Process semua items di sync queue
   * 3. Sync data terbaru dari server ke IndexedDB
   *
   * @returns Promise<void>
   */
  async syncAll(): Promise<void> {
    // Prevent concurrent sync
    if (this.isSyncing) {
      console.log('[SyncManager] Sync already in progress, skipping...');
      return;
    }

    // Check online status
    if (!navigator.onLine) {
      console.log('[SyncManager] Offline, skipping sync...');
      return;
    }

    this.isSyncing = true;
    console.log('[SyncManager] Starting sync...');

    try {
      // Step 1: Process sync queue
      await this.processSyncQueue();

      // Step 2: Sync from server
      await this.syncFromServer();

      console.log('[SyncManager] Sync completed successfully');
    } catch (error) {
      console.error('[SyncManager] Sync failed:', error);
      // Don't throw - graceful degradation
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process semua items di sync queue
   *
   * @private
   */
  private async processSyncQueue(): Promise<void> {
    try {
      const queue = await syncQueueRepository.getAll();

      if (queue.length === 0) {
        console.log('[SyncManager] Queue is empty');
        return;
      }

      console.log(`[SyncManager] Processing ${queue.length} items in queue...`);

      for (const item of queue) {
        try {
          await this.processQueueItem(item);

          // Success - remove from queue
          if (item.id) {
            await syncQueueRepository.delete(item.id);
            console.log(`[SyncManager] Item ${item.id} synced successfully`);
          }
        } catch (error) {
          console.error(`[SyncManager] Failed to process item ${item.id}:`, error);

          // Increment retry count
          if (item.id) {
            await syncQueueRepository.incrementRetryCount(item.id);

            // Remove if exceeded max retries
            if (item.retryCount >= this.MAX_RETRIES) {
              await syncQueueRepository.delete(item.id);
              console.warn(
                `[SyncManager] Item ${item.id} exceeded max retries, removing from queue`
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('[SyncManager] Error processing sync queue:', error);
      throw error;
    }
  }

  /**
   * Process individual queue item
   *
   * @private
   * @param item - Queue item to process
   */
  private async processQueueItem(item: SyncQueueDB): Promise<void> {
    switch (item.entity) {
      case 'LANSIA':
        await this.processLansiaItem(item);
        break;

      case 'PEMERIKSAAN':
        await this.processPemeriksaanItem(item);
        break;

      default:
        console.warn(`[SyncManager] Unknown entity type: ${item.entity}`);
    }
  }

  /**
   * Process lansia queue item
   *
   * @private
   * @param item - Lansia queue item
   */
  private async processLansiaItem(item: SyncQueueDB): Promise<void> {
    if (item.type === 'CREATE') {
      const data = item.data as CreateLansiaData;
      const response = await lansiaAPI.create(data);

      if (!response.data) {
        throw new Error(response.error || 'Failed to create lansia');
      }

      console.log(`[SyncManager] Lansia created: ${response.data.kode}`);
    }
    // TODO: Handle UPDATE and DELETE when needed
  }

  /**
   * Process pemeriksaan queue item
   *
   * @private
   * @param item - Pemeriksaan queue item
   */
  private async processPemeriksaanItem(item: SyncQueueDB): Promise<void> {
    if (item.type === 'CREATE') {
      const data = item.data as PemeriksaanGabunganData & { kode: string };
      const { kode, ...pemeriksaanData } = data;

      const response = await pemeriksaanAPI.createGabungan(kode, pemeriksaanData);

      if (!response.data) {
        throw new Error(response.error || 'Failed to create pemeriksaan');
      }

      console.log(`[SyncManager] Pemeriksaan created for lansia: ${kode}`);
    }
    // TODO: Handle UPDATE and DELETE when needed
  }

  /**
   * Sync data terbaru dari server ke IndexedDB
   *
   * @private
   */
  private async syncFromServer(): Promise<void> {
    try {
      console.log('[SyncManager] Syncing data from server...');

      // Sync lansia data
      const lansiaResponse = await lansiaAPI.getAll();

      if (lansiaResponse.data) {
        // Convert string dates dari API response ke Date objects
        const lansiaList = lansiaResponse.data.map((lansia) => ({
          ...lansia,
          tanggalLahir: new Date(lansia.tanggalLahir),
          createdAt: new Date(lansia.createdAt),
          syncedAt: new Date(),
        }));

        await lansiaRepository.bulkUpsert(lansiaList);
        console.log(`[SyncManager] Synced ${lansiaList.length} lansia from server`);
      }

      // TODO: Sync pemeriksaan data when API endpoint available
      // const pemeriksaanResponse = await pemeriksaanAPI.getAll();
      // if (pemeriksaanResponse.data) {
      //   await pemeriksaanRepository.bulkUpsert(pemeriksaanResponse.data);
      // }
    } catch (error) {
      console.error('[SyncManager] Error syncing from server:', error);
      throw error;
    }
  }

  /**
   * Check if currently syncing
   *
   * @returns boolean
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

// ============================================
// Singleton Instance
// ============================================

/**
 * Singleton instance of SyncManager
 *
 * Usage:
 * ```typescript
 * import { syncManager } from '@/lib/utils/syncManager';
 *
 * // Trigger sync
 * await syncManager.syncAll();
 *
 * // Check sync status
 * if (syncManager.isSyncInProgress()) {
 *   console.log('Syncing...');
 * }
 * ```
 */
export const syncManager = new SyncManager();
