/**
 * Kolesterol Utility
 *
 * File ini berisi fungsi untuk mengklasifikasikan kolesterol total.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle cholesterol classification
 * - KISS: Implementasi sederhana dan straightforward
 */

/**
 * Klasifikasi kolesterol total
 *
 * @param kolesterol - Kolesterol total dalam mg/dL
 * @returns Kategori kolesterol
 *
 * Kategori:
 * - Normal: <200 mg/dL
 * - Batas Tinggi: 200-239 mg/dL
 * - Tinggi: ≥240 mg/dL
 *
 * @example
 * const kategori = klasifikasiKolesterol(210);
 * // Output: "Batas Tinggi"
 */
export function klasifikasiKolesterol(kolesterol: number): string {
  if (kolesterol < 200) return 'Normal';
  if (kolesterol < 240) return 'Batas Tinggi';
  return 'Tinggi';
}
