/**
 * BMI (Body Mass Index) Utility
 *
 * File ini berisi fungsi untuk menghitung dan mengklasifikasikan BMI.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle BMI calculation dan classification
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada invalid input (untuk submit)
 * - Graceful: Fungsi safe untuk real-time calculation tanpa throw error
 */

import { assertValidNumber, assertInRange } from './failFast';

/**
 * Hitung BMI berdasarkan berat dan tinggi (safe version untuk real-time calculation)
 * Tidak throw error, return null jika input invalid
 *
 * @param berat - Berat badan dalam kilogram (kg)
 * @param tinggi - Tinggi badan dalam centimeter (cm)
 * @returns BMI (Body Mass Index) atau null jika input invalid
 *
 * @example
 * const bmi = hitungBMISafe(70, 170);
 * // Output: 24.22
 */
export function hitungBMISafe(berat: number, tinggi: number): number | null {
  // Validasi basic tanpa throw error
  if (
    typeof berat !== 'number' ||
    typeof tinggi !== 'number' ||
    isNaN(berat) ||
    isNaN(tinggi) ||
    berat <= 0 ||
    tinggi <= 0
  ) {
    return null;
  }

  // Konversi tinggi dari cm ke meter
  const tinggiMeter = tinggi / 100;

  // Hitung BMI dengan rumus: berat / (tinggi^2)
  const bmi = berat / (tinggiMeter * tinggiMeter);

  // Round ke 2 desimal
  return Math.round(bmi * 100) / 100;
}

/**
 * Hitung BMI berdasarkan berat dan tinggi (strict version untuk validation)
 * FAIL FAST: Validate input immediately dan throw error jika invalid
 *
 * @param berat - Berat badan dalam kilogram (kg)
 * @param tinggi - Tinggi badan dalam centimeter (cm)
 * @returns BMI (Body Mass Index)
 * @throws Error if input is invalid
 *
 * @example
 * const bmi = hitungBMI(70, 170);
 * // Output: 24.22
 */
export function hitungBMI(berat: number, tinggi: number): number {
  // FAIL FAST: Validate input
  assertValidNumber(berat, 'Berat badan');
  assertValidNumber(tinggi, 'Tinggi badan');
  assertInRange(berat, 20, 300, 'Berat badan');
  assertInRange(tinggi, 50, 250, 'Tinggi badan');

  // Konversi tinggi dari cm ke meter
  const tinggiMeter = tinggi / 100;

  // Hitung BMI dengan rumus: berat / (tinggi^2)
  const bmi = berat / (tinggiMeter * tinggiMeter);

  // Round ke 2 desimal
  return Math.round(bmi * 100) / 100;
}

/**
 * Klasifikasi BMI berdasarkan standar Asia Pasifik (safe version)
 * Tidak throw error, return null jika input invalid
 *
 * @param bmi - Body Mass Index
 * @returns Kategori BMI atau null jika invalid
 *
 * Kategori:
 * - < 17.0: Berat Badan Sangat Kurang
 * - 17.0-18.4: Berat Badan Kurang
 * - 18.5-25.0: Berat Badan Normal
 * - 25.1-27.0: Kelebihan Berat Badan (Overweight)
 * - 27.1-30.0: Obesitas Tingkat I
 * - ≥ 30.0: Obesitas Tingkat II
 *
 * @example
 * const kategori = klasifikasiBMISafe(24.22);
 * // Output: "Berat Badan Normal"
 */
export function klasifikasiBMISafe(bmi: number | null): string | null {
  if (bmi === null || typeof bmi !== 'number' || isNaN(bmi) || bmi <= 0) {
    return null;
  }

  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi <= 25.0) return 'Berat Badan Normal';
  if (bmi <= 27.0) return 'Kelebihan Berat Badan (Overweight)';
  if (bmi <= 30.0) return 'Obesitas Tingkat I';
  return 'Obesitas Tingkat II';
}

/**
 * Klasifikasi BMI berdasarkan standar Asia Pasifik (strict version)
 * FAIL FAST: Validate input immediately dan throw error jika invalid
 *
 * @param bmi - Body Mass Index
 * @returns Kategori BMI
 * @throws Error if BMI is invalid
 *
 * Kategori:
 * - < 17.0: Berat Badan Sangat Kurang
 * - 17.0-18.4: Berat Badan Kurang
 * - 18.5-25.0: Berat Badan Normal
 * - 25.1-27.0: Kelebihan Berat Badan (Overweight)
 * - 27.1-30.0: Obesitas Tingkat I
 * - ≥ 30.0: Obesitas Tingkat II
 *
 * @example
 * const kategori = klasifikasiBMI(24.22);
 * // Output: "Berat Badan Normal"
 */
export function klasifikasiBMI(bmi: number): string {
  // FAIL FAST: Validate input
  assertValidNumber(bmi, 'BMI');
  assertInRange(bmi, 5, 100, 'BMI');

  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi <= 25.0) return 'Berat Badan Normal';
  if (bmi <= 27.0) return 'Kelebihan Berat Badan (Overweight)';
  if (bmi <= 30.0) return 'Obesitas Tingkat I';
  return 'Obesitas Tingkat II';
}
