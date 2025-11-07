/**
 * Use Case: Register Lansia
 *
 * Application-specific business rule for registering a new elderly person.
 * Contains the orchestration logic independent of UI or database.
 *
 * Clean Architecture Principle:
 * - Use cases contain application-specific business rules
 * - Depend only on domain entities and repository interfaces
 * - Independent of frameworks, UI, and database
 * - Can be tested without external dependencies
 */

import type { ILansiaRepository } from '../domain/repositories/ILansiaRepository';
import type { CreateLansiaDTO, LansiaDomainEntity } from '../domain/entities/Lansia';
import { LansiaValidation } from '../domain/entities/Lansia';

/**
 * Result of lansia registration
 */
export interface RegisterLansiaResult {
  success: boolean;
  lansia?: LansiaDomainEntity;
  error?: string;
  validationErrors?: Record<string, string>;
}

/**
 * Use Case: Register a new Lansia
 *
 * Business Rules:
 * 1. Validate all input data
 * 2. Check NIK uniqueness
 * 3. Generate unique patient code
 * 4. Save to repository
 * 5. Return result with appropriate feedback
 */
export class RegisterLansiaUseCase {
  constructor(
    private readonly lansiaRepository: ILansiaRepository,
    private readonly generatePatientCode: () => Promise<string>
  ) {}

  /**
   * Execute the use case
   */
  async execute(data: CreateLansiaDTO): Promise<RegisterLansiaResult> {
    // Step 1: Validate input
    const validationErrors = this.validateInput(data);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        validationErrors,
        error: 'Data tidak valid',
      };
    }

    // Step 2: Check NIK uniqueness
    const nikExists = await this.lansiaRepository.existsByNIK(data.nik);
    if (nikExists) {
      return {
        success: false,
        error: 'NIK sudah terdaftar',
        validationErrors: { nik: 'NIK sudah terdaftar' },
      };
    }

    // Step 3: Generate unique patient code
    let kode: string;
    try {
      kode = await this.generateUniqueCode();
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Gagal menghasilkan kode pasien',
      };
    }

    // Step 4: Save to repository
    try {
      const lansia = await this.lansiaRepository.save({
        kode,
        nik: data.nik,
        kk: data.kk,
        nama: data.nama,
        tanggalLahir: new Date(data.tanggalLahir),
        gender: data.gender,
        alamat: data.alamat,
      });

      return {
        success: true,
        lansia,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Gagal menyimpan data',
      };
    }
  }

  /**
   * Validate input data using domain validation rules
   */
  private validateInput(data: CreateLansiaDTO): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!LansiaValidation.isValidNIK(data.nik)) {
      errors.nik = 'NIK harus 16 digit angka';
    }

    if (!LansiaValidation.isValidKK(data.kk)) {
      errors.kk = 'KK harus 16 digit angka';
    }

    if (!LansiaValidation.isValidName(data.nama)) {
      errors.nama = 'Nama tidak boleh kosong';
    }

    const birthDate = new Date(data.tanggalLahir);
    if (!LansiaValidation.isValidBirthDate(birthDate)) {
      errors.tanggalLahir = 'Tanggal lahir tidak valid';
    }

    if (!LansiaValidation.isValidGender(data.gender)) {
      errors.gender = 'Jenis kelamin harus L atau P';
    }

    if (!data.alamat || data.alamat.trim().length === 0) {
      errors.alamat = 'Alamat tidak boleh kosong';
    }

    return errors;
  }

  /**
   * Generate unique patient code with retry logic
   */
  private async generateUniqueCode(maxRetries: number = 10): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      const kode = await this.generatePatientCode();
      const exists = await this.lansiaRepository.existsByKode(kode);

      if (!exists) {
        return kode;
      }
    }

    throw new Error('Gagal menghasilkan kode unik setelah beberapa percobaan');
  }
}
