/**
 * Health Classification Standards Configuration
 *
 * This file demonstrates how to extend the health classification system
 * with custom standards following the Open/Closed Principle.
 *
 * You can add new classification standards without modifying existing code.
 */

import type { ClassificationStandard } from '@/lib/utils/healthClassifier';

// ============================================
// Example: Alternative BMI Standard (WHO International)
// ============================================

/**
 * BMI Classification Standard (WHO International)
 * Different from Asia-Pacific standard
 */
export const BMI_STANDARD_WHO_INTERNATIONAL: ClassificationStandard = {
  name: 'WHO International BMI',
  unit: 'kg/m²',
  ranges: [
    { max: 16.0, label: 'Severe Thinness' },
    { max: 17.0, label: 'Moderate Thinness' },
    { max: 18.5, label: 'Mild Thinness' },
    { max: 25.0, label: 'Normal' },
    { max: 30.0, label: 'Overweight' },
    { max: 35.0, label: 'Obese Class I' },
    { max: 40.0, label: 'Obese Class II' },
    { max: Infinity, label: 'Obese Class III' },
  ],
};

// ============================================
// Example: Custom Blood Pressure Standard
// ============================================

/**
 * Blood Pressure Classification for Elderly (Custom)
 * More lenient thresholds for elderly patients
 */
export const BLOOD_PRESSURE_STANDARD_ELDERLY: ClassificationStandard = {
  name: 'Blood Pressure (Elderly)',
  unit: 'mmHg',
  ranges: [
    { max: 130, label: 'Normal' },
    { max: 140, label: 'Batas Waspada' },
    { max: 150, label: 'Hipertensi Tahap 1' },
    { max: 180, label: 'Hipertensi Tahap 2' },
    { max: Infinity, label: 'Krisis Hipertensi', emergency: true },
  ],
};

// ============================================
// Example: HbA1c Classification
// ============================================

/**
 * HbA1c Classification Standard
 * New metric not in the original system
 */
export const HBA1C_STANDARD: ClassificationStandard = {
  name: 'HbA1c',
  unit: '%',
  ranges: [
    { max: 5.7, label: 'Normal' },
    { max: 6.5, label: 'Pra-Diabetes' },
    { max: Infinity, label: 'Diabetes' },
  ],
};

// ============================================
// Example: LDL Cholesterol Classification
// ============================================

/**
 * LDL Cholesterol Classification Standard
 * More specific than total cholesterol
 */
export const LDL_CHOLESTEROL_STANDARD: ClassificationStandard = {
  name: 'LDL Cholesterol',
  unit: 'mg/dL',
  ranges: [
    { max: 100, label: 'Optimal' },
    { max: 130, label: 'Near Optimal' },
    { max: 160, label: 'Borderline High' },
    { max: 190, label: 'High' },
    { max: Infinity, label: 'Very High' },
  ],
};

// ============================================
// Example: HDL Cholesterol Classification
// ============================================

/**
 * HDL Cholesterol Classification Standard
 * Higher is better for HDL
 */
export const HDL_CHOLESTEROL_STANDARD: ClassificationStandard = {
  name: 'HDL Cholesterol',
  unit: 'mg/dL',
  ranges: [
    { max: 40, label: 'Low (Risk)' },
    { max: 60, label: 'Normal' },
    { max: Infinity, label: 'High (Protective)' },
  ],
};

// ============================================
// Example: Triglycerides Classification
// ============================================

/**
 * Triglycerides Classification Standard
 */
export const TRIGLYCERIDES_STANDARD: ClassificationStandard = {
  name: 'Triglycerides',
  unit: 'mg/dL',
  ranges: [
    { max: 150, label: 'Normal' },
    { max: 200, label: 'Borderline High' },
    { max: 500, label: 'High' },
    { max: Infinity, label: 'Very High' },
  ],
};

// ============================================
// Example: Creatinine Classification (Gender-specific)
// ============================================

/**
 * Creatinine Classification Standard (Male)
 */
export const CREATININE_STANDARD_MALE: ClassificationStandard = {
  name: 'Creatinine (Male)',
  unit: 'mg/dL',
  ranges: [
    { max: 0.7, label: 'Low' },
    { max: 1.3, label: 'Normal' },
    { max: Infinity, label: 'High' },
  ],
};

/**
 * Creatinine Classification Standard (Female)
 */
export const CREATININE_STANDARD_FEMALE: ClassificationStandard = {
  name: 'Creatinine (Female)',
  unit: 'mg/dL',
  ranges: [
    { max: 0.6, label: 'Low' },
    { max: 1.1, label: 'Normal' },
    { max: Infinity, label: 'High' },
  ],
};

// ============================================
// Usage Examples
// ============================================

/*
import { classifyHealthMetric } from '@/lib/utils/healthClassifier';
import { BMI_STANDARD_WHO_INTERNATIONAL, HBA1C_STANDARD } from './healthStandards.example';

// Use alternative BMI standard
const bmiResult = classifyHealthMetric(24.5, BMI_STANDARD_WHO_INTERNATIONAL);
console.log(bmiResult.category); // "Normal"

// Use new HbA1c classification
const hba1cResult = classifyHealthMetric(6.0, HBA1C_STANDARD);
console.log(hba1cResult.category); // "Pra-Diabetes"

// Easy to switch standards without modifying code
function classifyPatientBMI(bmi: number, useInternationalStandard: boolean) {
  const standard = useInternationalStandard 
    ? BMI_STANDARD_WHO_INTERNATIONAL 
    : BMI_STANDARD_ASIA_PACIFIC;
  
  return classifyHealthMetric(bmi, standard);
}
*/
