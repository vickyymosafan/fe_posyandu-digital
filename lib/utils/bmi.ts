/**
 * Utility untuk kalkulasi dan klasifikasi Body Mass Index (BMI)
 * 
 * Menggunakan standar klasifikasi BMI Asia Pasifik (WHO Asia-Pacific - Revised)
 */

export interface BMIResult {
  nilai: number;
  kategori: string;
}

const BMI_THRESHOLD = {
  SANGAT_KURANG: 17.0,
  KURANG: 18.5,
  NORMAL: 25.1,
  BERLEBIH: 27.1,
  OBESITAS_I: 30.1,
} as const;

const KATEGORI_BMI = {
  SANGAT_KURANG: 'Sangat Kurang',
  KURANG: 'Kurang',
  NORMAL: 'Normal',
  BERLEBIH: 'Berlebih',
  OBESITAS_I: 'Obesitas I',
  OBESITAS_II: 'Obesitas II',
} as const;

/**
 * Klasifikasi nilai BMI berdasarkan standar Asia Pasifik
 */
function klasifikasiBMI(bmi: number): string {
  if (bmi < BMI_THRESHOLD.SANGAT_KURANG) {
    return KATEGORI_BMI.SANGAT_KURANG;
  }
  if (bmi < BMI_THRESHOLD.KURANG) {
    return KATEGORI_BMI.KURANG;
  }
  if (bmi < BMI_THRESHOLD.NORMAL) {
    return KATEGORI_BMI.NORMAL;
  }
  if (bmi < BMI_THRESHOLD.BERLEBIH) {
    return KATEGORI_BMI.BERLEBIH;
  }
  if (bmi < BMI_THRESHOLD.OBESITAS_I) {
    return KATEGORI_BMI.OBESITAS_I;
  }
  return KATEGORI_BMI.OBESITAS_II;
}

/**
 * Menghitung BMI dan mengklasifikasikannya
 */
export function hitungBMI(beratKg: number, tinggiCm: number): BMIResult | null {
  if (!beratKg || !tinggiCm || beratKg <= 0 || tinggiCm <= 0) {
    return null;
  }

  const tinggiM = tinggiCm / 100;
  const bmi = beratKg / (tinggiM * tinggiM);
  const nilaiBMI = Math.round(bmi * 100) / 100;
  const kategori = klasifikasiBMI(nilaiBMI);

  return {
    nilai: nilaiBMI,
    kategori,
  };
}
