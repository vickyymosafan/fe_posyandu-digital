/**
 * Health Classifier Utility
 *
 * Generic health metric classification system following Open/Closed Principle.
 * Allows adding new classification standards without modifying existing code.
 *
 * Principles Applied:
 * - OCP: Open for extension (new standards), closed for modification
 * - Strategy Pattern: Different classification strategies can be plugged in
 * - Configuration-based: Thresholds defined in config, not hard-coded
 */

/**
 * Classification range definition
 */
export interface ClassificationRange {
  /** Maximum value for this range (exclusive). Use Infinity for no upper limit */
  max: number;
  /** Category label */
  label: string;
  /** Optional: Minimum value (inclusive). If not provided, uses previous range's max */
  min?: number;
  /** Optional: Is this an emergency/critical condition? */
  emergency?: boolean;
}

/**
 * Classification standard configuration
 */
export interface ClassificationStandard {
  /** Name of the standard (e.g., "WHO Asia-Pacific BMI") */
  name: string;
  /** Unit of measurement */
  unit: string;
  /** Ordered array of classification ranges (from lowest to highest) */
  ranges: ClassificationRange[];
}

/**
 * Classification result
 */
export interface ClassificationResult {
  /** Category label */
  category: string;
  /** Is this an emergency/critical condition? */
  emergency: boolean;
  /** The standard used for classification */
  standard: string;
}

/**
 * Generic health metric classifier
 *
 * @param value - The value to classify
 * @param standard - The classification standard to use
 * @returns Classification result
 *
 * @example
 * const bmiStandard: ClassificationStandard = {
 *   name: "WHO Asia-Pacific BMI",
 *   unit: "kg/m²",
 *   ranges: [
 *     { max: 17.0, label: "Berat Badan Sangat Kurang" },
 *     { max: 18.5, label: "Berat Badan Kurang" },
 *     { max: 23.0, label: "Normal" },
 *     { max: 25.0, label: "Kelebihan Berat Badan" },
 *     { max: 30.0, label: "Obesitas I" },
 *     { max: 35.0, label: "Obesitas II" },
 *     { max: Infinity, label: "Obesitas III" }
 *   ]
 * };
 *
 * const result = classifyHealthMetric(24.5, bmiStandard);
 * // Output: { category: "Kelebihan Berat Badan", emergency: false, standard: "WHO Asia-Pacific BMI" }
 */
export function classifyHealthMetric(
  value: number,
  standard: ClassificationStandard
): ClassificationResult {
  // Find the appropriate range
  for (const range of standard.ranges) {
    const min = range.min ?? 0;
    if (value >= min && value < range.max) {
      return {
        category: range.label,
        emergency: range.emergency ?? false,
        standard: standard.name,
      };
    }
  }

  // Fallback to last range if value exceeds all ranges
  const lastRange = standard.ranges[standard.ranges.length - 1];
  return {
    category: lastRange.label,
    emergency: lastRange.emergency ?? false,
    standard: standard.name,
  };
}

/**
 * Safe version of classifier that returns null for invalid input
 *
 * @param value - The value to classify
 * @param standard - The classification standard to use
 * @returns Classification result or null if invalid
 */
export function classifyHealthMetricSafe(
  value: number | null | undefined,
  standard: ClassificationStandard
): ClassificationResult | null {
  if (
    value === null ||
    value === undefined ||
    typeof value !== 'number' ||
    isNaN(value) ||
    value <= 0
  ) {
    return null;
  }

  return classifyHealthMetric(value, standard);
}

// ============================================
// Pre-defined Classification Standards
// ============================================

/**
 * BMI Classification Standard (WHO Asia-Pacific)
 */
export const BMI_STANDARD_ASIA_PACIFIC: ClassificationStandard = {
  name: 'WHO Asia-Pacific BMI',
  unit: 'kg/m²',
  ranges: [
    { max: 17.0, label: 'Berat Badan Sangat Kurang' },
    { max: 18.5, label: 'Berat Badan Kurang' },
    { max: 23.0, label: 'Normal' },
    { max: 25.0, label: 'Kelebihan Berat Badan' },
    { max: 30.0, label: 'Obesitas I' },
    { max: 35.0, label: 'Obesitas II' },
    { max: Infinity, label: 'Obesitas III' },
  ],
};

/**
 * Blood Pressure Classification Standard (AHA)
 */
