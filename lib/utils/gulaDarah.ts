/**
 * Gula Darah Utility
 *
 * File ini berisi fungsi untuk mengklasifikasikan gula darah
 * (GDP, GDS, 2JPP).
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle blood sugar classification
 * - KISS: Implementasi sederhana dan straightforward
 */

/**
 * Interface untuk hasil klasifikasi gula darah
 */
export interface KlasifikasiGulaDarah {
  gdp?: string;
  gds?: string;
  duaJpp?: string;
}

/**
 * Klasifikasi gula darah (GDP, GDS, 2JPP)
 *
 * @param gulaPuasa - Gula Darah Puasa (GDP) dalam mg/dL (optional)
 * @param gulaSewaktu - Gula Darah Sewaktu (GDS) dalam mg/dL (optional)
 * @param gula2Jpp - Gula Darah 2 Jam Post Prandial dalam mg/dL (optional)
 * @returns Hasil klasifikasi untuk setiap jenis gula darah
 *
 * Kategori GDP:
 * - Normal: <100 mg/dL
 * - Pra-Diabetes: 100-125 mg/dL
 * - Diabetes: ≥126 mg/dL
 *
 * Kategori GDS:
 * - Normal: <200 mg/dL
 * - Diabetes: ≥200 mg/dL
 *
 * Kategori 2JPP:
 * - Normal: <140 mg/dL
 * - Pra-Diabetes: 140-199 mg/dL
 * - Diabetes: ≥200 mg/dL
 *
 * @example
 * const hasil = klasifikasiGulaDarah(110, 180, 150);
 * // Output: { gdp: "Pra-Diabetes", gds: "Normal", duaJpp: "Pra-Diabetes" }
 */
export function klasifikasiGulaDarah(
  gulaPuasa?: number,
  gulaSewaktu?: number,
  gula2Jpp?: number
): KlasifikasiGulaDarah {
  const result: KlasifikasiGulaDarah = {};

  // Klasifikasi Gula Darah Puasa (GDP)
  if (gulaPuasa !== undefined) {
    if (gulaPuasa < 100) {
      result.gdp = 'Normal';
    } else if (gulaPuasa < 126) {
      result.gdp = 'Pra-Diabetes';
    } else {
      result.gdp = 'Diabetes';
    }
  }

  // Klasifikasi Gula Darah Sewaktu (GDS)
  if (gulaSewaktu !== undefined) {
    if (gulaSewaktu < 200) {
      result.gds = 'Normal';
    } else {
      result.gds = 'Diabetes';
    }
  }

  // Klasifikasi Gula Darah 2 Jam Post Prandial (2JPP)
  if (gula2Jpp !== undefined) {
    if (gula2Jpp < 140) {
      result.duaJpp = 'Normal';
    } else if (gula2Jpp < 200) {
      result.duaJpp = 'Pra-Diabetes';
    } else {
      result.duaJpp = 'Diabetes';
    }
  }

  return result;
}
