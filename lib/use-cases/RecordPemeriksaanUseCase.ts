/**
 * Use Case: Record Pemeriksaan
 *
 * Application-specific business rule for recording health examination.
 * Orchestrates validation, calculation, and persistence.
 *
 * Clean Architecture Principle:
 * - Use case coordinates between entities and repositories
 * - Contains application-specific business rules
 * - Independent of UI and database implementation
 */

import type { IPemeriksaanRepository } from '../domain/repositories/IPemeriksaanRepository';
import type { ILansiaRepository } from '../domain/repositories/ILansiaRepository';
import type {
  CombinedExaminationDTO,
  PemeriksaanDomainEntity,
} from '../domain/entities/Pemeriksaan';
import { PemeriksaanValidation } from '../domain/entities/Pemeriksaan';
import type { Gender } from '@/types';

/**
 * Health metrics calculator interface
 * Abstraction for health calculations (BMI, blood pressure, etc.)
 */
export interface IHealthMetricsCalculator {
  calculateBMI(weight: number, height: number): { value: number; category: string };
  classifyBloodPressure(
    systolic: number,
    diastolic: number
  ): { category: string; emergency: boolean };
  classifyBloodGlucose(
    fasting?: number,
    random?: number,
    postPrandial?: number
  ): { gdp?: string; gds?: string; duaJpp?: string };
  classifyCholesterol(cholesterol: number): string;
  classifyUricAcid(uricAcid: number, gender: Gender): string;
}

/**
 * Result of recording pemeriksaan
 */
export interface RecordPemeriksaanResult {
  success: boolean;
  pemeriksaan?: PemeriksaanDomainEntity;
  error?: string;
  validationErrors?: Record<string, string>;
}

/**
 * Use Case: Record a health examination
 *
 * Business Rules:
 * 1. Validate lansia exists
 * 2. Validate examination data
 * 3. Calculate health metrics (BMI, classifications)
 * 4. Check for emergency conditions
 * 5. Save examination with calculated values
 */
export class RecordPemeriksaanUseCase {
  constructor(
    private readonly pemeriksaanRepository: IPemeriksaanRepository,
    private readonly lansiaRepository: ILansiaRepository,
    private readonly healthCalculator: IHealthMetricsCalculator
  ) {}

  /**
   * Execute the use case
   */
  async execute(
    lansiaId: number,
    data: CombinedExaminationDTO
  ): Promise<RecordPemeriksaanResult> {
    // Step 1: Validate lansia exists
    const lansia = await this.lansiaRepository.findById(lansiaId);
    if (!lansia) {
      return {
        success: false,
        error: 'Lansia tidak ditemukan',
      };
    }

    // Step 2: Validate examination data
    const validationErrors = this.validateInput(data);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        validationErrors,
        error: 'Data pemeriksaan tidak valid',
      };
    }

    // Step 3: Calculate health metrics
    const calculatedData = this.calculateMetrics(data);

    // Step 4: Check for emergency conditions
    if (data.sistolik && data.diastolik) {
      const bpCheck = this.healthCalculator.classifyBloodPressure(
        data.sistolik,
        data.diastolik
      );
      if (bpCheck.emergency) {
        // In a real app, this might trigger an alert or notification
        console.warn('[RecordPemeriksaan] Emergency blood pressure detected!');
      }
    }

    // Step 5: Save examination
    try {
      const pemeriksaan = await this.pemeriksaanRepository.save({
        lansiaId,
        tanggal: new Date(),
        ...data,
        ...calculatedData,
      });

      return {
        success: true,
        pemeriksaan,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal menyimpan pemeriksaan',
      };
    }
  }

  /**
   * Validate examination data
   */
  private validateInput(data: CombinedExaminationDTO): Record<string, string> {
    const errors: Record<string, string> = {};

    // Validate physical measurements if provided
    if (data.tinggi !== undefined && !PemeriksaanValidation.isValidHeight(data.tinggi)) {
      errors.tinggi = 'Tinggi badan harus antara 50-250 cm';
    }

    if (data.berat !== undefined && !PemeriksaanValidation.isValidWeight(data.berat)) {
      errors.berat = 'Berat badan harus antara 20-300 kg';
    }

    if (
      data.sistolik !== undefined &&
      !PemeriksaanValidation.isValidSystolic(data.sistolik)
    ) {
      errors.sistolik = 'Tekanan darah sistolik harus antara 50-300 mmHg';
    }

    if (
      data.diastolik !== undefined &&
      !PemeriksaanValidation.isValidDiastolic(data.diastolik)
    ) {
      errors.diastolik = 'Tekanan darah diastolik harus antara 30-200 mmHg';
    }

    // Validate lab results if provided
    if (
      data.gulaPuasa !== undefined &&
      !PemeriksaanValidation.isValidBloodGlucose(data.gulaPuasa)
    ) {
      errors.gulaPuasa = 'Gula darah puasa harus antara 20-600 mg/dL';
    }

    if (
      data.gulaSewaktu !== undefined &&
      !PemeriksaanValidation.isValidBloodGlucose(data.gulaSewaktu)
    ) {
      errors.gulaSewaktu = 'Gula darah sewaktu harus antara 20-600 mg/dL';
    }

    if (
      data.gula2Jpp !== undefined &&
      !PemeriksaanValidation.isValidBloodGlucose(data.gula2Jpp)
    ) {
      errors.gula2Jpp = 'Gula darah 2JPP harus antara 20-600 mg/dL';
    }

    if (
      data.kolesterol !== undefined &&
      !PemeriksaanValidation.isValidCholesterol(data.kolesterol)
    ) {
      errors.kolesterol = 'Kolesterol harus antara 50-500 mg/dL';
    }

    if (
      data.asamUrat !== undefined &&
      !PemeriksaanValidation.isValidUricAcid(data.asamUrat)
    ) {
      errors.asamUrat = 'Asam urat harus antara 1-20 mg/dL';
    }

    return errors;
  }

  /**
   * Calculate health metrics using domain service
   */
  private calculateMetrics(data: CombinedExaminationDTO) {
    const result: {
      bmi?: number;
      kategoriBmi?: string;
      tekananDarah?: string;
      klasifikasiGula?: { gdp?: string; gds?: string; duaJpp?: string };
      klasifikasiKolesterol?: string;
    } = {};

    // Calculate BMI if height and weight provided
    if (data.tinggi && data.berat) {
      const bmiResult = this.healthCalculator.calculateBMI(data.berat, data.tinggi);
      result.bmi = bmiResult.value;
      result.kategoriBmi = bmiResult.category;
    }

    // Classify blood pressure if provided
    if (data.sistolik && data.diastolik) {
      const bpResult = this.healthCalculator.classifyBloodPressure(
        data.sistolik,
        data.diastolik
      );
      result.tekananDarah = bpResult.category;
    }

    // Classify blood glucose if provided
    if (data.gulaPuasa || data.gulaSewaktu || data.gula2Jpp) {
      result.klasifikasiGula = this.healthCalculator.classifyBloodGlucose(
        data.gulaPuasa,
        data.gulaSewaktu,
        data.gula2Jpp
      );
    }

    // Classify cholesterol if provided
    if (data.kolesterol) {
      result.klasifikasiKolesterol = this.healthCalculator.classifyCholesterol(
        data.kolesterol
      );
    }

    return result;
  }
}
