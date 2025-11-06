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
export type {
  DashboardStats,
  TrendData,
  UseDashboardStatsReturn,
} from './useDashboardStats';
