import { Card } from '@/components/ui';

/**
 * DashboardSkeleton Component
 * 
 * Komponen skeleton loading untuk dashboard.
 * Menampilkan placeholder saat data sedang dimuat.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk menampilkan loading state
 * - DRY: Reusable skeleton pattern
 * - UX: Memberikan feedback visual yang baik saat loading
 * 
 * @returns {JSX.Element} DashboardSkeleton component
 * 
 * @example
 * ```tsx
 * {isLoading ? <DashboardSkeleton /> : <DashboardContent />}
 * ```
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-neutral-200 rounded-xl"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <div className="space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      </Card>

      {/* Quick Nav Skeleton */}
      <div>
        <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
