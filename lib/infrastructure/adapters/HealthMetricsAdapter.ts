/**
 * Health Metrics Adapter
 *
 * Adapter that wraps existing health calculation utilities
 * to implement the IHealthMetricsCalculator interface.
 *
 * Clean Architecture Principle:
 * - Adapts existing utilities to domain interface
 * - Allows domain to remain independent of specific implementations
 * - Easy to swap implementations without changing use cases
 */

import type { IHealthMetricsCalculator } from '../../use-cases/RecordPemeriksaanUseCase';
import type { Gender } from '@/types';
import { hitungBMISafe, klasifikasiBMISafe } from '@/lib/utils/bmi';
import { klasifikasiTekananDarahSafe } from '@/lib/utils/tekananDarah';
import { klasifikasiGulaDarah } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';

/**
 * Adapter: Wraps existing utility functions to implement domain interface
 */
export class HealthMetricsAdapter implements IHealthMetricsCalculator {
  calculateBMI(weight: number, height: number): { value: number; category: string } {
    const bmi = hitungBMISafe(weight, height);
    const category = klasifikasiBMISafe(bmi);

    return {
      value: bmi || 0,
      category: category || 'Unknown',
    };
  }

  classifyBloodPressure(
    systolic: number,
    diastolic: number
  ): { category: string; emergency: boolean } {
    const result = klasifikasiTekananDarahSafe(systolic, diastolic);

    return {
      category: result?.kategori || 'Unknown',
      emergency: result?.emergency || false,
    };
  }

  classifyBloodGlucose(
    fasting?: number,
    random?: number,
    postPrandial?: number
  ): { gdp?: string; gds?: string; duaJpp?: string } {
    return klasifikasiGulaDarah(fasting, random, postPrandial);
  }

  classifyCholesterol(cholesterol: number): string {
    return klasifikasiKolesterol(cholesterol);
  }

  classifyUricAcid(uricAcid: number, gender: Gender): string {
    return klasifikasiAsamUrat(uricAcid, gender);
  }
}
