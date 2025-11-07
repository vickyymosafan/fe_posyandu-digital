/**
 * Validators dengan Zod
 *
 * File ini berisi Zod schemas untuk validasi form.
 *
 * SSOT Principle:
 * - All validation rules imported from ValidationRules (SSOT)
 * - No duplication of validation logic
 * - Zod schemas are adapters that use domain validation rules
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle form validation
 * - DRY: Reusable schemas with constants
 * - SSOT: Single source of truth for validation rules
 */

import { z } from 'zod';
import { ValidationRules } from '@/lib/domain/validation/ValidationRules';

/**
 * Schema untuk NIK (16 digit numerik)
 * Uses ValidationRules as SSOT
 */
export const nikSchema = z
  .string()
  .length(ValidationRules.NIK.LENGTH, ValidationRules.NIK.ERROR_MESSAGES.INVALID_LENGTH)
  .regex(ValidationRules.NIK.PATTERN, ValidationRules.NIK.ERROR_MESSAGES.INVALID_FORMAT);

/**
 * Schema untuk KK (16 digit numerik)
 * Uses ValidationRules as SSOT
 */
export const kkSchema = z
  .string()
  .length(ValidationRules.KK.LENGTH, ValidationRules.KK.ERROR_MESSAGES.INVALID_LENGTH)
  .regex(ValidationRules.KK.PATTERN, ValidationRules.KK.ERROR_MESSAGES.INVALID_FORMAT);

/**
 * Schema untuk email
 * Uses ValidationRules as SSOT
 */
export const emailSchema = z.string().email(ValidationRules.EMAIL.ERROR_MESSAGES.INVALID);

/**
 * Schema untuk password
 * Uses ValidationRules as SSOT
 */
export const passwordSchema = z
  .string()
  .min(
    ValidationRules.PASSWORD.MIN_LENGTH,
    ValidationRules.PASSWORD.ERROR_MESSAGES.TOO_SHORT
  )
  .regex(ValidationRules.PASSWORD.PATTERNS.LETTER, ValidationRules.PASSWORD.ERROR_MESSAGES.NO_LETTER)
  .regex(ValidationRules.PASSWORD.PATTERNS.NUMBER, ValidationRules.PASSWORD.ERROR_MESSAGES.NO_NUMBER)
  .regex(ValidationRules.PASSWORD.PATTERNS.SYMBOL, ValidationRules.PASSWORD.ERROR_MESSAGES.NO_SYMBOL);

/**
 * Schema untuk nama (tidak boleh kosong)
 * Uses ValidationRules as SSOT
 */
export const namaSchema = z
  .string()
  .min(ValidationRules.NAME.MIN_LENGTH, ValidationRules.NAME.ERROR_MESSAGES.REQUIRED);

/**
 * Schema untuk alamat (tidak boleh kosong)
 * Uses ValidationRules as SSOT
 */
export const alamatSchema = z
  .string()
  .min(ValidationRules.ADDRESS.MIN_LENGTH, ValidationRules.ADDRESS.ERROR_MESSAGES.REQUIRED);

/**
 * Schema untuk tanggal lahir
 */
export const tanggalLahirSchema = z.string().refine(
  (date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },
  { message: 'Format tanggal tidak valid' }
);

/**
 * Schema untuk jenis kelamin
 * Uses ValidationRules as SSOT
 */
export const genderSchema = z.enum(ValidationRules.GENDER.ALLOWED_VALUES, {
  message: ValidationRules.GENDER.ERROR_MESSAGES.INVALID,
});

/**
 * Schema untuk tinggi badan (cm)
 * Uses ValidationRules as SSOT
 */
export const tinggiSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.HEIGHT.MIN,
    ValidationRules.HEALTH.HEIGHT.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.HEIGHT.MAX,
    ValidationRules.HEALTH.HEIGHT.ERROR_MESSAGES.OUT_OF_RANGE
  );

/**
 * Schema untuk berat badan (kg)
 * Uses ValidationRules as SSOT
 */
