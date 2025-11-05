/**
 * Asam Urat Utility
 *
 * File ini berisi fungsi untuk mengklasifikasikan asam urat
 * berdasarkan jenis kelamin.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle uric acid classification
 * - KISS: Implementasi sederhana dan straightforward
 */

import type { Gender } from '@/types';

/**
 * Klasifikasi asam urat berdasarkan jenis kelamin
 *
 * @param asamUrat - Asam urat dalam mg/dL
 * @param gender - Jenis kelamin ('L' untuk Laki-laki, 'P' untuk Perempuan)
 * @returns Kategori asam urat
 *
 * Kategori Laki-laki:
 * - Rendah: <3.4 mg/dL
 * - Normal: 3.4-7.0 mg/dL
 * - Tinggi: >7.0 mg/dL
 *
 * Kategori Perempuan:
 * - Rendah: <2.4 mg/dL
 * - Normal: 2.4-6.0 mg/dL
 * - Tinggi: >6.0 mg/dL
 *
 * @example
 * const kategori = klasifikasiAsamUrat(6.5, 'L');
 * // Output: "Normal"
 */
export function klasifikasiAsamUrat(asamUrat: number, gender: Gender): string {
  if (gender === 'L') {
    // Laki-laki
    if (asamUrat < 3.4) return 'Rendah';
    if (asamUrat <= 7.0) return 'Normal';
    return 'Tinggi';
  } else {
    // Perempuan
    if (asamUrat < 2.4) return 'Rendah';
    if (asamUrat <= 6.0) return 'Normal';
    return 'Tinggi';
  }
}
