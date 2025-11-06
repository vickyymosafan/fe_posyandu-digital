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
 * Klasifikasi BMI berdasarkan standar Asia Pasifik (WHO Asia-Pacific)
 * Tidak throw error, return null jika input invalid
 * 
 * SINKRONISASI DENGAN BACKEND: Menggunakan threshold yang sama dengan backend
 *
 * @param bmi - Body Mass Index
 * @returns Kategori BMI atau null jika invalid
 *
 * Kategori BMI Asia Pasifik (WHO):
 * - < 17.0: Berat Badan Sangat Kurang
 * - 17.0 - 18.4: Berat Badan Kurang
 * - 18.5 - 22.9: Normal
 * - 23.0 - 24.9: Kelebihan Berat Badan
 * - 25.0 - 29.9: Obesitas I
 * - 30.0 - 34.9: Obesitas II
 * - ≥ 35.0: Obesitas III
 *
 * @example
 * const kategori = klasifikasiBMISafe(24.22);
 * // Output: "Kelebihan Berat Badan"
 */
export function klasifikasiBMISafe(bmi: number | null): string | null {
  if (bmi === null || typeof bmi !== 'number' || isNaN(bmi) || bmi <= 0) {
    return null;
  }

  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi < 23.0) return 'Normal';
  if (bmi < 25.0) return 'Kelebihan Berat Badan';
  if (bmi < 30.0) return 'Obesitas I';
  if (bmi < 35.0) return 'Obesitas II';
  return 'Obesitas III';
}

/**
 * Klasifikasi BMI berdasarkan standar Asia Pasifik (WHO Asia-Pacific)
 * FAIL FAST: Validate input immediately dan throw error jika invalid
 * 
 * SINKRONISASI DENGAN BACKEND: Menggunakan threshold yang sama dengan backend
 *
 * @param bmi - Body Mass Index
 * @returns Kategori BMI
 * @throws Error if BMI is invalid
 *
 * Kategori BMI Asia Pasifik (WHO):
 * - < 17.0: Berat Badan Sangat Kurang
 * - 17.0 - 18.4: Berat Badan Kurang
 * - 18.5 - 22.9: Normal
 * - 23.0 - 24.9: Kelebihan Berat Badan
 * - 25.0 - 29.9: Obesitas I
 * - 30.0 - 34.9: Obesitas II
 * - ≥ 35.0: Obesitas III
 *
 * @example
 * const kategori = klasifikasiBMI(24.22);
 * // Output: "Kelebihan Berat Badan"
 */
export function klasifikasiBMI(bmi: number): string {
  // FAIL FAST: Validate input
  assertValidNumber(bmi, 'BMI');
  assertInRange(bmi, 5, 100, 'BMI');

  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi < 23.0) return 'Normal';
  if (bmi < 25.0) return 'Kelebihan Berat Badan';
  if (bmi < 30.0) return 'Obesitas I';
  if (bmi < 35.0) return 'Obesitas II';
  return 'Obesitas III';
}
