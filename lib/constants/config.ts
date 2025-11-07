/**
 * Application Configuration Constants
 *
 * Central location for all magic numbers and configuration values.
 * Following "Code for Humans" principle - give meaningful names to all values.
 */

// ============================================
// API Configuration
// ============================================

/**
 * Default timeout for API requests (30 seconds)
 * Increased from typical 10s to accommodate slower connections
 */
export const API_REQUEST_TIMEOUT_MS = 30_000;

/**
 * Health check timeout (5 seconds)
 * Shorter timeout for quick health verification
 */
export const HEALTH_CHECK_TIMEOUT_MS = 5_000;

// ============================================
// ID Generation Configuration
// ============================================

/**
 * Maximum retry attempts when generating unique patient ID
 * Prevents infinite loops while allowing reasonable collision resolution
 */
export const PATIENT_ID_MAX_RETRIES = 10;

/**
 * Length of random suffix in patient ID (base62 characters)
 * 2 characters = 62^2 = 3,844 possible combinations per day
 */
export const PATIENT_ID_SUFFIX_LENGTH = 2;

/**
 * Patient ID prefix for easy identification
 */
export const PATIENT_ID_PREFIX = 'pasien';

// ============================================
// Notification Configuration
// ============================================

/**
 * Default notification display duration (5 seconds)
 */
export const NOTIFICATION_DURATION_MS = 5_000;

/**
 * Short notification duration (3 seconds)
 * For less important messages
 */
export const NOTIFICATION_DURATION_SHORT_MS = 3_000;

/**
 * Long notification duration (10 seconds)
 * For important messages that need more attention
 */
export const NOTIFICATION_DURATION_LONG_MS = 10_000;

// ============================================
// Sync Configuration
// ============================================

/**
 * Maximum retry attempts for sync queue items
 * After this, items are considered failed and removed
 */
export const SYNC_MAX_RETRIES = 3;

/**
 * Sync interval when online (5 minutes)
 */
export const SYNC_INTERVAL_MS = 5 * 60 * 1_000;

// ============================================
// Console Formatting
// ============================================

/**
 * Console separator line (80 characters)
 * Used for visual separation in logs
 */
export const CONSOLE_SEPARATOR = '='.repeat(80);

/**
 * Console sub-separator line (80 characters)
 * Used for sub-sections in logs
 */
export const CONSOLE_SUB_SEPARATOR = '-'.repeat(80);

/**
 * Console section width for aligned output
 */
export const CONSOLE_SECTION_WIDTH = 80;

// ============================================
// Validation Limits
// ============================================

/**
 * Health metric validation ranges
 * Extracted from validators for reusability
 */
export const HEALTH_LIMITS = {
  HEIGHT: { MIN: 50, MAX: 250, UNIT: 'cm' },
  WEIGHT: { MIN: 20, MAX: 300, UNIT: 'kg' },
  BLOOD_PRESSURE_SYSTOLIC: { MIN: 50, MAX: 300, UNIT: 'mmHg' },
  BLOOD_PRESSURE_DIASTOLIC: { MIN: 30, MAX: 200, UNIT: 'mmHg' },
  BLOOD_GLUCOSE: { MIN: 20, MAX: 600, UNIT: 'mg/dL' },
  CHOLESTEROL: { MIN: 50, MAX: 500, UNIT: 'mg/dL' },
  URIC_ACID: { MIN: 1, MAX: 20, UNIT: 'mg/dL' },
} as const;

/**
 * ID validation lengths
 */
export const ID_LENGTHS = {
  NIK: 16,
  KK: 16,
} as const;

/**
 * Password requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRES_LETTER: true,
  REQUIRES_NUMBER: true,
  REQUIRES_SYMBOL: true,
} as const;
