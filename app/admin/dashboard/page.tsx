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
 * - DRY: Tidak ada duplikasi logic
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

  // Error state - Display prominently
  if (error) {
    console.error('❌ [AdminDashboard] Rendering error state:', error);
    return (
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-900 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-red-800 mb-4">
              <strong>Error:</strong> {error}
            </p>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-4">
              <p className="text-sm text-yellow-900">
                <strong>💡 Troubleshooting:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                <li>Pastikan backend server berjalan di <code className="bg-yellow-100 px-1 rounded">http://localhost:3001</code></li>
                <li>Periksa browser console (F12) untuk error logs lengkap</li>
                <li>Periksa network tab untuk melihat failed requests</li>
                <li>Pastikan Anda sudah login dengan benar</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
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
      <div>
        <h1 className="text-3xl font-bold text-neutral-950 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-neutral-600">
          Ringkasan data dan statistik Posyandu Lansia
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Petugas Aktif"
          value={stats.totalPetugasAktif}
          icon={<UsersIcon size={24} />}
          color="blue"
          description="Petugas yang sedang aktif"
        />
        <StatCard
          label="Total Lansia Terdaftar"
          value={stats.totalLansia}
          icon={<UserGroupIcon size={24} />}
          color="green"
          description="Lansia yang terdaftar di sistem"
        />
        <StatCard
          label="Pemeriksaan Hari Ini"
          value={stats.totalPemeriksaanHariIni}
          icon={<ClipboardCheckIcon size={24} />}
          color="purple"
          description="Pemeriksaan yang dilakukan hari ini"
        />
      </div>

      {/* Trend Chart */}
      <TrendChart
        data={trendData}
        title="Tren Pemeriksaan 7 Hari Terakhir"
        lineColor="#8b5cf6"
        yAxisLabel="Jumlah Pemeriksaan"
      />

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">
          Navigasi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickNavCard
            title="Daftar Petugas"
            description="Kelola data petugas dan akses sistem"
            href={ROUTES.ADMIN.PETUGAS}
            icon={<CogIcon size={24} />}
            color="blue"
          />
          <QuickNavCard
            title="Daftar Lansia"
            description="Lihat dan kelola data lansia terdaftar"
            href={ROUTES.ADMIN.LANSIA}
            icon={<ClipboardListIcon size={24} />}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Admin Dashboard Page
 *
 * Halaman dashboard untuk role Admin dengan fitur:
 * - Statistik petugas aktif, lansia terdaftar, dan pemeriksaan hari ini
 * - Trend chart pemeriksaan 7 hari terakhir
 * - Navigasi cepat ke daftar petugas dan lansia
 * - Loading state dengan skeleton UI
 * - Error handling dengan pesan yang jelas
 * - Sidebar navigation yang konsisten
 *
 * Route: /admin/dashboard
 *
 * Design Principles:
 * - SRP: Page hanya compose layout dan content
 * - Composition: Menggunakan AdminLayout untuk konsistensi
 * - DRY: Reuse layout component di semua halaman admin
 */
export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <ErrorBoundary>
        <AdminDashboardContent />
      </ErrorBoundary>
    </AdminLayout>
  );
}