export const BLOOD_PRESSURE_STANDARD_AHA: ClassificationStandard = {
  name: 'AHA Blood Pressure',
  unit: 'mmHg',
  ranges: [
    { max: 120, label: 'Normal' },
    { max: 130, label: 'Batas Waspada' },
    { max: 140, label: 'Hipertensi Tahap 1' },
    { max: 180, label: 'Hipertensi Tahap 2' },
    { max: Infinity, label: 'Krisis Hipertensi', emergency: true },
  ],
};

/**
 * Fasting Blood Glucose Classification Standard
 */
export const GLUCOSE_FASTING_STANDARD: ClassificationStandard = {
  name: 'Fasting Blood Glucose',
  unit: 'mg/dL',
  ranges: [
    { max: 100, label: 'Normal' },
    { max: 126, label: 'Pra-Diabetes' },
    { max: Infinity, label: 'Diabetes' },
  ],
};

/**
 * Random Blood Glucose Classification Standard
 */
export const GLUCOSE_RANDOM_STANDARD: ClassificationStandard = {
  name: 'Random Blood Glucose',
  unit: 'mg/dL',
  ranges: [
    { max: 200, label: 'Normal' },
    { max: Infinity, label: 'Diabetes' },
  ],
};

/**
 * 2-Hour Postprandial Blood Glucose Classification Standard
 */
export const GLUCOSE_2HPP_STANDARD: ClassificationStandard = {
  name: '2-Hour Postprandial Glucose',
  unit: 'mg/dL',
  ranges: [
    { max: 140, label: 'Normal' },
    { max: 200, label: 'Pra-Diabetes' },
    { max: Infinity, label: 'Diabetes' },
  ],
};

/**
 * Total Cholesterol Classification Standard
 */
export const CHOLESTEROL_STANDARD: ClassificationStandard = {
  name: 'Total Cholesterol',
  unit: 'mg/dL',
  ranges: [
    { max: 200, label: 'Normal' },
    { max: 240, label: 'Batas Tinggi' },
    { max: Infinity, label: 'Tinggi' },
  ],
};

/**
 * Uric Acid Classification Standard (Male)
 */
export const URIC_ACID_STANDARD_MALE: ClassificationStandard = {
  name: 'Uric Acid (Male)',
  unit: 'mg/dL',
  ranges: [
    { max: 3.4, label: 'Rendah' },
    { max: 7.0, label: 'Normal' },
    { max: Infinity, label: 'Tinggi' },
  ],
};

/**
 * Uric Acid Classification Standard (Female)
 */
export const URIC_ACID_STANDARD_FEMALE: ClassificationStandard = {
  name: 'Uric Acid (Female)',
  unit: 'mg/dL',
  ranges: [
    { max: 2.4, label: 'Rendah' },
    { max: 6.0, label: 'Normal' },
    { max: Infinity, label: 'Tinggi' },
  ],
};

// ============================================
// Convenience Functions (Backward Compatibility)
// ============================================

/**
 * Classify BMI using Asia-Pacific standard
 */
export function classifyBMI(bmi: number): string {
  return classifyHealthMetric(bmi, BMI_STANDARD_ASIA_PACIFIC).category;
}

/**
 * Classify BMI using Asia-Pacific standard (safe version)
 */
export function classifyBMISafe(bmi: number | null): string | null {
  const result = classifyHealthMetricSafe(bmi, BMI_STANDARD_ASIA_PACIFIC);
  return result ? result.category : null;
}

/**
 * Classify cholesterol
 */
export function classifyCholesterol(cholesterol: number): string {
  return classifyHealthMetric(cholesterol, CHOLESTEROL_STANDARD).category;
}

/**
 * Classify uric acid based on gender
 */
export function classifyUricAcid(
  uricAcid: number,
  gender: 'L' | 'P'
): string {
  const standard =
    gender === 'L' ? URIC_ACID_STANDARD_MALE : URIC_ACID_STANDARD_FEMALE;
  return classifyHealthMetric(uricAcid, standard).category;
}

/**
 * Classify fasting blood glucose
 */
export function classifyGlucoseFasting(glucose: number): string {
  return classifyHealthMetric(glucose, GLUCOSE_FASTING_STANDARD).category;
}

/**
 * Classify random blood glucose
 */
export function classifyGlucoseRandom(glucose: number): string {
  return classifyHealthMetric(glucose, GLUCOSE_RANDOM_STANDARD).category;
}

/**
 * Classify 2-hour postprandial blood glucose
 */
export function classifyGlucose2HPP(glucose: number): string {
  return classifyHealthMetric(glucose, GLUCOSE_2HPP_STANDARD).category;
}
