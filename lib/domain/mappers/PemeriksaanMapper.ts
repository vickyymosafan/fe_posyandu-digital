/**
 * Pemeriksaan Type Mapper
 *
 * Single Source of Truth (SSOT) Pattern:
 * - Domain entities are the canonical representation
 * - This mapper ensures consistent transformations
 * - Centralizes all type conversions
 */

import type { PemeriksaanDomainEntity, CombinedExaminationDTO } from '../entities/Pemeriksaan';
import type { Pemeriksaan, PemeriksaanGabunganData } from '@/types';
import type { PemeriksaanDB } from '@/lib/db/schema';

/**
 * Pemeriksaan Type Mapper
 * Centralizes all type transformations for Pemeriksaan
 */
export class PemeriksaanMapper {
  /**
   * Convert domain entity to UI type
   * Domain → UI
   */
  static toUIType(domain: PemeriksaanDomainEntity): Pemeriksaan {
    return {
      id: domain.id,
      lansiaId: domain.lansiaId,
      tanggal: domain.tanggal,
      tinggi: domain.tinggi,
      berat: domain.berat,
      bmi: domain.bmi,
      kategoriBmi: domain.kategoriBmi,
      sistolik: domain.sistolik,
      diastolik: domain.diastolik,
      tekananDarah: domain.tekananDarah,
      asamUrat: domain.asamUrat,
      gulaPuasa: domain.gulaPuasa,
      gulaSewaktu: domain.gulaSewaktu,
      gula2Jpp: domain.gula2Jpp,
      klasifikasiGula: domain.klasifikasiGula,
      kolesterol: domain.kolesterol,
      klasifikasiKolesterol: domain.klasifikasiKolesterol,
      createdAt: domain.createdAt,
    };
  }

  /**
   * Convert UI type to domain entity
   * UI → Domain
   */
  static fromUIType(ui: Pemeriksaan): PemeriksaanDomainEntity {
    return {
      id: ui.id,
      lansiaId: ui.lansiaId,
      tanggal: ui.tanggal,
      tinggi: ui.tinggi,
      berat: ui.berat,
      bmi: ui.bmi,
      kategoriBmi: ui.kategoriBmi,
      sistolik: ui.sistolik,
      diastolik: ui.diastolik,
      tekananDarah: ui.tekananDarah,
      asamUrat: ui.asamUrat,
      gulaPuasa: ui.gulaPuasa,
      gulaSewaktu: ui.gulaSewaktu,
      gula2Jpp: ui.gula2Jpp,
      klasifikasiGula: ui.klasifikasiGula,
      kolesterol: ui.kolesterol,
      klasifikasiKolesterol: ui.klasifikasiKolesterol,
      createdAt: ui.createdAt,
    };
  }

  /**
   * Convert domain entity to database model
   * Domain → DB
   */
  static toDBModel(domain: PemeriksaanDomainEntity, syncedAt?: Date): PemeriksaanDB {
    return {
      id: domain.id,
      lansiaId: domain.lansiaId,
      tanggal: domain.tanggal,
      tinggi: domain.tinggi,
      berat: domain.berat,
      bmi: domain.bmi,
      kategoriBmi: domain.kategoriBmi,
      sistolik: domain.sistolik,
      diastolik: domain.diastolik,
      tekananDarah: domain.tekananDarah,
      asamUrat: domain.asamUrat,
      gulaPuasa: domain.gulaPuasa,
      gulaSewaktu: domain.gulaSewaktu,
      gula2Jpp: domain.gula2Jpp,
      klasifikasiGula: domain.klasifikasiGula,
      kolesterol: domain.kolesterol,
      klasifikasiKolesterol: domain.klasifikasiKolesterol,
      createdAt: domain.createdAt,
      syncedAt,
    };
  }

  /**
   * Convert database model to domain entity
   * DB → Domain
   */
  static fromDBModel(db: PemeriksaanDB): PemeriksaanDomainEntity {
    return {
      id: db.id,
      lansiaId: db.lansiaId,
      tanggal: db.tanggal,
      tinggi: db.tinggi,
      berat: db.berat,
      bmi: db.bmi,
      kategoriBmi: db.kategoriBmi,
      sistolik: db.sistolik,
      diastolik: db.diastolik,
      tekananDarah: db.tekananDarah,
      asamUrat: db.asamUrat,
      gulaPuasa: db.gulaPuasa,
      gulaSewaktu: db.gulaSewaktu,
      gula2Jpp: db.gula2Jpp,
      klasifikasiGula: db.klasifikasiGula,
      kolesterol: db.kolesterol,
      klasifikasiKolesterol: db.klasifikasiKolesterol,
      createdAt: db.createdAt,
    };
  }

  /**
   * Convert PemeriksaanGabunganData (API) to CombinedExaminationDTO (Domain)
   * API → Domain
   */
  static toCombinedDTO(apiData: PemeriksaanGabunganData): CombinedExaminationDTO {
    return {
      tinggi: apiData.tinggi,
      berat: apiData.berat,
      sistolik: apiData.sistolik,
      diastolik: apiData.diastolik,
      asamUrat: apiData.asamUrat,
      gulaPuasa: apiData.gulaPuasa,
      gulaSewaktu: apiData.gulaSewaktu,
      gula2Jpp: apiData.gula2Jpp,
      kolesterol: apiData.kolesterol,
    };
  }

  /**
   * Convert CombinedExaminationDTO (Domain) to PemeriksaanGabunganData (API)
   * Domain → API
   */
  static fromCombinedDTO(dto: CombinedExaminationDTO): PemeriksaanGabunganData {
    return {
      tinggi: dto.tinggi,
      berat: dto.berat,
      sistolik: dto.sistolik,
      diastolik: dto.diastolik,
      asamUrat: dto.asamUrat,
      gulaPuasa: dto.gulaPuasa,
      gulaSewaktu: dto.gulaSewaktu,
      gula2Jpp: dto.gula2Jpp,
      kolesterol: dto.kolesterol,
    };
  }

  /**
   * Batch convert domain entities to UI types
   */
  static toUITypeList(domains: PemeriksaanDomainEntity[]): Pemeriksaan[] {
    return domains.map((d) => this.toUIType(d));
  }

  /**
   * Batch convert DB models to domain entities
   */
  static fromDBModelList(dbModels: PemeriksaanDB[]): PemeriksaanDomainEntity[] {
    return dbModels.map((db) => this.fromDBModel(db));
  }
}
