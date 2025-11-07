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

// Health Classifier (OCP-compliant generic classifier)
export {
  classifyHealthMetric,
  classifyHealthMetricSafe,
  classifyBMI as classifyBMIWithStandard,
  classifyBMISafe as classifyBMISafeWithStandard,
  classifyCholesterol as classifyCholesterolWithStandard,
  classifyUricAcid as classifyUricAcidWithStandard,
  classifyGlucoseFasting,
  classifyGlucoseRandom,
  classifyGlucose2HPP,
  BMI_STANDARD_ASIA_PACIFIC,
  BLOOD_PRESSURE_STANDARD_AHA,
  GLUCOSE_FASTING_STANDARD,
  GLUCOSE_RANDOM_STANDARD,
  GLUCOSE_2HPP_STANDARD,
  CHOLESTEROL_STANDARD,
  URIC_ACID_STANDARD_MALE,
  URIC_ACID_STANDARD_FEMALE,
} from './healthClassifier';
export type {
  ClassificationRange,
  ClassificationStandard,
  ClassificationResult,
} from './healthClassifier';

// Note: BMI, Blood Pressure, Blood Glucose, Cholesterol, and Uric Acid
// calculations are now handled by the backend API using WHO standards.
// The frontend receives calculated values from the API response.

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

// Chart Data
export {
  filterLastMonths,
  transformToBMIChartData,
  transformToTekananDarahChartData,
  transformToGulaDarahChartData,
  hasChartData,
} from './chartData';
export type { ChartDataPoint } from './chartData';

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

// Token Storage
export { getToken, setToken, removeToken, hasToken } from './tokenStorage';

// Route Guards
export { isPublicRoute, isStaticAsset, hasAccess, getDashboardUrl, requiresAuth } from './routeGuards';

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

// Number Parser (KISS utility)
export { parseNumber, parseNumbers } from './numberParser';
