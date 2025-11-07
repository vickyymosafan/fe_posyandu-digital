/**
 * Pemeriksaan Service
 *
 * Business logic layer for Pemeriksaan (health examination) operations.
 * Follows Separation of Concerns - isolates business logic from UI/hooks.
 *
 * Responsibilities:
 * - Transform form data to API format
 * - Coordinate online/offline operations
 * - Handle sync queue for offline submissions
 * - Validate and prepare examination data
 */

import { pemeriksaanAPI } from '@/lib/api';
import { pemeriksaanRepository, syncQueueRepository } from '@/lib/db';
import type {
  PemeriksaanGabunganData,
  PemeriksaanKesehatanData,
  Pemeriksaan,
} from '@/types';

// ============================================
// Types
// ============================================

/**
 * Result of pemeriksaan creation
 */
export interface CreatePemeriksaanResult {
  success: boolean;
  pemeriksaan?: Pemeriksaan;
  error?: string;
  isOffline?: boolean;
}

/**
 * Form data for gabungan pemeriksaan
 */
export interface PemeriksaanGabunganFormData {
  tinggi: string;
  berat: string;
  sistolik: string;
  diastolik: string;
  gulaPuasa?: string;
  gulaSewaktu?: string;
  gula2Jpp?: string;
  kolesterol?: string;
  asamUrat?: string;
}

/**
 * Form data for kesehatan pemeriksaan
 */
export interface PemeriksaanKesehatanFormData {
  gulaPuasa: string;
  gulaSewaktu: string;
  gula2Jpp: string;
  kolesterol: string;
  asamUrat: string;
}

// ============================================
// Data Transformation Service
// ============================================

/**
 * Transform gabungan form data to API format
 *
 * @param formData - Raw form data
 * @returns API-ready data
 */
export function transformGabunganFormData(
  formData: PemeriksaanGabunganFormData
): PemeriksaanGabunganData {
  const data: PemeriksaanGabunganData = {
    tinggi: parseFloat(formData.tinggi),
    berat: parseFloat(formData.berat),
    sistolik: parseFloat(formData.sistolik),
    diastolik: parseFloat(formData.diastolik),
  };

  // Add optional lab data
  if (formData.gulaPuasa) {
    data.gulaPuasa = parseFloat(formData.gulaPuasa);
  }
  if (formData.gulaSewaktu) {
    data.gulaSewaktu = parseFloat(formData.gulaSewaktu);
  }
  if (formData.gula2Jpp) {
    data.gula2Jpp = parseFloat(formData.gula2Jpp);
  }
  if (formData.kolesterol) {
    data.kolesterol = parseFloat(formData.kolesterol);
  }
  if (formData.asamUrat) {
    data.asamUrat = parseFloat(formData.asamUrat);
  }

  return data;
}

/**
 * Transform kesehatan form data to API format
 *
 * @param formData - Raw form data
 * @returns API-ready data
 */
export function transformKesehatanFormData(
  formData: PemeriksaanKesehatanFormData
): PemeriksaanKesehatanData {
  const data: PemeriksaanKesehatanData = {};

  if (formData.gulaPuasa) {
    data.gulaPuasa = parseFloat(formData.gulaPuasa);
  }
  if (formData.gulaSewaktu) {
    data.gulaSewaktu = parseFloat(formData.gulaSewaktu);
  }
  if (formData.gula2Jpp) {
    data.gula2Jpp = parseFloat(formData.gula2Jpp);
  }
  if (formData.kolesterol) {
    data.kolesterol = parseFloat(formData.kolesterol);
  }
  if (formData.asamUrat) {
    data.asamUrat = parseFloat(formData.asamUrat);
  }

  return data;
}

// ============================================
// Pemeriksaan Creation Service
// ============================================

/**
 * Create pemeriksaan gabungan online (with API)
 *
 * @param kode - Patient code
 * @param data - Pemeriksaan data
 * @returns Creation result
 */
