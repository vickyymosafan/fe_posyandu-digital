import { ReactNode } from 'react';
import { Card } from '@/components/ui';

/**
 * Props untuk StatCard component
 */
export interface StatCardProps {
  /**
   * Label statistik
   */
  label: string;

  /**
   * Nilai statistik
   */
  value: number | string;

  /**
   * Icon (optional)
   */
  icon?: ReactNode;

  /**
   * Warna accent (optional)
   */
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'sage' | 'emerald';

  /**
   * Deskripsi tambahan (optional)
   */
  description?: string;
}

/**
 * StatCard Component
 * 
 * Komponen reusable untuk menampilkan statistik dalam bentuk card.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk menampilkan satu statistik
 * - OCP: Mudah diperluas dengan props tanpa ubah kode internal
 * - DRY: Reusable di berbagai dashboard
 * - Composition: Menggunakan Card component yang sudah ada
 * 
 * @param {StatCardProps} props - Props component
 * @returns {JSX.Element} StatCard component
 * 
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Petugas Aktif"
 *   value={25}
 *   icon={<UserIcon />}
 *   color="blue"
 *   description="Petugas yang sedang aktif"
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  icon,
  color = 'blue',
  description,
}: StatCardProps) {
  // Color mapping untuk accent
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-emerald-600 bg-emerald-50', // Updated to Emerald for Admin
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-coral-500 bg-coral-50', // Updated to Coral
    sage: 'text-sage-600 bg-sage-50', // New for Petugas
    emerald: 'text-emerald-600 bg-emerald-50', // New for Admin
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-base text-neutral-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          {description && (
            <p className="text-sm text-neutral-500 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl ${colorClasses[color]} transition-all duration-300`}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
