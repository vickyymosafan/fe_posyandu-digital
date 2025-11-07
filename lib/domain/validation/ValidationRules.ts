/**
 * Validation Rules - Single Source of Truth
 *
 * This file is the SSOT for all validation rules in the application.
 * All validators (Zod schemas, domain validation, etc.) should derive from here.
 *
 * SSOT Principle:
 * - Define rules once
 * - Import and reuse everywhere
 * - No duplication of validation logic
 */

import { HEALTH_LIMITS, ID_LENGTHS, PASSWORD_REQUIREMENTS } from '@/lib/constants';

/**
 * Validation Rules Registry
 * Single source of truth for all validation rules
 */
export const ValidationRules = {
  /**
   * NIK Validation Rules
   */
  NIK: {
    LENGTH: ID_LENGTHS.NIK,
    PATTERN: /^\d{16}$/,
    ERROR_MESSAGES: {
      INVALID_LENGTH: `NIK harus ${ID_LENGTHS.NIK} digit`,
      INVALID_FORMAT: 'NIK harus berisi angka saja',
      REQUIRED: 'NIK tidak boleh kosong',
    },
  },

  /**
   * KK Validation Rules
   */
  KK: {
    LENGTH: ID_LENGTHS.KK,
    PATTERN: /^\d{16}$/,
    ERROR_MESSAGES: {
      INVALID_LENGTH: `KK harus ${ID_LENGTHS.KK} digit`,
      INVALID_FORMAT: 'KK harus berisi angka saja',
      REQUIRED: 'KK tidak boleh kosong',
    },
  },

  /**
   * Name Validation Rules
   */
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
    ERROR_MESSAGES: {
      REQUIRED: 'Nama tidak boleh kosong',
      TOO_SHORT: 'Nama terlalu pendek',
      TOO_LONG: 'Nama terlalu panjang',
    },
  },

  /**
   * Email Validation Rules
   */
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ERROR_MESSAGES: {
      INVALID: 'Format email tidak valid',
      REQUIRED: 'Email tidak boleh kosong',
    },
  },

  /**
   * Password Validation Rules
   */
  PASSWORD: {
    MIN_LENGTH: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    REQUIRES_LETTER: PASSWORD_REQUIREMENTS.REQUIRES_LETTER,
    REQUIRES_NUMBER: PASSWORD_REQUIREMENTS.REQUIRES_NUMBER,
    REQUIRES_SYMBOL: PASSWORD_REQUIREMENTS.REQUIRES_SYMBOL,
    PATTERNS: {
      LETTER: /[a-zA-Z]/,
      NUMBER: /\d/,
      SYMBOL: /[^a-zA-Z0-9]/,
    },
    ERROR_MESSAGES: {
      TOO_SHORT: `Password minimal ${PASSWORD_REQUIREMENTS.MIN_LENGTH} karakter`,
      NO_LETTER: 'Password harus mengandung huruf',
      NO_NUMBER: 'Password harus mengandung angka',
      NO_SYMBOL: 'Password harus mengandung simbol',
      REQUIRED: 'Password tidak boleh kosong',
    },
  },

  /**
   * Gender Validation Rules
   */
  GENDER: {
    ALLOWED_VALUES: ['L', 'P'] as const,
    ERROR_MESSAGES: {
      INVALID: 'Jenis kelamin harus L atau P',
      REQUIRED: 'Jenis kelamin tidak boleh kosong',
    },
  },

  /**
   * Address Validation Rules
   */
  ADDRESS: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
    ERROR_MESSAGES: {
      REQUIRED: 'Alamat tidak boleh kosong',
      TOO_LONG: 'Alamat terlalu panjang',
    },
  },

  /**
   * Health Metrics Validation Rules
   */
  HEALTH: {
    HEIGHT: {
      MIN: HEALTH_LIMITS.HEIGHT.MIN,
      MAX: HEALTH_LIMITS.HEIGHT.MAX,
      UNIT: HEALTH_LIMITS.HEIGHT.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Tinggi badan harus antara ${HEALTH_LIMITS.HEIGHT.MIN}-${HEALTH_LIMITS.HEIGHT.MAX} ${HEALTH_LIMITS.HEIGHT.UNIT}`,
        REQUIRED: 'Tinggi badan tidak boleh kosong',
      },
    },
    WEIGHT: {
      MIN: HEALTH_LIMITS.WEIGHT.MIN,
      MAX: HEALTH_LIMITS.WEIGHT.MAX,
      UNIT: HEALTH_LIMITS.WEIGHT.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Berat badan harus antara ${HEALTH_LIMITS.WEIGHT.MIN}-${HEALTH_LIMITS.WEIGHT.MAX} ${HEALTH_LIMITS.WEIGHT.UNIT}`,
        REQUIRED: 'Berat badan tidak boleh kosong',
      },
    },
    BLOOD_PRESSURE_SYSTOLIC: {
      MIN: HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MIN,
      MAX: HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MAX,
      UNIT: HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Tekanan darah sistolik harus antara ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MIN}-${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MAX} ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.UNIT}`,
        REQUIRED: 'Tekanan darah sistolik tidak boleh kosong',
      },
    },
    BLOOD_PRESSURE_DIASTOLIC: {
      MIN: HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MIN,
      MAX: HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MAX,
      UNIT: HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Tekanan darah diastolik harus antara ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MIN}-${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MAX} ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.UNIT}`,
        REQUIRED: 'Tekanan darah diastolik tidak boleh kosong',
      },
    },
    BLOOD_GLUCOSE: {
      MIN: HEALTH_LIMITS.BLOOD_GLUCOSE.MIN,
      MAX: HEALTH_LIMITS.BLOOD_GLUCOSE.MAX,
      UNIT: HEALTH_LIMITS.BLOOD_GLUCOSE.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Gula darah harus antara ${HEALTH_LIMITS.BLOOD_GLUCOSE.MIN}-${HEALTH_LIMITS.BLOOD_GLUCOSE.MAX} ${HEALTH_LIMITS.BLOOD_GLUCOSE.UNIT}`,
      },
    },
    CHOLESTEROL: {
      MIN: HEALTH_LIMITS.CHOLESTEROL.MIN,
      MAX: HEALTH_LIMITS.CHOLESTEROL.MAX,
      UNIT: HEALTH_LIMITS.CHOLESTEROL.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Kolesterol harus antara ${HEALTH_LIMITS.CHOLESTEROL.MIN}-${HEALTH_LIMITS.CHOLESTEROL.MAX} ${HEALTH_LIMITS.CHOLESTEROL.UNIT}`,
      },
    },
    URIC_ACID: {
      MIN: HEALTH_LIMITS.URIC_ACID.MIN,
      MAX: HEALTH_LIMITS.URIC_ACID.MAX,
      UNIT: HEALTH_LIMITS.URIC_ACID.UNIT,
      ERROR_MESSAGES: {
        OUT_OF_RANGE: `Asam urat harus antara ${HEALTH_LIMITS.URIC_ACID.MIN}-${HEALTH_LIMITS.URIC_ACID.MAX} ${HEALTH_LIMITS.URIC_ACID.UNIT}`,
      },
    },
  },

  /**
   * Date Validation Rules
   */
  DATE: {
    ERROR_MESSAGES: {
      INVALID: 'Format tanggal tidak valid',
      FUTURE: 'Tanggal tidak boleh di masa depan',
      REQUIRED: 'Tanggal tidak boleh kosong',
    },
  },
} as const;

/**
 * Helper function to check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Helper function to check if string matches pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Helper function to check if value is one of allowed values
 */
export function isOneOf<T>(value: T, allowedValues: readonly T[]): boolean {
  return allowedValues.includes(value);
}
