'use client';

/**
 * Petugas Dashboard Page
 *
 * Dashboard untuk role PETUGAS dengan statistik dan navigasi cepat.
 *
 * Mengikuti prinsip:
 * - SRP: Page hanya bertanggung jawab untuk compose components
 * - SoC: Data fetching di hook, UI di components
 * - Composition: Menggunakan reusable components dan PetugasLayout
 * - DRY: Reuse existing components dan hooks
 * - KISS: Simple dashboard tanpa chart (berbeda dari Admin)
 */

import { PetugasLayout } from '@/components/layout';
import { useDashboardStats } from '@/lib/hooks';
import { StatCard, QuickNavCard, DashboardSkeleton } from '@/components/dashboard';
import {
  UserGroupIcon,
  ClipboardCheckIcon,
  UserPlusIcon,
  SearchIcon,
  ClipboardListIcon,
} from '@/components/icons/DashboardIcons';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ROUTES } from '@/lib/constants/navigation';

function PetugasDashboardContent() {
  const { stats, isLoading, error } = useDashboardStats();

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
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
            <p className="text-red-800 mb-4">{error}</p>
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
          Dashboard Petugas
        </h1>
        <p className="text-neutral-600">
          Ringkasan data dan akses cepat untuk kegiatan harian
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">
          Navigasi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickNavCard
            title="Pendaftaran Lansia"
            description="Daftarkan lansia baru ke sistem"
            href={ROUTES.PETUGAS.LANSIA_TAMBAH}
            icon={<UserPlusIcon size={24} />}
            color="blue"
          />
          <QuickNavCard
            title="Pencarian Lansia"
            description="Cari data lansia berdasarkan ID, nama, atau NIK"
            href={ROUTES.PETUGAS.LANSIA_CARI}
            icon={<SearchIcon size={24} />}
            color="green"
          />
          <QuickNavCard
            title="Daftar Lansia"
            description="Lihat semua data lansia terdaftar"
            href={ROUTES.PETUGAS.LANSIA}
            icon={<ClipboardListIcon size={24} />}
            color="purple"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Tips Penggunaan
            </h3>
            <ul className="text-base text-blue-900 space-y-2 mt-2">
              <li>• Gunakan <strong>Pencarian Lansia</strong> untuk menemukan data dengan cepat</li>
              <li>• Setelah menemukan lansia, Anda dapat langsung input pemeriksaan dari halaman detail</li>
              <li>• Data akan tersimpan secara otomatis dan dapat diakses kapan saja</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Petugas Dashboard Page
 *
 * Halaman dashboard untuk role Petugas dengan fitur:
 * - Statistik lansia terdaftar dan pemeriksaan hari ini
 * - Navigasi cepat ke pendaftaran, pencarian, dan daftar lansia
 * - Loading state dengan skeleton UI
 * - Error handling dengan pesan yang jelas
 * - Sidebar navigation yang konsisten
 *
 * Route: /petugas/dashboard
 *
 * Design Principles:
 * - SRP: Page hanya compose layout dan content
 * - Composition: Menggunakan PetugasLayout untuk konsistensi
 * - DRY: Reuse layout component di semua halaman petugas
 *
 * Requirements:
 * - Requirement 3.1: Dashboard dengan ringkasan data
 * - Requirement 3.2: Fetch data statistik dari Backend API
 * - Requirement 3.4: Navigasi cepat ke fitur utama
 * - Requirement 3.5: Loading state dengan skeleton UI
 */
export default function PetugasDashboardPage() {
  return (
    <PetugasLayout>
      <ErrorBoundary>
        <PetugasDashboardContent />
      </ErrorBoundary>
    </PetugasLayout>
  );
}