async function createGabunganOnline(
  kode: string,
  data: PemeriksaanGabunganData
): Promise<CreatePemeriksaanResult> {
  try {
    const response = await pemeriksaanAPI.createGabungan(kode, data);

    if (response.error) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      pemeriksaan: response.data,
      isOffline: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create pemeriksaan gabungan offline (IndexedDB + sync queue)
 *
 * @param kode - Patient code
 * @param lansiaId - Lansia ID
 * @param data - Pemeriksaan data
 * @returns Creation result
 */
async function createGabunganOffline(
  kode: string,
  lansiaId: number,
  data: PemeriksaanGabunganData
): Promise<CreatePemeriksaanResult> {
  try {
    // Save to IndexedDB
    const pemeriksaanDB = {
      id: Date.now(), // Temporary ID
      lansiaId,
      tanggal: new Date(),
      tinggi: data.tinggi,
      berat: data.berat,
      sistolik: data.sistolik,
      diastolik: data.diastolik,
      gulaPuasa: data.gulaPuasa,
      gulaSewaktu: data.gulaSewaktu,
      gula2Jpp: data.gula2Jpp,
      kolesterol: data.kolesterol,
      asamUrat: data.asamUrat,
      createdAt: new Date(),
    };

    await pemeriksaanRepository.create(pemeriksaanDB);

    // Add to sync queue
    await syncQueueRepository.add({
      entity: 'PEMERIKSAAN',
      type: 'CREATE',
      data: { kode, ...data },
    });

    return {
      success: true,
      isOffline: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create pemeriksaan gabungan (handles both online and offline)
 *
 * @param kode - Patient code
 * @param lansiaId - Lansia ID
 * @param data - Pemeriksaan data
 * @param isOnline - Whether device is online
 * @returns Creation result
 */
export async function createPemeriksaanGabungan(
  kode: string,
  lansiaId: number,
  data: PemeriksaanGabunganData,
  isOnline: boolean
): Promise<CreatePemeriksaanResult> {
  if (isOnline) {
    return await createGabunganOnline(kode, data);
  } else {
    return await createGabunganOffline(kode, lansiaId, data);
  }
}

/**
 * Create pemeriksaan kesehatan online (with API)
 *
 * @param kode - Patient code
 * @param data - Pemeriksaan data
 * @returns Creation result
 */
async function createKesehatanOnline(
  kode: string,
  data: PemeriksaanKesehatanData
): Promise<CreatePemeriksaanResult> {
  try {
    const response = await pemeriksaanAPI.createKesehatan(kode, data);

    if (response.error) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      pemeriksaan: response.data,
      isOffline: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create pemeriksaan kesehatan offline (IndexedDB + sync queue)
 *
 * @param kode - Patient code
 * @param lansiaId - Lansia ID
 * @param data - Pemeriksaan data
 * @returns Creation result
 */
async function createKesehatanOffline(
  kode: string,
  lansiaId: number,
  data: PemeriksaanKesehatanData
): Promise<CreatePemeriksaanResult> {
  try {
    // Save to IndexedDB
    const pemeriksaanDB = {
      id: Date.now(), // Temporary ID
      lansiaId,
      tanggal: new Date(),
      gulaPuasa: data.gulaPuasa,
      gulaSewaktu: data.gulaSewaktu,
      gula2Jpp: data.gula2Jpp,
      kolesterol: data.kolesterol,
      asamUrat: data.asamUrat,
      createdAt: new Date(),
    };

    await pemeriksaanRepository.create(pemeriksaanDB);

    // Add to sync queue
    await syncQueueRepository.add({
      entity: 'PEMERIKSAAN',
      type: 'CREATE',
      data: { kode, ...data },
    });

    return {
      success: true,
      isOffline: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create pemeriksaan kesehatan (handles both online and offline)
 *
 * @param kode - Patient code
 * @param lansiaId - Lansia ID
 * @param data - Pemeriksaan data
 * @param isOnline - Whether device is online
 * @returns Creation result
 */
export async function createPemeriksaanKesehatan(
  kode: string,
  lansiaId: number,
  data: PemeriksaanKesehatanData,
  isOnline: boolean
): Promise<CreatePemeriksaanResult> {
  if (isOnline) {
    return await createKesehatanOnline(kode, data);
  } else {
    return await createKesehatanOffline(kode, lansiaId, data);
  }
}

// ============================================
// Query Service
// ============================================

/**
 * Get pemeriksaan history for a patient
 *
 * @param kode - Patient code
 * @returns Array of pemeriksaan
 */
export async function getPemeriksaanHistory(
  kode: string
): Promise<Pemeriksaan[]> {
  try {
    // Import here to avoid circular dependency
    const { lansiaAPI } = await import('@/lib/api');
    const response = await lansiaAPI.getPemeriksaan(kode);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching pemeriksaan history:', error);
    return [];
  }
}
