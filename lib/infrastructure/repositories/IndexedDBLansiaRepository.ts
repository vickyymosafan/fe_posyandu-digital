/**
 * IndexedDB Lansia Repository Adapter
 *
 * Concrete implementation of ILansiaRepository using IndexedDB (Dexie).
 * This is an adapter in Clean Architecture - it adapts the external
 * database to the interface defined by the domain.
 *
 * Clean Architecture Principle:
 * - Infrastructure layer implements domain interfaces
 * - Domain doesn't know about IndexedDB or Dexie
 * - Easy to swap with different implementation (e.g., API, LocalStorage)
 */

import type { ILansiaRepository } from '../../domain/repositories/ILansiaRepository';
import type { LansiaDomainEntity, MinimalLansiaDTO } from '../../domain/entities/Lansia';
import { lansiaRepository as dexieLansiaRepo } from '../../db';

/**
 * Adapter: IndexedDB implementation of ILansiaRepository
 * Translates between domain entities and database models
 */
export class IndexedDBLansiaRepository implements ILansiaRepository {
  async findByKode(kode: string): Promise<LansiaDomainEntity | null> {
    const result = await dexieLansiaRepo.getByKode(kode);
    return result ? this.toDomainEntity(result) : null;
  }

  async findByNIK(nik: string): Promise<LansiaDomainEntity | null> {
    const result = await dexieLansiaRepo.getByNik(nik);
    return result ? this.toDomainEntity(result) : null;
  }

  async findById(id: number): Promise<LansiaDomainEntity | null> {
    const result = await dexieLansiaRepo.getById(id);
    return result ? this.toDomainEntity(result) : null;
  }

  async findAll(): Promise<LansiaDomainEntity[]> {
    const results = await dexieLansiaRepo.getAll();
    return results.map((r) => this.toDomainEntity(r));
  }

  async search(query: string): Promise<MinimalLansiaDTO[]> {
    const results = await dexieLansiaRepo.search(query);
    return results.map((r) => ({
      id: r.id,
      kode: r.kode,
      nama: r.nama,
      tanggalLahir: r.tanggalLahir,
    }));
  }

  async save(
    lansia: Omit<LansiaDomainEntity, 'id' | 'createdAt'>
  ): Promise<LansiaDomainEntity> {
    const dbModel = {
      ...lansia,
      id: Date.now(), // Temporary ID
      createdAt: new Date(),
    };

    const id = await dexieLansiaRepo.create(dbModel);
    const saved = await dexieLansiaRepo.getById(id);

    if (!saved) {
      throw new Error('Failed to retrieve saved lansia');
    }

    return this.toDomainEntity(saved);
  }

  async update(
    id: number,
    data: Partial<LansiaDomainEntity>
  ): Promise<LansiaDomainEntity> {
    await dexieLansiaRepo.update(id, data);
    const updated = await dexieLansiaRepo.getById(id);

    if (!updated) {
      throw new Error('Failed to retrieve updated lansia');
    }

    return this.toDomainEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await dexieLansiaRepo.delete(id);
  }

  async count(): Promise<number> {
    return await dexieLansiaRepo.count();
  }

  async existsByNIK(nik: string): Promise<boolean> {
    const result = await dexieLansiaRepo.getByNik(nik);
    return result !== undefined;
  }

  async existsByKode(kode: string): Promise<boolean> {
    const result = await dexieLansiaRepo.getByKode(kode);
    return result !== undefined;
  }

  /**
   * Convert database model to domain entity
   * This translation keeps domain pure
   */
  private toDomainEntity(dbModel: {
    id: number;
    kode: string;
    nik: string;
    kk: string;
    nama: string;
    tanggalLahir: Date;
    gender: 'L' | 'P';
    alamat: string;
    createdAt: Date;
  }): LansiaDomainEntity {
    return {
      id: dbModel.id,
      kode: dbModel.kode,
      nik: dbModel.nik,
      kk: dbModel.kk,
      nama: dbModel.nama,
      tanggalLahir: dbModel.tanggalLahir,
      gender: dbModel.gender,
      alamat: dbModel.alamat,
      createdAt: dbModel.createdAt,
    };
  }
}
