/**
 * Domain Entity: Lansia
 *
 * Pure business entity representing an elderly person (lansia).
 * Independent of database, API, or framework implementations.
 *
 * Clean Architecture Principle:
 * - Entities are at the center of the architecture
 * - No dependencies on external layers
 * - Contains only business logic and validation rules
 */

import type { Gender } from '@/types';

/**
 * Lansia Domain Entity
 * Represents the core business concept of an elderly person
 */
export interface LansiaDomainEntity {
  readonly id: number;
  readonly kode: string;
  readonly nik: string;
  readonly kk: string;
  readonly nama: string;
  readonly tanggalLahir: Date;
  readonly gender: Gender;
  readonly alamat: string;
  readonly createdAt: Date;
}

/**
 * Data required to create a new Lansia
 */
export interface CreateLansiaDTO {
  readonly nik: string;
  readonly kk: string;
  readonly nama: string;
  readonly tanggalLahir: string;
  readonly gender: Gender;
  readonly alamat: string;
}

/**
 * Minimal Lansia data for search results
 */
export interface MinimalLansiaDTO {
  readonly id: number;
  readonly kode: string;
  readonly nama: string;
  readonly tanggalLahir: Date;
}

/**
 * Domain validation rules for Lansia
 */
export class LansiaValidation {
  /**
   * Validate NIK format (16 digits)
   */
  static isValidNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik);
  }

  /**
   * Validate KK format (16 digits)
   */
  static isValidKK(kk: string): boolean {
    return /^\d{16}$/.test(kk);
  }

  /**
   * Validate name (not empty)
   */
  static isValidName(nama: string): boolean {
    return nama.trim().length > 0;
  }

  /**
   * Validate birth date (not in future)
   */
  static isValidBirthDate(tanggalLahir: Date): boolean {
    return tanggalLahir <= new Date();
  }

  /**
   * Validate gender
   */
  static isValidGender(gender: string): gender is Gender {
    return gender === 'L' || gender === 'P';
  }

  /**
   * Calculate age from birth date
   */
  static calculateAge(tanggalLahir: Date): number {
    const today = new Date();
    let age = today.getFullYear() - tanggalLahir.getFullYear();
    const monthDiff = today.getMonth() - tanggalLahir.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < tanggalLahir.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Check if person is elderly (lansia) - typically 60+ years
   */
  static isElderly(tanggalLahir: Date): boolean {
    return this.calculateAge(tanggalLahir) >= 60;
  }
}
