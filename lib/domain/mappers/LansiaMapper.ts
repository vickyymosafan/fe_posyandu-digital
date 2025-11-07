/**
 * Lansia Type Mapper
 *
 * Single Source of Truth (SSOT) Pattern:
 * - Domain entities are the canonical representation
 * - This mapper transforms between domain and other representations
 * - Ensures consistency across the application
 *
 * Type Flow:
 * API Response → Domain Entity → DB Model
 * DB Model → Domain Entity → UI Model
 */

import type { LansiaDomainEntity, CreateLansiaDTO } from '../entities/Lansia';
import type { Lansia, CreateLansiaData } from '@/types';
import type { LansiaDB } from '@/lib/db/schema';

/**
 * Lansia Type Mapper
 * Centralizes all type transformations for Lansia
 */
export class LansiaMapper {
  /**
   * Convert domain entity to UI type
   * Domain → UI
   */
  static toUIType(domain: LansiaDomainEntity): Lansia {
    return {
      id: domain.id,
      kode: domain.kode,
      nik: domain.nik,
      kk: domain.kk,
      nama: domain.nama,
      tanggalLahir: domain.tanggalLahir,
      gender: domain.gender,
      alamat: domain.alamat,
      createdAt: domain.createdAt,
    };
  }

  /**
   * Convert UI type to domain entity
   * UI → Domain
   */
  static fromUIType(ui: Lansia): LansiaDomainEntity {
    return {
      id: ui.id,
      kode: ui.kode,
      nik: ui.nik,
      kk: ui.kk,
      nama: ui.nama,
      tanggalLahir: ui.tanggalLahir,
      gender: ui.gender,
      alamat: ui.alamat,
      createdAt: ui.createdAt,
    };
  }

  /**
   * Convert domain entity to database model
   * Domain → DB
   */
  static toDBModel(domain: LansiaDomainEntity, syncedAt?: Date): LansiaDB {
    return {
      id: domain.id,
      kode: domain.kode,
      nik: domain.nik,
      kk: domain.kk,
      nama: domain.nama,
      tanggalLahir: domain.tanggalLahir,
      gender: domain.gender,
      alamat: domain.alamat,
      createdAt: domain.createdAt,
      syncedAt,
    };
  }

  /**
   * Convert database model to domain entity
   * DB → Domain
   */
  static fromDBModel(db: LansiaDB): LansiaDomainEntity {
    return {
      id: db.id,
      kode: db.kode,
      nik: db.nik,
      kk: db.kk,
      nama: db.nama,
      tanggalLahir: db.tanggalLahir,
      gender: db.gender,
      alamat: db.alamat,
      createdAt: db.createdAt,
    };
  }

  /**
   * Convert CreateLansiaData (API) to CreateLansiaDTO (Domain)
   * API → Domain
   */
  static toCreateDTO(apiData: CreateLansiaData): CreateLansiaDTO {
    return {
      nik: apiData.nik,
      kk: apiData.kk,
      nama: apiData.nama,
      tanggalLahir: apiData.tanggalLahir,
      gender: apiData.gender,
      alamat: apiData.alamat,
    };
  }

  /**
   * Convert CreateLansiaDTO (Domain) to CreateLansiaData (API)
   * Domain → API
   */
  static fromCreateDTO(dto: CreateLansiaDTO): CreateLansiaData {
    return {
      nik: dto.nik,
      kk: dto.kk,
      nama: dto.nama,
      tanggalLahir: dto.tanggalLahir,
      gender: dto.gender,
      alamat: dto.alamat,
    };
  }

  /**
   * Batch convert domain entities to UI types
   */
  static toUITypeList(domains: LansiaDomainEntity[]): Lansia[] {
    return domains.map((d) => this.toUIType(d));
  }

  /**
   * Batch convert DB models to domain entities
   */
  static fromDBModelList(dbModels: LansiaDB[]): LansiaDomainEntity[] {
    return dbModels.map((db) => this.fromDBModel(db));
  }
}
