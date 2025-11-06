'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Props untuk DateRangeFilter component
 */
interface DateRangeFilterProps {
  /** Tanggal mulai (YYYY-MM-DD) */
  startDate: string;
  /** Tanggal akhir (YYYY-MM-DD) */
  endDate: string;
  /** Handler untuk set tanggal mulai */
  onStartDateChange: (date: string) => void;
  /** Handler untuk set tanggal akhir */
  onEndDateChange: (date: string) => void;
  /** Handler untuk clear filter */
  onClearFilter: () => void;
  /** Disable state */
  disabled?: boolean;
}

/**
 * DateRangeFilter Component
 * 
 * Komponen untuk filter data berdasarkan range tanggal.
 * 
 * Features:
 * - Input tanggal mulai dan akhir
 * - Tombol clear filter
 * - Responsive design
 * - Accessible dengan label
 * 
 * @example
 * ```tsx
 * <DateRangeFilter
 *   startDate={startDate}
 *   endDate={endDate}
 *   onStartDateChange={setStartDate}
 *   onEndDateChange={setEndDate}
 *   onClearFilter={clearFilter}
 * />
 * ```
 */
export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilter,
  disabled = false,
}: DateRangeFilterProps) {
  const hasFilter = startDate || endDate;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Filter Berdasarkan Tanggal
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tanggal Mulai */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Tanggal Mulai
          </label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            disabled={disabled}
            max={endDate || undefined}
            className="w-full"
          />
        </div>

        {/* Tanggal Akhir */}
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Tanggal Akhir
          </label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={disabled}
            min={startDate || undefined}
            className="w-full"
          />
        </div>

        {/* Clear Filter Button */}
        <div className="flex items-end">
          <Button
            variant="secondary"
            onClick={onClearFilter}
            disabled={disabled || !hasFilter}
            className="w-full"
          >
            Hapus Filter
          </Button>
        </div>
      </div>

      {/* Info Text */}
      {hasFilter && (
        <p className="mt-4 text-sm text-neutral-600">
          {startDate && endDate
            ? `Menampilkan data dari ${new Date(startDate).toLocaleDateString('id-ID')} sampai ${new Date(endDate).toLocaleDateString('id-ID')}`
            : startDate
              ? `Menampilkan data dari ${new Date(startDate).toLocaleDateString('id-ID')}`
              : `Menampilkan data sampai ${new Date(endDate).toLocaleDateString('id-ID')}`}
        </p>
      )}
    </div>
  );
}
