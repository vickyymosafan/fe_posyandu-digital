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
export { usePemeriksaanKesehatanForm } from './usePemeriksaanKesehatanForm';
export { usePemeriksaanGabunganForm } from './usePemeriksaanGabunganForm';
export { useProfileForm } from './useProfileForm';
export { usePasswordForm } from './usePasswordForm';
export type {
  DashboardStats,
  TrendData,
  UseDashboardStatsReturn,
} from './useDashboardStats';
export type { UseLansiaDetailReturn } from './useLansiaDetail';
export type {
  UsePemeriksaanKesehatanFormReturn,
  PemeriksaanKesehatanFormData,
  PemeriksaanKesehatanFormErrors,
} from './usePemeriksaanKesehatanForm';
