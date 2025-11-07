/**
 * Domain Entity: Pemeriksaan
 *
 * Pure business entity representing a health examination.
 * Independent of database, API, or framework implementations.
 *
 * Clean Architecture Principle:
 * - Entities contain business logic and validation
 * - No dependencies on external layers
 * - Immutable data structures
 */

// Gender type imported for validation methods
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Gender } from '@/types';

/**
 * Blood glucose classification result
 */
export interface BloodGlucoseClassification {
  readonly gdp?: string; // Gula Darah Puasa
  readonly gds?: string; // Gula Darah Sewaktu
  readonly duaJpp?: string; // 2 Jam Post Prandial
}

/**
 * Pemeriksaan Domain Entity
 * Represents a complete health examination
 */
export interface PemeriksaanDomainEntity {
  readonly id: number;
  readonly lansiaId: number;
  readonly tanggal: Date;
  readonly tinggi?: number;
  readonly berat?: number;
  readonly bmi?: number;
  readonly kategoriBmi?: string;
  readonly sistolik?: number;
  readonly diastolik?: number;
  readonly tekananDarah?: string;
  readonly asamUrat?: number;
  readonly gulaPuasa?: number;
  readonly gulaSewaktu?: number;
  readonly gula2Jpp?: number;
  readonly klasifikasiGula?: BloodGlucoseClassification;
  readonly kolesterol?: number;
  readonly klasifikasiKolesterol?: string;
  readonly createdAt: Date;
}

/**
 * Physical examination data
 */
export interface PhysicalExaminationDTO {
  readonly tinggi: number;
  readonly berat: number;
  readonly sistolik: number;
  readonly diastolik: number;
}

/**
 * Health/Lab examination data
 */
export interface HealthExaminationDTO {
  readonly asamUrat?: number;
  readonly gulaPuasa?: number;
  readonly gulaSewaktu?: number;
  readonly gula2Jpp?: number;
  readonly kolesterol?: number;
}

/**
 * Combined examination data (physical + health)
 */
export interface CombinedExaminationDTO extends Partial<PhysicalExaminationDTO> {
  readonly asamUrat?: number;
  readonly gulaPuasa?: number;
  readonly gulaSewaktu?: number;
  readonly gula2Jpp?: number;
  readonly kolesterol?: number;
}

/**
 * Domain validation rules for Pemeriksaan
 */
export class PemeriksaanValidation {
  /**
   * Validate height (50-250 cm)
   */
  static isValidHeight(tinggi: number): boolean {
    return tinggi >= 50 && tinggi <= 250;
  }

  /**
   * Validate weight (20-300 kg)
   */
  static isValidWeight(berat: number): boolean {
    return berat >= 20 && berat <= 300;
  }

  /**
   * Validate systolic blood pressure (50-300 mmHg)
   */
  static isValidSystolic(sistolik: number): boolean {
    return sistolik >= 50 && sistolik <= 300;
  }

  /**
   * Validate diastolic blood pressure (30-200 mmHg)
   */
  static isValidDiastolic(diastolik: number): boolean {
    return diastolik >= 30 && diastolik <= 200;
  }

  /**
   * Validate blood glucose (20-600 mg/dL)
   */
  static isValidBloodGlucose(glucose: number): boolean {
    return glucose >= 20 && glucose <= 600;
  }

  /**
   * Validate cholesterol (50-500 mg/dL)
   */
  static isValidCholesterol(kolesterol: number): boolean {
    return kolesterol >= 50 && kolesterol <= 500;
  }

  /**
   * Validate uric acid (1-20 mg/dL)
   */
  static isValidUricAcid(asamUrat: number): boolean {
    return asamUrat >= 1 && asamUrat <= 20;
  }

  /**
   * Check if blood pressure is in emergency range
   */
  static isEmergencyBloodPressure(sistolik: number, diastolik: number): boolean {
    return sistolik >= 180 || diastolik >= 120;
  }

  /**
   * Check if examination has physical measurements
   */
  static hasPhysicalMeasurements(exam: Partial<PemeriksaanDomainEntity>): boolean {
    return !!(exam.tinggi && exam.berat && exam.sistolik && exam.diastolik);
  }

  /**
   * Check if examination has lab results
   */
  static hasLabResults(exam: Partial<PemeriksaanDomainEntity>): boolean {
    return !!(
      exam.gulaPuasa ||
      exam.gulaSewaktu ||
      exam.gula2Jpp ||
      exam.kolesterol ||
      exam.asamUrat
    );
  }
}
