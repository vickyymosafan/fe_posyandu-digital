/**
 * Asam Urat (Uric Acid) Classification Utility
 * 
 * Klasifikasi berbeda untuk laki-laki dan perempuan
 */

/**
 * Klasifikasi Asam Urat berdasarkan gender
 * 
 * Laki-laki: Rendah < 3.4, Normal 3.4-7.0, Tinggi > 7.0
 * Perempuan: Rendah < 2.4, Normal 2.4-6.0, Tinggi > 6.0
 */
export function klasifikasiAsamUrat(nilai: number, gender: 'L' | 'P'): string | null {
  if (!nilai || nilai <= 0) {
    return null;
  }

  if (gender === 'L') {
    if (nilai < 3.4) return 'Rendah';
    if (nilai >= 3.4 && nilai <= 7.0) return 'Normal';
    return 'Tinggi';
  }

  // Perempuan
  if (nilai < 2.4) return 'Rendah';
  if (nilai >= 2.4 && nilai <= 6.0) return 'Normal';
  return 'Tinggi';
}
