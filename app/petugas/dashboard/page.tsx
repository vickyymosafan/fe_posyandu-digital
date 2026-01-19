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
 * - KISS: Simple dashboard tanpa chart (berbeda dari Admin)
 */

import { PetugasLayout } from '@/components/layout';
import { useDashboardStatsLegacy as useDashboardStats, useAuth } from '@/lib/hooks';
import { StatCard, HeroCard, HelperCard, DashboardSkeleton } from '@/components/dashboard';
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
  const { user } = useAuth();

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

  return (
    <div className="space-y-8">
      {/* Header Personalized */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Halo, {user?.nama?.split(' ')[0] || 'Petugas'}! 👋
          </h1>
          <p className="text-neutral-500 mt-1">
            Siap melayani lansia hari ini?
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-800 rounded-full text-sm font-medium w-fit border border-sage-200">
          <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse shadow-sm shadow-green-200" />
          Status: Online
        </div>
      </header>

      {/* Hero Section (Quick Actions) - Fitt's Law */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HeroCard
            title="Daftar Lansia Baru"
            description="Registrasi data lansia baru ke dalam sistem"
            icon={<UserPlusIcon size={32} />}
            href={ROUTES.PETUGAS.LANSIA_TAMBAH}
            variant="sage"
          />
          <HeroCard
            title="Cari Data Pasien"
            description="Temukan data lansia dengan cepat (ID/Nama)"
            icon={<SearchIcon size={32} />}
            href={ROUTES.PETUGAS.LANSIA_CARI}
            variant="blue"
          />
          <HeroCard
            title="Input Pemeriksaan"
            description="Catat hasil pemeriksaan kesehatan terbaru"
            icon={<ClipboardListIcon size={32} />}
            href={ROUTES.PETUGAS.LANSIA} // Redirects to list then detail for input
            variant="sage"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Helper Tips */}
          <HelperCard
            title="Tips Penggunaan Hari Ini"
            tips={[
              "Gunakan 'Cari Data Pasien' untuk menemukan lansia yang sudah terdaftar.",
              "Pastikan semua data vital (tensi, berat, gula darah) terisi dengan benar.",
              "Jika ada keluhan serius, tambahkan catatan khusus pada kolom keterangan."
            ]}
          />

          {/* Statistics */}
          <section>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Ringkasan Harian</h3>
            {!stats ? (
              <div className="card">
                <p className="text-neutral-600">Tidak ada data untuk ditampilkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard
                  label="Total Lansia Terdaftar"
                  value={stats.totalLansia}
                  icon={<UserGroupIcon size={24} />}
                  color="sage"
                  description="Lansia dalam cakupan layanan"
                />
                <StatCard
                  label="Pemeriksaan Hari Ini"
                  value={stats.totalPemeriksaanHariIni}
                  icon={<ClipboardCheckIcon size={24} />}
                  color="orange" // Orange for attention/activity
                  description="Kunjungan pasien hari ini"
                />
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Widgets (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Operational Widget: Jadwal / Antrean */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-neutral-900">Jadwal Posyandu</h3>
              <span className="text-xs font-semibold text-sage-600 bg-sage-50 px-2 py-1 rounded">Terdekat</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 relative overflow-hidden group hover:border-orange-200 transition-colors cursor-pointer">
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white w-14 h-14 rounded-xl shadow-sm border border-orange-100 z-10">
                  <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">JAN</span>
                  <span className="text-2xl font-bold text-neutral-900 leading-none">20</span>
                </div>
                <div className="z-10">
                  <h4 className="font-bold text-neutral-900 text-sm mb-1">Pemeriksaan Rutin</h4>
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Balai Desa Sukamaju
                  </p>
                  <div className="mt-2 flex items-center text-xs font-medium text-orange-700 bg-orange-100/50 px-2 py-0.5 rounded w-fit">
                    ⏰ 08:00 - 11:00 WIB
                  </div>
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/30 rounded-full blur-xl -mr-8 -mt-8" />
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-neutral-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-neutral-50 w-14 h-14 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">FEB</span>
                  <span className="text-2xl font-bold text-neutral-400 leading-none">17</span>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-1">Imunisasi Lansia</h4>
                  <p className="text-xs text-neutral-500">Puskesmas Kecamatan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PetugasDashboardPage() {
  return (
    <PetugasLayout>
      <ErrorBoundary>
        <PetugasDashboardContent />
      </ErrorBoundary>
    </PetugasLayout>
  );
}
