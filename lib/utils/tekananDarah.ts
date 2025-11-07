/**
 * Tekanan Darah (Blood Pressure) Classification Utility
 * 
 * Klasifikasi berdasarkan AHA (American Heart Association) guidelines
 */

export interface TekananDarahResult {
  kategori: string;
  emergency: boolean;
}

/**
 * Klasifikasi tekanan darah berdasarkan AHA guidelines
 */
export function klasifikasiTekananDarah(
  sistolik: number,
  diastolik: number
): TekananDarahResult | null {
  if (!sistolik || !diastolik || sistolik <= 0 || diastolik <= 0) {
    return null;
  }

  // Krisis Hipertensi (Emergency)
  if (sistolik >= 180 || diastolik >= 120) {
    return {
      kategori: 'Krisis Hipertensi',
      emergency: true,
    };
  }

  // Hipertensi Stage 2
  if (sistolik >= 140 || diastolik >= 90) {
    return {
      kategori: 'Hipertensi Stage 2',
      emergency: false,
    };
  }

  // Hipertensi Stage 1
  if (sistolik >= 130 || diastolik >= 80) {
    return {
      kategori: 'Hipertensi Stage 1',
      emergency: false,
    };
  }

  // Elevated (Meningkat)
  if (sistolik >= 120 && diastolik < 80) {
    return {
      kategori: 'Meningkat',
      emergency: false,
    };
  }

  // Normal
  return {
    kategori: 'Normal',
    emergency: false,
  };
}
