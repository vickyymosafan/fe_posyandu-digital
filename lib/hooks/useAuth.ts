'use client';

/**
 * useAuth Hook
 *
 * Custom hook untuk consume AuthContext.
 * Mengikuti prinsip:
 * - SRP: Hanya provide access ke auth context
 * - ISP: Interface yang focused dan tidak terlalu besar
 * - DRY: Reusable di seluruh aplikasi
 */

import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';

/**
 * Hook untuk access auth context
 *
 * @throws Error jika digunakan di luar AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *
 *   return <div>Welcome, {user.nama}!</div>;
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
