/**
 * Halaman Pencarian Lansia (Petugas)
 *
 * Halaman untuk mencari lansia berdasarkan ID, nama, atau NIK.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk compose layout dan content
 * - Composition: Menggunakan PetugasLayout untuk konsistensi sidebar
 * - DRY: Reuse Layout component yang sama dengan halaman lain
 * 
 * Design Principles:
 * - Composition Over Inheritance: Wrap content dengan Layout component
 * - SoC: Pisahkan layout structure dari search logic
 * - KISS: Simple composition pattern
 */

import { PetugasLayout } from '@/components/layout';
import { SearchLansiaContent } from '@/components/lansia';

export default function CariLansiaPage() {
  return (
    <PetugasLayout>
      <SearchLansiaContent />
    </PetugasLayout>
  );
}
