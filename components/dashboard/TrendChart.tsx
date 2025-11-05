'use client';

import { Card } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Interface untuk data chart
 */
export interface ChartData {
  tanggal: string;
  jumlah: number;
}

/**
 * Props untuk TrendChart component
 */
export interface TrendChartProps {
  /**
   * Data untuk chart
   */
  data: ChartData[];

  /**
   * Judul chart
   */
  title: string;

  /**
   * Warna line (optional)
   */
  lineColor?: string;

  /**
   * Label untuk Y axis (optional)
   */
  yAxisLabel?: string;
}

/**
 * Custom Tooltip Component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-neutral-200">
        <p className="text-sm text-neutral-600 mb-1">{data.tanggal}</p>
        <p className="text-lg font-bold text-neutral-900">
          {data.jumlah} pemeriksaan
        </p>
      </div>
    );
  }
  return null;
}

/**
 * TrendChart Component
 * 
 * Komponen untuk menampilkan grafik tren menggunakan Recharts.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk menampilkan chart
 * - OCP: Mudah diperluas dengan props (color, label, dll)
 * - DRY: Reusable untuk berbagai jenis trend data
 * - Composition: Menggunakan Card component
 * 
 * @param {TrendChartProps} props - Props component
 * @returns {JSX.Element} TrendChart component
 * 
 * @example
 * ```tsx
 * <TrendChart
 *   data={trendData}
 *   title="Tren Pemeriksaan 7 Hari Terakhir"
 *   lineColor="#0ea5e9"
 *   yAxisLabel="Jumlah"
 * />
 * ```
 */
export function TrendChart({
  data,
  title,
  lineColor = '#0ea5e9',
  yAxisLabel = 'Jumlah',
}: TrendChartProps) {
  // Jika tidak ada data, tampilkan empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-neutral-500">Tidak ada data untuk ditampilkan</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="tanggal"
              stroke="#737373"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#737373"
              style={{ fontSize: '12px' }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '12px', fill: '#737373' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="jumlah"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
