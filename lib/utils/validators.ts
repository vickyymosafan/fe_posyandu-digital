/**
 * Validators dengan Zod
 *
 * File ini berisi Zod schemas untuk validasi form.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle form validation
 * - DRY: Reusable schemas with constants
 * - Maintainability: Validation rules defined in one place
 */

import { z } from 'zod';
import { HEALTH_LIMITS, ID_LENGTHS, PASSWORD_REQUIREMENTS } from '@/lib/constants';

/**
 * Schema untuk NIK (16 digit numerik)
 */
export const nikSchema = z
  .string()
  .length(ID_LENGTHS.NIK, `NIK harus ${ID_LENGTHS.NIK} digit`)
  .regex(/^\d+$/, 'NIK harus berisi angka saja');

/**
 * Schema untuk KK (16 digit numerik)
 */
export const kkSchema = z
  .string()
  .length(ID_LENGTHS.KK, `KK harus ${ID_LENGTHS.KK} digit`)
  .regex(/^\d+$/, 'KK harus berisi angka saja');

/**
 * Schema untuk email
 */
export const emailSchema = z.string().email('Format email tidak valid');

/**
 * Schema untuk password
 * Requirements defined in PASSWORD_REQUIREMENTS constant
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_REQUIREMENTS.MIN_LENGTH, `Password minimal ${PASSWORD_REQUIREMENTS.MIN_LENGTH} karakter`)
  .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
  .regex(/\d/, 'Password harus mengandung angka')
  .regex(/[^a-zA-Z0-9]/, 'Password harus mengandung simbol');

/**
 * Schema untuk nama (tidak boleh kosong)
 */
export const namaSchema = z.string().min(1, 'Nama tidak boleh kosong');

/**
 * Schema untuk alamat (tidak boleh kosong)
 */
export const alamatSchema = z.string().min(1, 'Alamat tidak boleh kosong');

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
 */
export const genderSchema = z.enum(['L', 'P'], {
  message: 'Jenis kelamin harus L atau P',
});

/**
 * Schema untuk tinggi badan (cm)
 * Limits defined in HEALTH_LIMITS constant
 */
export const tinggiSchema = z
  .number()
  .min(HEALTH_LIMITS.HEIGHT.MIN, `Tinggi badan minimal ${HEALTH_LIMITS.HEIGHT.MIN} ${HEALTH_LIMITS.HEIGHT.UNIT}`)
  .max(HEALTH_LIMITS.HEIGHT.MAX, `Tinggi badan maksimal ${HEALTH_LIMITS.HEIGHT.MAX} ${HEALTH_LIMITS.HEIGHT.UNIT}`);

/**
 * Schema untuk berat badan (kg)
 * Limits defined in HEALTH_LIMITS constant
 */
export const beratSchema = z
  .number()
  .min(HEALTH_LIMITS.WEIGHT.MIN, `Berat badan minimal ${HEALTH_LIMITS.WEIGHT.MIN} ${HEALTH_LIMITS.WEIGHT.UNIT}`)
  .max(HEALTH_LIMITS.WEIGHT.MAX, `Berat badan maksimal ${HEALTH_LIMITS.WEIGHT.MAX} ${HEALTH_LIMITS.WEIGHT.UNIT}`);

/**
 * Schema untuk tekanan darah sistolik (mmHg)
 * Limits defined in HEALTH_LIMITS constant
 */
export const sistolikSchema = z
  .number()
  .min(HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MIN, `Tekanan darah sistolik minimal ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MIN} ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.UNIT}`)
  .max(HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MAX, `Tekanan darah sistolik maksimal ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.MAX} ${HEALTH_LIMITS.BLOOD_PRESSURE_SYSTOLIC.UNIT}`);

/**
 * Schema untuk tekanan darah diastolik (mmHg)
 * Limits defined in HEALTH_LIMITS constant
 */
export const diastolikSchema = z
  .number()
  .min(HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MIN, `Tekanan darah diastolik minimal ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MIN} ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.UNIT}`)
  .max(HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MAX, `Tekanan darah diastolik maksimal ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.MAX} ${HEALTH_LIMITS.BLOOD_PRESSURE_DIASTOLIC.UNIT}`);

/**
 * Schema untuk gula darah (mg/dL)
 * Limits defined in HEALTH_LIMITS constant
 */
export const gulaDarahSchema = z
  .number()
  .min(HEALTH_LIMITS.BLOOD_GLUCOSE.MIN, `Gula darah minimal ${HEALTH_LIMITS.BLOOD_GLUCOSE.MIN} ${HEALTH_LIMITS.BLOOD_GLUCOSE.UNIT}`)
  .max(HEALTH_LIMITS.BLOOD_GLUCOSE.MAX, `Gula darah maksimal ${HEALTH_LIMITS.BLOOD_GLUCOSE.MAX} ${HEALTH_LIMITS.BLOOD_GLUCOSE.UNIT}`)
  .optional();

/**
 * Schema untuk kolesterol (mg/dL)
 * Limits defined in HEALTH_LIMITS constant
 */
export const kolesterolSchema = z
  .number()
  .min(HEALTH_LIMITS.CHOLESTEROL.MIN, `Kolesterol minimal ${HEALTH_LIMITS.CHOLESTEROL.MIN} ${HEALTH_LIMITS.CHOLESTEROL.UNIT}`)
  .max(HEALTH_LIMITS.CHOLESTEROL.MAX, `Kolesterol maksimal ${HEALTH_LIMITS.CHOLESTEROL.MAX} ${HEALTH_LIMITS.CHOLESTEROL.UNIT}`)
  .optional();

/**
 * Schema untuk asam urat (mg/dL)
 * Limits defined in HEALTH_LIMITS constant
 */
export const asamUratSchema = z
  .number()
  .min(HEALTH_LIMITS.URIC_ACID.MIN, `Asam urat minimal ${HEALTH_LIMITS.URIC_ACID.MIN} ${HEALTH_LIMITS.URIC_ACID.UNIT}`)
  .max(HEALTH_LIMITS.URIC_ACID.MAX, `Asam urat maksimal ${HEALTH_LIMITS.URIC_ACID.MAX} ${HEALTH_LIMITS.URIC_ACID.UNIT}`)
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
