/**
 * Halaman Tambah Lansia (Petugas)
 *
 * Halaman untuk pendaftaran lansia baru oleh petugas.
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk layout dan routing
 * - Composition: Menggunakan LansiaForm dan PetugasLayout
 */

import { LansiaForm } from '@/components/lansia';

export default function TambahLansiaPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <LansiaForm />
    </div>
  );
}
