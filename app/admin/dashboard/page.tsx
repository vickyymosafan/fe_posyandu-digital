'use client';

/**
 * Admin Dashboard Page
 *
 * Dashboard untuk role ADMIN dengan statistik dan navigasi cepat.
 *
 * Mengikuti prinsip:
 * - SRP: Page hanya bertanggung jawab untuk compose components
 * - SoC: Data fetching di hook, UI di components
 * - Composition: Menggunakan reusable components dan AdminLayout
 * - Design: Data-driven, trustworthy, organized (Emerald Theme)
 */

import { AdminLayout } from '@/components/layout';
import { useDashboardStatsLegacy as useDashboardStats } from '@/lib/hooks';
import {
  StatCard,
  TrendChart,
  QuickNavCard,
  DashboardSkeleton,
} from '@/components/dashboard';
import {
  UsersIcon,
  UserGroupIcon,
  ClipboardCheckIcon,
  CogIcon,
  ClipboardListIcon,
} from '@/components/icons/DashboardIcons';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ROUTES } from '@/lib/constants/navigation';

function AdminDashboardContent() {
  const { stats, trendData, isLoading, error } = useDashboardStats();

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-xl font-bold text-red-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  // No data state
  if (!stats) {
    return (
      <div className="card">
        <p className="text-neutral-600">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-neutral-600">
            Executive overview dan manajemen sistem Posyandu
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-neutral-500">Update Terakhir</p>
          <p className="font-bold text-neutral-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Top-Level Metrics (3-Column Grid - Real Data Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href={ROUTES.ADMIN.LANSIA} className="block transition-transform hover:scale-105 active:scale-95">
          <StatCard
            label="Total Lansia"
            value={stats.totalLansia}
            icon={<UserGroupIcon size={24} />}
            color="green"
            description="Klik untuk lihat detail"
          />
        </a>
        <a href={ROUTES.ADMIN.PETUGAS} className="block transition-transform hover:scale-105 active:scale-95">
          <StatCard
            label="Petugas Aktif"
            value={stats.totalPetugasAktif}
            icon={<UsersIcon size={24} />}
            color="blue"
            description="Klik untuk kelola petugas"
          />
        </a>
        <StatCard
          label="Pemeriksaan Hari Ini"
          value={stats.totalPemeriksaanHariIni}
          icon={<ClipboardCheckIcon size={24} />}
          color="purple"
          description="Data terupdate real-time"
        />
      </div>

      {/* Trend Chart (Full Width - Real Data) */}
      <TrendChart
        data={trendData}
        title="Tren Pemeriksaan 7 Hari Terakhir"
        lineColor="#059669"
        yAxisLabel="Jumlah Pemeriksaan"
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <ErrorBoundary>
        <AdminDashboardContent />
      </ErrorBoundary>
    </AdminLayout>
  );
}
