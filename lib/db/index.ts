/**
 * IndexedDB Index
 *
 * File ini mengexport database instance dan semua repositories.
 *
 * Usage:
 * import { db, lansiaRepository, pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
 */

// Export database instance dan types
export { db } from './schema';
export type { LansiaDB, PemeriksaanDB, SyncQueueDB } from './schema';

// Export repositories
export { lansiaRepository } from './repositories/lansiaRepository';
export { pemeriksaanRepository } from './repositories/pemeriksaanRepository';
export { syncQueueRepository } from './repositories/syncQueueRepository';
export { BaseRepository } from './repositories/BaseRepository';
export type { BaseEntity } from './repositories/BaseRepository';
