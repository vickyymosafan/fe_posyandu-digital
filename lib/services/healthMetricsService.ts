/**
 * Health Metrics Service
 *
 * Business logic layer for health metric calculations and classifications.
 * Follows Separation of Concerns - isolates business logic from UI/hooks.
 *
 * Responsibilities:
 * - Calculate health metrics (BMI, etc.)
 * - Classify health values
 * - Aggregate multiple classifications
 * - Transform raw data to domain models
 */

import { hitungBMISafe, klasifikasiBMISafe } from '@/lib/utils/bmi';
import { klasifikasiTekananDarahSafe } from '@/lib/utils/tekananDarah';
import { klasifikasiGulaDarah } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';
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
 * @param berat - Weight in kg
 * @param tinggi - Height in cm
 * @returns BMI value and category
 */
export function calculateBMI(berat: number, tinggi: number): BMIResult {
  const bmi = hitungBMISafe(berat, tinggi);
  const kategori = klasifikasiBMISafe(bmi);

  return {
    nilai: bmi,
    kategori,
  };
}

/**
 * Calculate BMI from string inputs (for forms)
 *
 * @param beratStr - Weight as string
 * @param tinggiStr - Height as string
 * @returns BMI result or null if invalid
 */
export function calculateBMIFromStrings(
  beratStr: string,
  tinggiStr: string
): BMIResult {
  const berat = parseFloat(beratStr);
  const tinggi = parseFloat(tinggiStr);

  if (isNaN(berat) || isNaN(tinggi) || berat <= 0 || tinggi <= 0) {
    return { nilai: null, kategori: null };
  }

  return calculateBMI(berat, tinggi);
}

// ============================================
// Blood Pressure Service
// ============================================

/**
 * Classify blood pressure
 *
 * @param sistolik - Systolic pressure in mmHg
 * @param diastolik - Diastolic pressure in mmHg
 * @returns Classification result
 */
export function classifyBloodPressure(
  sistolik: number,
  diastolik: number
): TekananDarahResult {
  const result = klasifikasiTekananDarahSafe(sistolik, diastolik);

  if (!result) {
    return { kategori: null, emergency: false };
  }

  return result;
}

/**
 * Classify blood pressure from string inputs (for forms)
 *
 * @param sistolikStr - Systolic as string
 * @param diastolikStr - Diastolic as string
 * @returns Classification result
 */
export function classifyBloodPressureFromStrings(
  sistolikStr: string,
  diastolikStr: string
): TekananDarahResult {
  const sistolik = parseFloat(sistolikStr);
  const diastolik = parseFloat(diastolikStr);

  if (
    isNaN(sistolik) ||
    isNaN(diastolik) ||
    sistolik <= 0 ||
    diastolik <= 0
  ) {
    return { kategori: null, emergency: false };
  }

  return classifyBloodPressure(sistolik, diastolik);
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

/**
 * Classify blood glucose from string inputs (for forms)
 *
 * @param gulaPuasaStr - Fasting glucose as string
 * @param gulaSewaktuStr - Random glucose as string
 * @param gula2JppStr - 2HPP glucose as string
 * @returns Classification result
 */
export function classifyBloodGlucoseFromStrings(
  gulaPuasaStr: string,
  gulaSewaktuStr: string,
  gula2JppStr: string
): KlasifikasiGulaDarah {
  const gulaPuasa = gulaPuasaStr ? parseFloat(gulaPuasaStr) : undefined;
  const gulaSewaktu = gulaSewaktuStr ? parseFloat(gulaSewaktuStr) : undefined;
  const gula2Jpp = gula2JppStr ? parseFloat(gula2JppStr) : undefined;

  return classifyBloodGlucose(gulaPuasa, gulaSewaktu, gula2Jpp);
}

// ============================================
// Cholesterol Service
// ============================================

/**
 * Classify cholesterol
 *
 * @param kolesterol - Cholesterol value in mg/dL
 * @returns Classification
 */
export function classifyCholesterol(kolesterol: number): string {
  return klasifikasiKolesterol(kolesterol);
}

/**
 * Classify cholesterol from string input (for forms)
 *
 * @param kolesterolStr - Cholesterol as string
 * @returns Classification or null if invalid
 */
export function classifyCholesterolFromString(
  kolesterolStr: string
): string | null {
  if (!kolesterolStr) return null;

  const kolesterol = parseFloat(kolesterolStr);
  if (isNaN(kolesterol) || kolesterol <= 0) return null;

  return classifyCholesterol(kolesterol);
}

// ============================================
// Uric Acid Service
// ============================================

/**
 * Classify uric acid based on gender
 *
 * @param asamUrat - Uric acid value in mg/dL
 * @param gender - Gender ('L' or 'P')
 * @returns Classification
 */
export function classifyUricAcid(asamUrat: number, gender: Gender): string {
  return klasifikasiAsamUrat(asamUrat, gender);
}

/**
 * Classify uric acid from string input (for forms)
 *
 * @param asamUratStr - Uric acid as string
 * @param gender - Gender
 * @returns Classification or null if invalid
 */
export function classifyUricAcidFromString(
  asamUratStr: string,
  gender: Gender
): string | null {
  if (!asamUratStr) return null;

  const asamUrat = parseFloat(asamUratStr);
  if (isNaN(asamUrat) || asamUrat <= 0) return null;

  return classifyUricAcid(asamUrat, gender);
}

// ============================================
// Aggregate Service
// ============================================

/**
 * Calculate and classify all health metrics at once
 *
 * @param data - Health metric values
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
  return {
    bmi: calculateBMIFromStrings(data.berat, data.tinggi),
    tekananDarah: classifyBloodPressureFromStrings(
      data.sistolik,
      data.diastolik
    ),
    gulaDarah: classifyBloodGlucoseFromStrings(
      data.gulaPuasa || '',
      data.gulaSewaktu || '',
      data.gula2Jpp || ''
    ),
    kolesterol: data.kolesterol
      ? classifyCholesterolFromString(data.kolesterol)
      : null,
    asamUrat: data.asamUrat
      ? classifyUricAcidFromString(data.asamUrat, gender)
      : null,
  };
}
