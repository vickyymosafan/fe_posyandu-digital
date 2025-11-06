/**
 * BMI (Body Mass Index) Utility
 *
 * File ini berisi fungsi untuk menghitung dan mengklasifikasikan BMI.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle BMI calculation dan classification
 * - KISS: Implementasi sederhana dan straightforward
 * - Fail Fast: Validate input immediately dan throw pada invalid input
 */

import { assertValidNumber, assertInRange } from './failFast';

/**
 * Hitung BMI berdasarkan berat dan tinggi
 * FAIL FAST: Validate input immediately
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
 * Klasifikasi BMI berdasarkan standar Asia Pasifik
 * FAIL FAST: Validate input immediately
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
