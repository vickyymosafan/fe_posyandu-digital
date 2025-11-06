/**
 * Halaman Pencarian Lansia (Petugas)
 *
 * Halaman untuk mencari lansia berdasarkan ID, nama, atau NIK.
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk layout dan routing
 * - Composition: Menggunakan SearchLansiaContent
 */

import { SearchLansiaContent } from '@/components/lansia';

export default function CariLansiaPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SearchLansiaContent />
    </div>
  );
}
