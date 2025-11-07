/**
 * Lansia Submission Service
 *
 * Extracted submission logic from useLansiaForm hook.
 * Following SRP - this service only handles lansia submission.
 * 
 * Benefits:
 * - Easier to test
 * - Reusable across different contexts
 * - Clearer separation of concerns
 */

import { lansiaAPI } from '@/lib/api';
import { lansiaRepository, syncQueueRepository } from '@/lib/db';
import type { Gender } from '@/types';

// ============================================
// Types
// ============================================

interface LansiaSubmissionData {
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: string;
  gender: Gender;
  alamat: string;
}

interface SubmissionResult {
  success: boolean;
  kode?: string;
  error?: string;
}

// ============================================
// Online Submission
// ============================================

/**
 * Submit lansia data to API when online
 * Saves to IndexedDB with syncedAt timestamp
 */
export async function submitLansiaOnline(
  data: LansiaSubmissionData
): Promise<SubmissionResult> {
  try {
    const response = await lansiaAPI.create(data);

    if (!response.data) {
      return {
        success: false,
        error: response.error || 'Gagal mendaftarkan lansia',
      };
    }

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
    };
  } catch (error) {
    console.error('[LansiaSubmission] Online submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mendaftarkan lansia',
    };
  }
}

// ============================================
// Offline Submission
// ============================================

/**
 * Save lansia data to IndexedDB when offline
 * Adds to sync queue for later synchronization
 */
export async function submitLansiaOffline(
  data: LansiaSubmissionData,
  kode: string
): Promise<SubmissionResult> {
  try {
    // Save to IndexedDB
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
    };
  } catch (error) {
    console.error('[LansiaSubmission] Offline submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menyimpan data lansia',
    };
  }
}
