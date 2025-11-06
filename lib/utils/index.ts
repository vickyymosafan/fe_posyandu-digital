/**
 * Utils Index
 *
 * File ini mengexport semua utility functions untuk kemudahan import.
 *
 * Usage:
 * import { hitungBMI, klasifikasiBMI, formatDate } from '@/lib/utils';
 */

// ID Generator
export { generateIdPasien } from './generateIdPasien';

// BMI
export { hitungBMI, klasifikasiBMI } from './bmi';

// Tekanan Darah
export { klasifikasiTekananDarah } from './tekananDarah';
export type { TekananDarahResult } from './tekananDarah';

// Gula Darah
export { klasifikasiGulaDarah } from './gulaDarah';
export type { KlasifikasiGulaDarah } from './gulaDarah';

// Kolesterol
export { klasifikasiKolesterol } from './kolesterol';

// Asam Urat
export { klasifikasiAsamUrat } from './asamUrat';

// Validators
export {
  nikSchema,
  kkSchema,
  emailSchema,
  passwordSchema,
  namaSchema,
  alamatSchema,
  tanggalLahirSchema,
  genderSchema,
  tinggiSchema,
  beratSchema,
  sistolikSchema,
  diastolikSchema,
  gulaDarahSchema,
  kolesterolSchema,
  asamUratSchema,
  lansiaFormSchema,
  pemeriksaanFisikSchema,
  pemeriksaanKesehatanSchema,
  petugasFormSchema,
  updateNamaSchema,
  updatePasswordSchema,
} from './validators';

// Formatters
export {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatNumber,
  formatBMI,
  formatTekananDarah,
  formatLabValue,
  parseDate,
  formatUmur,
} from './formatters';

// Errors
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  TimeoutError,
  ServerError,
  NetworkError,
  handleAPIError,
} from './errors';

// Cookies
export { setCookie, getCookie, removeCookie, hasCookie } from './cookies';
export type { CookieOptions } from './cookies';

// Sync Manager
export { syncManager, SyncManager } from './syncManager';

// Fail Fast Utilities
export {
  assertDefined,
  assert,
  assertNonEmptyString,
  assertValidNumber,
  assertInRange,
  assertNonEmptyArray,
  assertOneOf,
  assertHasProperties,
  assertValidDate,
  assertValidContext,
  unreachable,
} from './failFast';
