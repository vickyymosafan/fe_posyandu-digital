import { redirect } from 'next/navigation';

/**
 * Root Page - Redirect to Login
 * 
 * Halaman root (/) akan redirect ke /login.
 * Middleware akan handle authentication dan redirect ke dashboard yang sesuai
 * berdasarkan role user (admin atau petugas).
 */
export default function Home() {
  redirect('/login');
}
