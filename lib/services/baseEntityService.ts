/**
 * Base Entity Service
 * 
 * Generic service for handling online/offline entity operations.
 * Follows DRY principle by extracting common service patterns.
 * 
 * Eliminates duplication between lansiaService and pemeriksaanService.
 */

import type { BaseEntity } from '../db/repositories/BaseRepository';
import type { SyncQueueDB } from '../db/schema';

/**
 * Result of entity creation
 */
export interface CreateEntityResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isOffline?: boolean;
}

/**
 * Repository interface for entity operations
 */
export interface EntityRepository<T extends BaseEntity> {
  create(entity: T): Promise<number>;
  getById(id: number): Promise<T | undefined>;
  getAll(): Promise<T[]>;
}

/**
 * Sync queue repository interface
 */
export interface SyncQueueRepository {
  add(item: Omit<SyncQueueDB, 'id' | 'retryCount' | 'createdAt'>): Promise<number>;
}

/**
 * API client interface for entity operations
 */
export interface EntityAPIClient<TRequest, TResponse> {
  create(data: TRequest): Promise<{ data?: TResponse; error?: string }>;
}

/**
 * Options for creating entity service
 */
export interface CreateEntityServiceOptions<TRequest, TResponse, TDB extends BaseEntity> {
  apiClient: EntityAPIClient<TRequest, TResponse>;
  repository: EntityRepository<TDB>;
  syncQueueRepository: SyncQueueRepository;
  entityType: 'LANSIA' | 'PEMERIKSAAN';
  transformResponseToDB: (response: TResponse) => TDB;
  transformRequestToDB: (request: TRequest, tempId: number) => TDB;
}

/**
 * Create entity online (with API)
 */
export async function createEntityOnline<TRequest, TResponse, TDB extends BaseEntity>(
  data: TRequest,
  options: CreateEntityServiceOptions<TRequest, TResponse, TDB>
): Promise<CreateEntityResult<TResponse>> {
  try {
    const response = await options.apiClient.create(data);

    if (response.data) {
      // Save to IndexedDB with syncedAt
      const entityDB = options.transformResponseToDB(response.data);
      await options.repository.create(entityDB);

      return {
        success: true,
        data: response.data,
        isOffline: false,
      };
    }

    return {
      success: false,
      error: response.error || 'No data returned from API',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create entity offline (IndexedDB + sync queue)
 */
export async function createEntityOffline<TRequest, TResponse, TDB extends BaseEntity>(
  data: TRequest,
  options: CreateEntityServiceOptions<TRequest, TResponse, TDB>
): Promise<CreateEntityResult<TResponse>> {
  try {
    const tempId = Date.now();
    const entityDB = options.transformRequestToDB(data, tempId);

    await options.repository.create(entityDB);

    // Add to sync queue
    await options.syncQueueRepository.add({
      entity: options.entityType,
      type: 'CREATE',
      data,
    });

    return {
      success: true,
      isOffline: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create entity (handles both online and offline)
 */
export async function createEntity<TRequest, TResponse, TDB extends BaseEntity>(
  data: TRequest,
  isOnline: boolean,
  options: CreateEntityServiceOptions<TRequest, TResponse, TDB>
): Promise<CreateEntityResult<TResponse>> {
  if (isOnline) {
    return await createEntityOnline(data, options);
  } else {
    return await createEntityOffline(data, options);
  }
}
