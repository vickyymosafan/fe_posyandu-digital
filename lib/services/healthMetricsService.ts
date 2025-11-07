/**
 * Health Metrics Service
 *
 * Business logic layer for health metric calculations and classifications.
 * Follows KISS principle - simple, focused functions without duplication.
 *
 * Responsibilities:
 * - Calculate health metrics (BMI, etc.)
 * - Classify health values
 * - Aggregate multiple classifications
 *
 * Note: This service works with numbers only. Use parseNumber() utility
 * to convert string inputs before calling these functions.
 */

import { hitungBMISafe, klasifikasiBMISafe } from '@/lib/utils/bmi';
import { klasifikasiTekananDarahSafe } from '@/lib/utils/tekananDarah';
import { klasifikasiGulaDarah } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';
import { parseNumber } from '@/lib/utils/numberParser';
import type { Gender } from '@/types';

// ============================================
// Types
// ============================================

/**
 * BMI calculation result
 */
export interface BMIResult {
  nilai: number | null;
  kategori: string | null;
}

/**
 * Blood pressure classification result
 */
export interface TekananDarahResult {
  kategori: string | null;
  emergency: boolean;
}

/**
 * Blood glucose classification result
 */
export interface KlasifikasiGulaDarah {
  gdp?: string;
  gds?: string;
  duaJpp?: string;
}

/**
 * Complete health metrics result
 */
export interface HealthMetricsResult {
  bmi: BMIResult;
  tekananDarah: TekananDarahResult;
  gulaDarah: KlasifikasiGulaDarah;
  kolesterol: string | null;
  asamUrat: string | null;
}

// ============================================
// BMI Service
// ============================================

/**
 * Calculate and classify BMI
 *
 * @param berat - Weight in kg (or undefined)
 * @param tinggi - Height in cm (or undefined)
 * @returns BMI value and category
 */
export function calculateBMI(
  berat: number | undefined,
  tinggi: number | undefined
): BMIResult {
  if (!berat || !tinggi) {
    return { nilai: null, kategori: null };
  }

  const bmi = hitungBMISafe(berat, tinggi);
  const kategori = klasifikasiBMISafe(bmi);

  return { nilai: bmi, kategori };
}

// ============================================
// Blood Pressure Service
// ============================================

/**
 * Classify blood pressure
 *
 * @param sistolik - Systolic pressure in mmHg (or undefined)
 * @param diastolik - Diastolic pressure in mmHg (or undefined)
 * @returns Classification result
 */
export function classifyBloodPressure(
  sistolik: number | undefined,
  diastolik: number | undefined
): TekananDarahResult {
  if (!sistolik || !diastolik) {
    return { kategori: null, emergency: false };
  }

  const result = klasifikasiTekananDarahSafe(sistolik, diastolik);
  return result || { kategori: null, emergency: false };
}

// ============================================
// Blood Glucose Service
// ============================================

/**
 * Classify blood glucose values
 *
 * @param gulaPuasa - Fasting glucose (optional)
 * @param gulaSewaktu - Random glucose (optional)
 * @param gula2Jpp - 2-hour postprandial glucose (optional)
 * @returns Classification for each type
 */
export function classifyBloodGlucose(
  gulaPuasa?: number,
  gulaSewaktu?: number,
  gula2Jpp?: number
): KlasifikasiGulaDarah {
  return klasifikasiGulaDarah(gulaPuasa, gulaSewaktu, gula2Jpp);
}

// ============================================
// Cholesterol Service
// ============================================

/**
 * Classify cholesterol
 *
 * @param kolesterol - Cholesterol value in mg/dL (or undefined)
 * @returns Classification or null if invalid
 */
export function classifyCholesterol(kolesterol: number | undefined): string | null {
  if (!kolesterol) return null;
  return klasifikasiKolesterol(kolesterol);
}

// ============================================
// Uric Acid Service
// ============================================

/**
 * Classify uric acid based on gender
 *
 * @param asamUrat - Uric acid value in mg/dL (or undefined)
 * @param gender - Gender ('L' or 'P')
 * @returns Classification or null if invalid
 */
export function classifyUricAcid(
  asamUrat: number | undefined,
  gender: Gender
): string | null {
  if (!asamUrat) return null;
  return klasifikasiAsamUrat(asamUrat, gender);
}

// ============================================
// Aggregate Service
// ============================================

/**
 * Calculate and classify all health metrics at once
 * 
 * Note: Pass string values directly - they will be parsed automatically
 *
 * @param data - Health metric values as strings
 * @param gender - Gender for uric acid classification
 * @returns Complete health metrics result
 */
export function calculateAllHealthMetrics(
  data: {
    tinggi: string;
    berat: string;
    sistolik: string;
    diastolik: string;
    gulaPuasa?: string;
    gulaSewaktu?: string;
    gula2Jpp?: string;
    kolesterol?: string;
    asamUrat?: string;
  },
  gender: Gender
): HealthMetricsResult {
  // Parse all values once
  const berat = parseNumber(data.berat);
  const tinggi = parseNumber(data.tinggi);
  const sistolik = parseNumber(data.sistolik);
  const diastolik = parseNumber(data.diastolik);
  const gulaPuasa = parseNumber(data.gulaPuasa);
  const gulaSewaktu = parseNumber(data.gulaSewaktu);
  const gula2Jpp = parseNumber(data.gula2Jpp);
  const kolesterol = parseNumber(data.kolesterol);
  const asamUrat = parseNumber(data.asamUrat);

  return {
    bmi: calculateBMI(berat, tinggi),
    tekananDarah: classifyBloodPressure(sistolik, diastolik),
    gulaDarah: classifyBloodGlucose(gulaPuasa, gulaSewaktu, gula2Jpp),
    kolesterol: classifyCholesterol(kolesterol),
    asamUrat: classifyUricAcid(asamUrat, gender),
  };
}
