/**
 * Domain Service: Health Metrics
 *
 * Pure business logic for health metric calculations and classifications.
 * This is a domain service - contains business logic that doesn't naturally
 * fit within a single entity.
 *
 * Clean Architecture Principle:
 * - Domain services contain pure business logic
 * - No dependencies on external frameworks or infrastructure
 * - Stateless and easily testable
 * - Can be used by multiple use cases
 */

import type { Gender } from '@/types';
import type { IHealthMetricsCalculator } from '../../use-cases/RecordPemeriksaanUseCase';

/**
 * Health Metrics Domain Service
 * Implements IHealthMetricsCalculator interface
 */
export class HealthMetricsDomainService implements IHealthMetricsCalculator {
  /**
   * Calculate BMI (Body Mass Index)
   * Formula: weight (kg) / (height (m))^2
   */
  calculateBMI(weight: number, height: number): { value: number; category: string } {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    return {
      value: Math.round(bmi * 10) / 10,
      category: this.categorizeBMI(bmi),
    };
  }

  /**
   * Classify blood pressure based on medical standards
   */
  classifyBloodPressure(
    systolic: number,
    diastolic: number
  ): { category: string; emergency: boolean } {
    // Emergency: Hypertensive Crisis
    if (systolic >= 180 || diastolic >= 120) {
      return { category: 'Krisis Hipertensi', emergency: true };
    }

    // Stage 2 Hypertension
    if (systolic >= 140 || diastolic >= 90) {
      return { category: 'Hipertensi Stage 2', emergency: false };
    }

    // Stage 1 Hypertension
    if (systolic >= 130 || diastolic >= 80) {
      return { category: 'Hipertensi Stage 1', emergency: false };
    }

    // Elevated
    if (systolic >= 120 && diastolic < 80) {
      return { category: 'Elevated', emergency: false };
    }

    // Normal
    return { category: 'Normal', emergency: false };
  }

  /**
   * Classify blood glucose levels
   */
  classifyBloodGlucose(
    fasting?: number,
    random?: number,
    postPrandial?: number
  ): { gdp?: string; gds?: string; duaJpp?: string } {
    const result: { gdp?: string; gds?: string; duaJpp?: string } = {};

    // Fasting blood glucose (GDP)
    if (fasting !== undefined) {
      if (fasting < 100) {
        result.gdp = 'Normal';
      } else if (fasting < 126) {
        result.gdp = 'Prediabetes';
      } else {
        result.gdp = 'Diabetes';
      }
    }

    // Random blood glucose (GDS)
    if (random !== undefined) {
      if (random < 140) {
        result.gds = 'Normal';
      } else if (random < 200) {
        result.gds = 'Prediabetes';
      } else {
        result.gds = 'Diabetes';
      }
    }

    // 2-hour postprandial (2JPP)
    if (postPrandial !== undefined) {
      if (postPrandial < 140) {
        result.duaJpp = 'Normal';
      } else if (postPrandial < 200) {
        result.duaJpp = 'Prediabetes';
      } else {
        result.duaJpp = 'Diabetes';
      }
    }

    return result;
  }

  /**
   * Classify cholesterol levels
   */
  classifyCholesterol(cholesterol: number): string {
    if (cholesterol < 200) {
      return 'Normal';
    } else if (cholesterol < 240) {
      return 'Borderline Tinggi';
    } else {
      return 'Tinggi';
    }
  }

  /**
   * Classify uric acid levels (gender-specific)
   */
  classifyUricAcid(uricAcid: number, gender: Gender): string {
    if (gender === 'L') {
      // Male
      if (uricAcid < 7.0) {
        return 'Normal';
      } else {
        return 'Tinggi';
      }
    } else {
      // Female
      if (uricAcid < 6.0) {
        return 'Normal';
      } else {
        return 'Tinggi';
      }
    }
  }

  /**
   * Private helper: Categorize BMI based on WHO Asia-Pacific standards
   */
  private categorizeBMI(bmi: number): string {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi < 23.0) {
      return 'Normal';
    } else if (bmi < 25.0) {
      return 'Overweight';
    } else if (bmi < 30.0) {
      return 'Obese I';
    } else {
      return 'Obese II';
    }
  }
}