export const beratSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.WEIGHT.MIN,
    ValidationRules.HEALTH.WEIGHT.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.WEIGHT.MAX,
    ValidationRules.HEALTH.WEIGHT.ERROR_MESSAGES.OUT_OF_RANGE
  );

/**
 * Schema untuk tekanan darah sistolik (mmHg)
 * Uses ValidationRules as SSOT
 */
export const sistolikSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.BLOOD_PRESSURE_SYSTOLIC.MIN,
    ValidationRules.HEALTH.BLOOD_PRESSURE_SYSTOLIC.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.BLOOD_PRESSURE_SYSTOLIC.MAX,
    ValidationRules.HEALTH.BLOOD_PRESSURE_SYSTOLIC.ERROR_MESSAGES.OUT_OF_RANGE
  );

/**
 * Schema untuk tekanan darah diastolik (mmHg)
 * Uses ValidationRules as SSOT
 */
export const diastolikSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.BLOOD_PRESSURE_DIASTOLIC.MIN,
    ValidationRules.HEALTH.BLOOD_PRESSURE_DIASTOLIC.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.BLOOD_PRESSURE_DIASTOLIC.MAX,
    ValidationRules.HEALTH.BLOOD_PRESSURE_DIASTOLIC.ERROR_MESSAGES.OUT_OF_RANGE
  );

/**
 * Schema untuk gula darah (mg/dL)
 * Uses ValidationRules as SSOT
 */
export const gulaDarahSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.BLOOD_GLUCOSE.MIN,
    ValidationRules.HEALTH.BLOOD_GLUCOSE.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.BLOOD_GLUCOSE.MAX,
    ValidationRules.HEALTH.BLOOD_GLUCOSE.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .optional();

/**
 * Schema untuk kolesterol (mg/dL)
 * Uses ValidationRules as SSOT
 */
export const kolesterolSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.CHOLESTEROL.MIN,
    ValidationRules.HEALTH.CHOLESTEROL.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.CHOLESTEROL.MAX,
    ValidationRules.HEALTH.CHOLESTEROL.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .optional();

/**
 * Schema untuk asam urat (mg/dL)
 * Uses ValidationRules as SSOT
 */
export const asamUratSchema = z
  .number()
  .min(
    ValidationRules.HEALTH.URIC_ACID.MIN,
    ValidationRules.HEALTH.URIC_ACID.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .max(
    ValidationRules.HEALTH.URIC_ACID.MAX,
    ValidationRules.HEALTH.URIC_ACID.ERROR_MESSAGES.OUT_OF_RANGE
  )
  .optional();

/**
 * Schema untuk form pendaftaran lansia
 */
export const lansiaFormSchema = z.object({
  nik: nikSchema,
  kk: kkSchema,
  nama: namaSchema,
  tanggalLahir: tanggalLahirSchema,
  gender: genderSchema,
  alamat: alamatSchema,
});

/**
 * Schema untuk form pemeriksaan fisik
 */
export const pemeriksaanFisikSchema = z.object({
  tinggi: tinggiSchema,
  berat: beratSchema,
  sistolik: sistolikSchema,
  diastolik: diastolikSchema,
});

/**
 * Schema untuk form pemeriksaan kesehatan
 */
export const pemeriksaanKesehatanSchema = z.object({
  asamUrat: asamUratSchema,
  gulaPuasa: gulaDarahSchema,
  gulaSewaktu: gulaDarahSchema,
  gula2Jpp: gulaDarahSchema,
  kolesterol: kolesterolSchema,
});

/**
 * Schema untuk form tambah petugas
 */
export const petugasFormSchema = z.object({
  nama: namaSchema,
  email: emailSchema,
  kataSandi: passwordSchema,
});

/**
 * Schema untuk form ubah nama
 */
export const updateNamaSchema = z.object({
  nama: namaSchema,
});

/**
 * Schema untuk form ubah password
 */
export const updatePasswordSchema = z.object({
  kataSandiLama: z.string().min(1, 'Password lama tidak boleh kosong'),
  kataSandiBaru: passwordSchema,
});

/**
 * Schema untuk form login
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password tidak boleh kosong'),
});
