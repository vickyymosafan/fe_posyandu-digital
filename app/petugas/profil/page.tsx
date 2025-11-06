import { Metadata } from 'next';
import { PetugasLayout } from '@/components/layout/PetugasLayout';
import { ProfilContent } from '@/components/profil/ProfilContent';

/**
 * Metadata untuk halaman Profil Petugas
 */
export const metadata: Metadata = {
  title: 'Profil | Posyandu Lansia',
  description: 'Kelola profil dan keamanan akun Anda',
};

/**
 * Halaman Profil (Petugas)
 * 
 * Halaman untuk mengelola profil pengguna dengan fitur:
 * - Display informasi akun (email, role)
 * - Update nama
 * - Update password
 * - Real-time validation
 * - Success/error notifications
 * 
 * Route: /petugas/profil
 * 
 * Requirements:
 * - Requirement 19.1: Halaman profil dengan informasi nama, email, role
 * - Requirement 19.2: Form ubah nama
 * - Requirement 19.3: Form ubah password
 * - Requirement 19.4: Submit ubah nama ke profileAPI.updateNama
 * - Requirement 19.5: Submit ubah password ke profileAPI.updatePassword
 * - Requirement 19.6: Validasi password baru (min 8 chars, letters, numbers, symbols)
 */
export default function PetugasProfilPage() {
  return (
    <PetugasLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-lg">
        <ProfilContent />
      </div>
    </PetugasLayout>
  );
}
