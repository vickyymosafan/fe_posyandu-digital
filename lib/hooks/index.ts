/**
 * Hooks Index
 *
 * Central export untuk semua custom hooks.
 * Mengikuti prinsip DRY dan Single Source of Truth.
 */

export { useAuth } from './useAuth';
export { useOffline } from './useOffline';
export { useLoginForm } from './useLoginForm';
export { useDashboardStats } from './useDashboardStats';
export { usePetugasList } from './usePetugasList';
export { usePetugasForm } from './usePetugasForm';
export { useLansiaList } from './useLansiaList';
export { useLansiaForm } from './useLansiaForm';
export { useLansiaDetail } from './useLansiaDetail';
export { usePemeriksaanFisikForm } from './usePemeriksaanFisikForm';
export { usePemeriksaanKesehatanForm } from './usePemeriksaanKesehatanForm';
export { useRiwayatPemeriksaan } from './useRiwayatPemeriksaan';
export type {
  DashboardStats,
  TrendData,
  UseDashboardStatsReturn,
} from './useDashboardStats';
export type { UseLansiaDetailReturn } from './useLansiaDetail';
export type {
  UsePemeriksaanFisikFormReturn,
  PemeriksaanFisikFormData,
  PemeriksaanFisikFormErrors,
  BMIResult,
  TekananDarahResult,
} from './usePemeriksaanFisikForm';
export type {
  UsePemeriksaanKesehatanFormReturn,
  PemeriksaanKesehatanFormData,
  PemeriksaanKesehatanFormErrors,
} from './usePemeriksaanKesehatanForm';
