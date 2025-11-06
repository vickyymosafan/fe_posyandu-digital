import React from 'react';

/**
 * InfoRow Component
 * 
 * Komponen reusable untuk menampilkan pasangan label-value
 * 
 * Principles:
 * - SRP: Hanya bertanggung jawab untuk display label-value pair
 * - OCP: Extensible via props tanpa modifikasi internal
 * - DRY: Menghindari duplikasi pattern label-value di seluruh aplikasi
 * - KISS: Implementasi sederhana dan mudah dipahami
 */

interface InfoRowProps {
  /** Label yang ditampilkan */
  label: string;
  /** Value yang ditampilkan */
  value: React.ReactNode;
  /** Span full width di grid (untuk alamat, dll) */
  fullWidth?: boolean;
  /** Custom className untuk styling tambahan */
  className?: string;
}

export function InfoRow({ 
  label, 
  value, 
  fullWidth = false,
  className = '' 
}: InfoRowProps) {
  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} ${className}`.trim()}>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
      </label>
      <div className="text-base text-neutral-900 break-words">
        {value}
      </div>
    </div>
  );
}
