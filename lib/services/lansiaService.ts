/**
 * Lansia Service
 *
 * Business logic layer for Lansia (elderly patient) operations.
 * Follows Separation of Concerns - isolates business logic from UI/hooks.
 *
 * Responsibilities:
 * - Generate unique patient IDs
 * - Coordinate online/offline data operations
 * - Transform form data to API format
 * - Handle sync queue operations
 */

import { lansiaAPI } from '@/lib/api';
import { lansiaRepository, syncQueueRepository } from '@/lib/db';
import { generateIdPasien } from '@/lib/utils/generateIdPasien';
import type { CreateLansiaData, Lansia } from '@/types';

// ============================================
// Types
// ============================================

/**
 * Result of lansia creation
 */
export interface CreateLansiaResult {
  success: boolean;
  kode: string;
  lansia?: Lansia;
  error?: string;
  isOffline?: boolean;
}

// ============================================
// ID Generation Service
// ============================================

/**
 * Generate unique patient ID
 *
 * @returns Unique patient code
 */
export async function generateUniqueLansiaId(): Promise<string> {
  return await generateIdPasien();
}

// ============================================
// Lansia Creation Service
// ============================================

/**
 * Create lansia online (with API)
 *
 * @param data - Lansia data
 * @returns Creation result
 */
async function createLansiaOnline(
  data: CreateLansiaData
): Promise<CreateLansiaResult> {
  try {
    const response = await lansiaAPI.create(data);

    if (response.data) {
      // Save to IndexedDB with syncedAt
      const lansiaDB = {
        ...response.data,
        tanggalLahir: new Date(response.data.tanggalLahir),
        createdAt: new Date(response.data.createdAt),
        syncedAt: new Date(),
      };
      await lansiaRepository.create(lansiaDB);

      return {
        success: true,
        kode: response.data.kode,
        lansia: response.data,
        isOffline: false,
      };
    }

    return {
      success: false,
      kode: '',
      error: 'No data returned from API',
    };
  } catch (error) {
    return {
      success: false,
      kode: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create lansia offline (IndexedDB + sync queue)
 *
 * @param data - Lansia data
 * @param kode - Pre-generated patient code
 * @returns Creation result
 */
async function createLansiaOffline(
  data: CreateLansiaData,
  kode: string
): Promise<CreateLansiaResult> {
  try {
    const lansiaDB = {
      id: Date.now(), // Temporary ID
      kode,
      nik: data.nik,
      kk: data.kk,
      nama: data.nama,
      tanggalLahir: new Date(data.tanggalLahir),
      gender: data.gender,
      alamat: data.alamat,
      createdAt: new Date(),
    };

    await lansiaRepository.create(lansiaDB);

    // Add to sync queue
    await syncQueueRepository.add({
      entity: 'LANSIA',
      type: 'CREATE',
      data,
    });

    return {
      success: true,
      kode,
      isOffline: true,
    };
  } catch (error) {
    return {
      success: false,
      kode: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create lansia (handles both online and offline)
 *
 * @param data - Lansia data
 * @param isOnline - Whether device is online
 * @returns Creation result
 */
export async function createLansia(
  data: CreateLansiaData,
  isOnline: boolean
): Promise<CreateLansiaResult> {
  // Generate unique ID first
  const kode = await generateUniqueLansiaId();

  if (isOnline) {
    return await createLansiaOnline(data);
  } else {
    return await createLansiaOffline(data, kode);
  }
}

// ============================================
// Data Transformation Service
// ============================================

/**
 * Transform form data to API format
 *
 * @param formData - Raw form data
 * @returns API-ready data
 */
export function transformFormDataToCreateLansiaData(formData: {
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: string;
  gender: 'L' | 'P';
  alamat: string;
}): CreateLansiaData {
  return {
    nik: formData.nik,
    kk: formData.kk,
    nama: formData.nama,
    tanggalLahir: formData.tanggalLahir,
    gender: formData.gender,
    alamat: formData.alamat,
  };
}

// ============================================
// Query Service
// ============================================

/**
 * Get lansia by code
 *
 * @param kode - Patient code
 * @returns Lansia data or null
 */
export async function getLansiaByKode(kode: string): Promise<Lansia | null> {
  try {
    const response = await lansiaAPI.getByKode(kode);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching lansia:', error);
    return null;
  }
}

/**
 * Get all lansia
 *
 * @returns Array of lansia
 */
export async function getAllLansia(): Promise<Lansia[]> {
  try {
    const response = await lansiaAPI.getAll();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching all lansia:', error);
    return [];
  }
}

/**
 * Search lansia
 *
 * @param query - Search query
 * @returns Array of matching lansia (may be minimal data)
 */
export async function searchLansia(
  query: string
): Promise<Array<Lansia | { id: number; kode: string; nama: string; tanggalLahir: Date }>> {
  try {
    const response = await lansiaAPI.find(query);
    return response.data || [];
  } catch (error) {
    console.error('Error searching lansia:', error);
    return [];
  }
}
