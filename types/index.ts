/**
 * Type Definitions untuk Aplikasi Posyandu Lansia
 *
 * File ini berisi semua type definitions yang digunakan di seluruh aplikasi.
 * Mengikuti prinsip DRY dan Single Source of Truth.
 */

// ============================================
// User & Authentication Types
// ============================================

export type UserRole = 'ADMIN' | 'PETUGAS';

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// Lansia Types
// ============================================

export type Gender = 'L' | 'P';

export interface Lansia {
  id: number;
  kode: string;
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: Date;
  gender: Gender;
  alamat: string;
  createdAt: Date;
}

export interface CreateLansiaData {
  nik: string;
  kk: string;
  nama: string;
  tanggalLahir: string;
  gender: Gender;
  alamat: string;
}

export interface MinimalLansia {
  id: number;
  kode: string;
  nama: string;
  tanggalLahir: Date;
}

// ============================================
// Pemeriksaan Types
// ============================================

export interface KlasifikasiGulaDarah {
  gdp?: string;
  gds?: string;
  duaJpp?: string;
}

export interface Pemeriksaan {
  id: number;
  lansiaId: number;
  tanggal: Date;
  tinggi?: number;
  berat?: number;
  bmi?: number;
  kategoriBmi?: string;
  sistolik?: number;
  diastolik?: number;
  tekananDarah?: string;
  asamUrat?: number;
  gulaPuasa?: number;
  gulaSewaktu?: number;
  gula2Jpp?: number;
  klasifikasiGula?: KlasifikasiGulaDarah;
  kolesterol?: number;
  klasifikasiKolesterol?: string;
  createdAt: Date;
}

export interface PemeriksaanFisikData {
  tinggi: number;
  berat: number;
  sistolik: number;
  diastolik: number;
}

export interface PemeriksaanKesehatanData {
  asamUrat?: number;
  gulaPuasa?: number;
  gulaSewaktu?: number;
  gula2Jpp?: number;
  kolesterol?: number;
}

export interface PemeriksaanGabunganData {
  tinggi?: number;
  berat?: number;
  sistolik?: number;
  diastolik?: number;
  asamUrat?: number;
  gulaPuasa?: number;
  gulaSewaktu?: number;
  gula2Jpp?: number;
  kolesterol?: number;
}

// ============================================
// Petugas Types
// ============================================

export interface Petugas {
  id: number;
  nama: string;
  email: string;
  aktif: boolean;
  createdAt: Date;
}

export interface CreatePetugasData {
  nama: string;
  email: string;
  kataSandi: string;
}

export interface UpdateStatusPetugasData {
  aktif: boolean;
}

// ============================================
// Profile Types
// ============================================

export interface UpdateNamaData {
  nama: string;
}

export interface UpdatePasswordData {
  kataSandiLama: string;
  kataSandiBaru: string;
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
}

export interface APIError {
  error: string;
  details?: unknown;
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
