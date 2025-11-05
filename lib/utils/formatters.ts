/**
 * Formatters Utility
 *
 * File ini berisi fungsi untuk format date dan number.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle formatting
 * - DRY: Reusable formatters
 */

import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date ke format Indonesia (dd MMMM yyyy)
 *
 * @param date - Date object atau ISO string
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2025-01-05'));
 * // Output: "05 Januari 2025"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMMM yyyy', { locale: id });
}

/**
 * Format date ke format pendek (dd/MM/yyyy)
 *
 * @param date - Date object atau ISO string
 * @returns Formatted date string
 *
 * @example
 * formatDateShort(new Date('2025-01-05'));
 * // Output: "05/01/2025"
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
}

/**
 * Format date dengan waktu (dd MMMM yyyy HH:mm)
 *
 * @param date - Date object atau ISO string
 * @returns Formatted datetime string
 *
 * @example
 * formatDateTime(new Date('2025-01-05T14:30:00'));
 * // Output: "05 Januari 2025 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd MMMM yyyy HH:mm', { locale: id });
}

/**
 * Format number dengan separator ribuan
 *
 * @param num - Number to format
 * @param decimals - Jumlah desimal (default: 0)
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567);
 * // Output: "1.234.567"
 *
 * formatNumber(1234.56, 2);
 * // Output: "1.234,56"
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format BMI dengan 2 desimal
 *
 * @param bmi - BMI value
 * @returns Formatted BMI string
 *
 * @example
 * formatBMI(24.2234);
 * // Output: "24,22"
 */
export function formatBMI(bmi: number): string {
  return formatNumber(bmi, 2);
}

/**
 * Format tekanan darah (sistolik/diastolik)
 *
 * @param sistolik - Tekanan darah sistolik
 * @param diastolik - Tekanan darah diastolik
 * @returns Formatted blood pressure string
 *
 * @example
 * formatTekananDarah(120, 80);
 * // Output: "120/80"
 */
export function formatTekananDarah(sistolik: number, diastolik: number): string {
  return `${sistolik}/${diastolik}`;
}

/**
 * Format nilai lab dengan satuan
 *
 * @param value - Nilai lab
 * @param unit - Satuan (default: "mg/dL")
 * @param decimals - Jumlah desimal (default: 1)
 * @returns Formatted lab value string
 *
 * @example
 * formatLabValue(110.5);
 * // Output: "110,5 mg/dL"
 */
export function formatLabValue(
  value: number,
  unit: string = 'mg/dL',
  decimals: number = 1
): string {
  return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Parse date string ke Date object
 *
 * @param dateString - Date string dalam format ISO atau dd/MM/yyyy
 * @returns Date object
 *
 * @example
 * parseDate('2025-01-05');
 * // Output: Date object
 */
export function parseDate(dateString: string): Date {
  // Try ISO format first
  if (dateString.includes('-')) {
    return parseISO(dateString);
  }

  // Try dd/MM/yyyy format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // Fallback to Date constructor
  return new Date(dateString);
}

/**
 * Format umur dari tanggal lahir
 *
 * @param tanggalLahir - Tanggal lahir (Date object atau ISO string)
 * @returns Umur dalam tahun
 *
 * @example
 * formatUmur(new Date('1960-01-05'));
 * // Output: "65 tahun"
 */
export function formatUmur(tanggalLahir: Date | string): string {
  const birthDate = typeof tanggalLahir === 'string' ? parseISO(tanggalLahir) : tanggalLahir;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${age} tahun`;
}
