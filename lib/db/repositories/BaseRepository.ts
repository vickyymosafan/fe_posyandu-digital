/**
 * Base Repository
 * 
 * Generic repository class implementing common CRUD operations.
 * Follows DRY principle by extracting shared repository logic.
 * 
 * All specific repositories can extend this class to inherit:
 * - create, getById, getAll, update, delete
 * - count, clear, bulkUpsert
 * - Consistent error handling and logging
 */

import type { Table } from 'dexie';
import {
  assertDefined,
  assertValidNumber,
} from '@/lib/utils/failFast';

/**
 * Base entity interface - all entities must have an id
 */
export interface BaseEntity {
  id?: number;
}

/**
 * Generic Base Repository Class
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected table: Table<T, number>;
  protected entityName: string;

  constructor(table: Table<T, number>, entityName: string) {
    this.table = table as Table<T, number>;
    this.entityName = entityName;
  }

  /**
   * Create new entity
   */
  async create(entity: T): Promise<number> {
    assertDefined(entity, `${this.entityName} data is required`);
    
    try {
      const id = await this.table.add(entity);
      console.log(`[${this.entityName}Repository] Created:`, { id });
      return id as number;
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to create:`, error);
      throw new Error(
        `Failed to create ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get entity by ID
   */
  async getById(id: number): Promise<T | undefined> {
    assertValidNumber(id, `${this.entityName} ID`);
    
    try {
      return await this.table.get(id);
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to get by ID:`, { id, error });
      throw new Error(
        `Failed to get ${this.entityName} by ID: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    try {
      return await this.table.toArray();
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to get all:`, error);
      throw new Error(
        `Failed to get all ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update entity
   */
  async update(id: number, data: Partial<T>): Promise<number> {
    assertValidNumber(id, `${this.entityName} ID`);
    assertDefined(data, 'Update data is required');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await this.table.update(id, data as any);
      console.log(`[${this.entityName}Repository] Updated:`, { id, result });
      return result;
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to update:`, { id, error });
      throw new Error(
        `Failed to update ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete entity
   */
  async delete(id: number): Promise<void> {
    assertValidNumber(id, `${this.entityName} ID`);
    
    try {
      await this.table.delete(id);
      console.log(`[${this.entityName}Repository] Deleted:`, { id });
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to delete:`, { id, error });
      throw new Error(
        `Failed to delete ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clear all entities
   */
  async clear(): Promise<void> {
    try {
      await this.table.clear();
      console.log(`[${this.entityName}Repository] Cleared all data`);
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to clear:`, error);
      throw new Error(
        `Failed to clear ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Count total entities
   */
  async count(): Promise<number> {
    try {
      return await this.table.count();
    } catch (error) {
      console.error(`❌ [${this.entityName}Repository] Failed to count:`, error);
      throw new Error(
        `Failed to count ${this.entityName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Bulk upsert (insert or update) entities
   * Subclasses should override this with specific logic
   */
  async bulkUpsert(_entities: T[]): Promise<void> {
    throw new Error('bulkUpsert must be implemented by subclass');
  }
}
