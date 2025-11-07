/**
 * Services Layer Index
 *
 * Central export for all business logic services.
 * Follows Separation of Concerns - business logic separated from UI/hooks.
 *
 * Services Layer Responsibilities:
 * - Business logic and calculations
 * - Data transformation
 * - Coordination between API and local storage
 * - Domain-specific operations
 *
 * What Services DON'T do:
 * - UI rendering
 * - React state management
 * - Direct user interaction
 * - Routing/navigation
 */

// Health Metrics Service
export {
  calculateBMI,
  classifyBloodPressure,
  classifyBloodGlucose,
  classifyCholesterol,
  classifyUricAcid,
  calculateAllHealthMetrics,
} from './healthMetricsService';

export type {
  BMIResult,
  TekananDarahResult,
  KlasifikasiGulaDarah,
  HealthMetricsResult,
} from './healthMetricsService';

// Lansia Service
export {
  generateUniqueLansiaId,
  createLansia,
  transformFormDataToCreateLansiaData,
  getLansiaByKode,
  getAllLansia,
  searchLansia,
} from './lansiaService';

export type { CreateLansiaResult } from './lansiaService';

// Pemeriksaan Service
export {
  transformGabunganFormData,
  transformKesehatanFormData,
  createPemeriksaanGabungan,
  createPemeriksaanKesehatan,
  getPemeriksaanHistory,
} from './pemeriksaanService';

export type {
  CreatePemeriksaanResult,
  PemeriksaanGabunganFormData as PemeriksaanGabunganFormDataService,
  PemeriksaanKesehatanFormData as PemeriksaanKesehatanFormDataService,
} from './pemeriksaanService';

// Base Entity Service (for DRY)
export {
  createEntity,
  createEntityOnline,
  createEntityOffline,
} from './baseEntityService';

export type {
  CreateEntityResult,
  EntityRepository,
  SyncQueueRepository as SyncQueueRepositoryInterface,
  EntityAPIClient,
  CreateEntityServiceOptions,
} from './baseEntityService';
