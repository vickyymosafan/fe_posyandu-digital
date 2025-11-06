/**
 * Halaman Tambah Lansia (Petugas)
 *
 * Halaman untuk pendaftaran lansia baru oleh petugas.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk compose layout dan content
 * - Composition: Menggunakan PetugasLayout untuk konsistensi sidebar
 * - DRY: Reuse Layout component yang sama dengan halaman lain
 * 
 * Design Principles:
 * - Composition Over Inheritance: Wrap content dengan Layout component
 * - SoC: Pisahkan layout structure dari form logic
 * - KISS: Simple composition pattern
 */

import { PetugasLayout } from '@/components/layout';
import { LansiaForm } from '@/components/lansia';

export default function TambahLansiaPage() {
  return (
    <PetugasLayout>
      <div className="max-w-3xl mx-auto">
        <LansiaForm />
      </div>
    </PetugasLayout>
  );
}
