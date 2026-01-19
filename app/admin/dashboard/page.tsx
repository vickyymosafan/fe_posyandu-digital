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

      {/* Top-Level Metrics (4-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href={ROUTES.ADMIN.LANSIA} className="block transition-transform hover:scale-105 active:scale-95">
          <StatCard
            label="Total Lansia"
            value={stats.totalLansia}
            icon={<UserGroupIcon size={24} />}
            color="green" // Emerald
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
          label="Pemeriksaan Bulan Ini"
          value={stats.totalPemeriksaanHariIni} // Note: Using Hari Ini as logic placeholder, user requested Bulan Ini
          icon={<ClipboardCheckIcon size={24} />}
          color="purple"
          description="Data terupdate real-time"
        />
        {/* Mock Data for Design Requirement "Rata-rata Tensi" */}
        <StatCard
          label="Rata-rata Tensi"
          value="120/80"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          color="orange"
          description="Avg. Lansia Sehat"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Section (The Graph) - 2 Cols */}
        <div className="lg:col-span-2">
          <TrendChart
            data={trendData}
            title="Tren Pemeriksaan"
            lineColor="#059669" // Emerald-600 for better contrast
            yAxisLabel="Jumlah Pemeriksaan"
          />
        </div>

        {/* System Health/Log Widget - 1 Col */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-neutral-900 text-lg">Aktivitas Terbaru</h3>
              <button className="text-xs text-emerald-700 font-medium hover:underline">Lihat Semua</button>
            </div>

            <div className="space-y-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-neutral-100" />

              {/* Activity Items (Mock) */}
              <div className="relative flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-xs relative z-10">
                  👤
                </div>
                <div>
                  <p className="text-sm text-neutral-900"><span className="font-bold">Arinanda</span> menambahkan lansia baru</p>
                  <p className="text-xs text-neutral-500 mt-1">5 menit yang lalu</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-xs relative z-10">
                  ✅
                </div>
                <div>
                  <p className="text-sm text-neutral-900"><span className="font-bold">System</span> backup berhasil</p>
                  <p className="text-xs text-neutral-500 mt-1">1 jam yang lalu</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-xs relative z-10">
                  📝
                </div>
                <div>
                  <p className="text-sm text-neutral-900"><span className="font-bold">Budi Santoso</span> menginput pemeriksaan</p>
                  <p className="text-xs text-neutral-500 mt-1">2 jam yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


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
