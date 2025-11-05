/**
 * Tekanan Darah Utility
 *
 * File ini berisi fungsi untuk mengklasifikasikan tekanan darah
 * berdasarkan standar AHA (American Heart Association).
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle blood pressure classification
 * - KISS: Implementasi sederhana dan straightforward
 */

/**
 * Interface untuk hasil klasifikasi tekanan darah
 */
export interface TekananDarahResult {
  kategori: string;
  emergency: boolean;
}

/**
 * Klasifikasi tekanan darah berdasarkan standar AHA
 *
 * @param sistolik - Tekanan darah sistolik (mmHg)
 * @param diastolik - Tekanan darah diastolik (mmHg)
 * @returns Hasil klasifikasi dengan kategori dan status emergency
 *
 * Kategori:
 * - Normal: <120/<80
 * - Batas Waspada: 120-129/<80
 * - Hipertensi Tahap 1: 130-139/80-89
 * - Hipertensi Tahap 2: ≥140/≥90
 * - Krisis Hipertensi: >180/>120 (EMERGENCY)
 *
 * @example
 * const hasil = klasifikasiTekananDarah(120, 80);
 * // Output: { kategori: "Batas Waspada", emergency: false }
 */
export function klasifikasiTekananDarah(
  sistolik: number,
  diastolik: number
): TekananDarahResult {
  // Krisis Hipertensi - EMERGENCY
  if (sistolik > 180 || diastolik > 120) {
    return { kategori: 'Krisis Hipertensi', emergency: true };
  }

  // Hipertensi Tahap 2
  if (sistolik >= 140 || diastolik >= 90) {
    return { kategori: 'Hipertensi Tahap 2', emergency: false };
  }

  // Hipertensi Tahap 1
  if (sistolik >= 130 || diastolik >= 80) {
    return { kategori: 'Hipertensi Tahap 1', emergency: false };
  }

  // Batas Waspada
  if (sistolik >= 120 && diastolik < 80) {
    return { kategori: 'Batas Waspada', emergency: false };
  }

  // Normal
  return { kategori: 'Normal', emergency: false };
}
