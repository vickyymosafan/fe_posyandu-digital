import { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';

/**
 * Props untuk QuickNavCard component
 */
export interface QuickNavCardProps {
  /**
   * Judul navigasi
   */
  title: string;

  /**
   * Deskripsi navigasi
   */
  description: string;

  /**
   * URL tujuan
   */
  href: string;

  /**
   * Icon (optional)
   */
  icon?: ReactNode;

  /**
   * Warna accent (optional)
   */
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

/**
 * QuickNavCard Component
 * 
 * Komponen untuk navigasi cepat ke halaman lain.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk menampilkan satu link navigasi
 * - OCP: Mudah diperluas dengan props
 * - DRY: Reusable di berbagai dashboard
 * - Composition: Menggunakan Card dan Link component
 * 
 * @param {QuickNavCardProps} props - Props component
 * @returns {JSX.Element} QuickNavCard component
 * 
 * @example
 * ```tsx
 * <QuickNavCard
 *   title="Daftar Petugas"
 *   description="Kelola data petugas"
 *   href="/admin/petugas"
 *   icon={<UserIcon />}
 *   color="blue"
 * />
 * ```
 */
export function QuickNavCard({
  title,
  description,
  href,
  icon,
  color = 'blue',
}: QuickNavCardProps) {
  // Color mapping untuk accent
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
    green: 'text-green-600 bg-green-50 group-hover:bg-green-100',
    purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100',
    orange: 'text-orange-600 bg-orange-50 group-hover:bg-orange-100',
  };

  return (
    <Link href={href} className="group">
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <div className="flex items-start gap-4">
          {icon && (
            <div
              className={`p-3 rounded-xl ${colorClasses[color]} transition-all duration-300`}
            >
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-neutral-950 transition-colors">
              {title}
            </h4>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
          <svg
            className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
