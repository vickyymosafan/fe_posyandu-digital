'use client';

/**
 * Petugas Dashboard Page
 *
 * Dashboard untuk role PETUGAS.
 * Placeholder untuk testing authentication.
 */

import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function PetugasDashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Dashboard Petugas</h1>
          <div className="space-y-2 mb-6">
            <p>
              <strong>Nama:</strong> {user?.nama}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
          </div>
          <button onClick={handleLogout} className="btn-primary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
