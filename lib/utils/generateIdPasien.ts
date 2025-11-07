/**
 * Generate ID Pasien Utility
 *
 * File ini berisi fungsi untuk generate ID unik pasien dengan format:
 * pasien + YYYYMMDD + 2 karakter base62
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle ID generation
 * - KISS: Implementasi sederhana dan straightforward
 */

import { lansiaRepository } from '../db';
import {
  PATIENT_ID_MAX_RETRIES,
  PATIENT_ID_SUFFIX_LENGTH,
  PATIENT_ID_PREFIX,
} from '@/lib/constants';

/**
 * Karakter base62 (0-9, A-Z, a-z)
 * Provides 62 possible characters for ID generation
 */
const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Generate random string dengan base62
 */
function generateBase62(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_CHARS.length);
    result += BASE62_CHARS[randomIndex];
  }
  return result;
}

/**
 * Generate ID pasien unik dengan format: pasien + YYYYMMDD + 2 karakter base62
 * Total 16 karakter
 *
 * @param maxRetries - Maksimal percobaan untuk generate ID unik
 * @returns ID pasien unik
 * @throws Error jika gagal generate ID unik setelah maxRetries
 *
 * @example
 * const id = await generateIdPasien();
 * // Output: pasien202501055A
 */
export async function generateIdPasien(
  maxRetries: number = PATIENT_ID_MAX_RETRIES
): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  for (let i = 0; i < maxRetries; i++) {
    const suffix = generateBase62(PATIENT_ID_SUFFIX_LENGTH);
    const kode = `${PATIENT_ID_PREFIX}${dateStr}${suffix}`;

    // Check uniqueness in IndexedDB
    const existing = await lansiaRepository.getByKode(kode);
    if (!existing) {
      return kode;
    }
  }

  throw new Error('Gagal menghasilkan ID pasien unik setelah beberapa percobaan');
}
