/**
 * Kolesterol (Cholesterol) Classification Utility
 * 
 * Klasifikasi kolesterol total berdasarkan standar medis
 */

/**
 * Klasifikasi Kolesterol Total
 * 
 * Normal: < 200 mg/dL
 * Batas Tinggi: 200-239 mg/dL
 * Tinggi: ≥ 240 mg/dL
 */
export function klasifikasiKolesterol(nilai: number): string | null {
  if (!nilai || nilai <= 0) {
    return null;
  }

  if (nilai < 200) return 'Normal';
  if (nilai >= 200 && nilai <= 239) return 'Batas Tinggi';
  return 'Tinggi';
}
