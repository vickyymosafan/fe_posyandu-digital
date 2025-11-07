/**
 * Gula Darah (Blood Sugar) Classification Utility
 * 
 * Klasifikasi untuk GDP, GDS, dan 2JPP
 */

export interface KlasifikasiGulaDarah {
  gdp?: string;
  gds?: string;
  duaJpp?: string;
}

/**
 * Klasifikasi Gula Darah Puasa (GDP)
 * 
 * Normal: < 100 mg/dL
 * Pra-Diabetes: 100-125 mg/dL
 * Diabetes: ≥ 126 mg/dL
 */
export function klasifikasiGDP(nilai: number): string | null {
  if (!nilai || nilai <= 0) {
    return null;
  }

  if (nilai < 100) return 'Normal';
  if (nilai >= 100 && nilai <= 125) return 'Pra-Diabetes';
  return 'Diabetes';
}

/**
 * Klasifikasi Gula Darah Sewaktu (GDS)
 * 
 * Normal: < 200 mg/dL
 * Diabetes: ≥ 200 mg/dL
 */
export function klasifikasiGDS(nilai: number): string | null {
  if (!nilai || nilai <= 0) {
    return null;
  }

  if (nilai < 200) return 'Normal';
  return 'Diabetes';
}

/**
 * Klasifikasi Gula Darah 2 Jam Post Prandial (2JPP)
 * 
 * Normal: < 140 mg/dL
 * Pra-Diabetes: 140-199 mg/dL
 * Diabetes: ≥ 200 mg/dL
 */
export function klasifikasiDuaJPP(nilai: number): string | null {
  if (!nilai || nilai <= 0) {
    return null;
  }

  if (nilai < 140) return 'Normal';
  if (nilai >= 140 && nilai <= 199) return 'Pra-Diabetes';
  return 'Diabetes';
}
