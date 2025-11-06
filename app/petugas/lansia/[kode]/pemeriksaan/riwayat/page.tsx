import { Metadata } from 'next';
import { PetugasLayout } from '@/components/layout/PetugasLayout';
import { RiwayatPemeriksaanContent } from '@/components/pemeriksaan/RiwayatPemeriksaanContent';

/**
 * Metadata untuk halaman Riwayat Pemeriksaan
 */
export const metadata: Metadata = {
  title: 'Riwayat Pemeriksaan | Posyandu Lansia',
  description: 'Riwayat pemeriksaan kesehatan lansia dengan filter tanggal',
};

/**
 * Props untuk RiwayatPemeriksaanPage
 */
interface RiwayatPemeriksaanPageProps {
  params: {
    kode: string;
  };
}

/**
 * Halaman Riwayat Pemeriksaan (Petugas)
 * 
 * Halaman untuk menampilkan riwayat pemeriksaan lansia dengan fitur:
 * - Filter berdasarkan range tanggal
 * - Tabel riwayat pemeriksaan
 * - Grafik tren kesehatan (BMI, tekanan darah, gula darah)
 * - Loading dan error state
 * 
 * Route: /petugas/lansia/[kode]/pemeriksaan/riwayat
 * 
 * Requirements:
 * - Requirement 20.1: Buat halaman riwayat dengan tabel pemeriksaan
 * - Requirement 20.2: Fetch data dari lansiaAPI.getPemeriksaan
 * - Requirement 20.3: Tampilkan grafik tren dengan Recharts
 * - Requirement 20.4: Implementasi filter by tanggal
 * - Requirement 20.5: Tampilkan loading state
 * 
 * @param params - Route params dengan kode lansia
 */
export default function RiwayatPemeriksaanPage({
  params,
}: RiwayatPemeriksaanPageProps) {
  const { kode } = params;

  return (
    <PetugasLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* 
          RiwayatPemeriksaanContent akan:
          1. Fetch data lansia untuk mendapatkan nama
          2. Fetch data pemeriksaan
          3. Render filter, tabel, dan grafik
        */}
        <RiwayatPemeriksaanContent kode={kode} />
      </div>
    </PetugasLayout>
  );
}
