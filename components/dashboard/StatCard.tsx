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
    <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-extrabold text-neutral-900 group-hover:text-emerald-700 transition-colors">{value}</p>
          {description && (
            <p className="text-sm text-neutral-500 mt-3 flex items-center gap-1.5 opacity-80">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`p-4 rounded-2xl ${colorClasses[color]} bg-opacity-50 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner`}
          >
            {icon}
          </div>
        )}
      </div>
      {/* Decorative background blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
    </Card>
  );
}
