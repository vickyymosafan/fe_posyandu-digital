/**
 * Validators dengan Zod
 *
 * File ini berisi Zod schemas untuk validasi form.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle form validation
 * - DRY: Reusable schemas
 */

import { z } from 'zod';

/**
 * Schema untuk NIK (16 digit numerik)
 */
export const nikSchema = z
  .string()
  .length(16, 'NIK harus 16 digit')
  .regex(/^\d+$/, 'NIK harus berisi angka saja');

/**
 * Schema untuk KK (16 digit numerik)
 */
export const kkSchema = z
  .string()
  .length(16, 'KK harus 16 digit')
  .regex(/^\d+$/, 'KK harus berisi angka saja');

/**
 * Schema untuk email
 */
export const emailSchema = z.string().email('Format email tidak valid');

/**
 * Schema untuk password
 * Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
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
 */
export const tinggiSchema = z
  .number()
  .min(50, 'Tinggi badan minimal 50 cm')
  .max(250, 'Tinggi badan maksimal 250 cm');

/**
 * Schema untuk berat badan (kg)
 */
export const beratSchema = z
  .number()
  .min(20, 'Berat badan minimal 20 kg')
  .max(300, 'Berat badan maksimal 300 kg');

/**
 * Schema untuk tekanan darah sistolik (mmHg)
 */
export const sistolikSchema = z
  .number()
  .min(50, 'Tekanan darah sistolik minimal 50 mmHg')
  .max(300, 'Tekanan darah sistolik maksimal 300 mmHg');

/**
 * Schema untuk tekanan darah diastolik (mmHg)
 */
export const diastolikSchema = z
  .number()
  .min(30, 'Tekanan darah diastolik minimal 30 mmHg')
  .max(200, 'Tekanan darah diastolik maksimal 200 mmHg');

/**
 * Schema untuk gula darah (mg/dL)
 */
export const gulaDarahSchema = z
  .number()
  .min(20, 'Gula darah minimal 20 mg/dL')
  .max(600, 'Gula darah maksimal 600 mg/dL')
  .optional();

/**
 * Schema untuk kolesterol (mg/dL)
 */
export const kolesterolSchema = z
  .number()
  .min(50, 'Kolesterol minimal 50 mg/dL')
  .max(500, 'Kolesterol maksimal 500 mg/dL')
  .optional();

/**
 * Schema untuk asam urat (mg/dL)
 */
export const asamUratSchema = z
  .number()
  .min(1, 'Asam urat minimal 1 mg/dL')
  .max(20, 'Asam urat maksimal 20 mg/dL')
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
