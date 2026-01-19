'use client';

import { Card } from '@/components/ui';
import {
  AreaChart,
  Area,
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
   * Warna chart (stroke & gradient)
   */
  lineColor?: string;

  /**
   * Label untuk Y axis (optional)
   */
  yAxisLabel?: string;
}

/**
 * Interface untuk CustomTooltip props
 * Menggantikan 'any' type untuk type safety
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
}

/**
 * Custom Tooltip Component
 */
function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-500 mb-1">{data.tanggal}</p>
        <p className="text-2xl font-bold text-neutral-900">
          {data.jumlah} <span className="text-sm font-normal text-neutral-500">pemeriksaan</span>
        </p>
      </div>
    );
  }
  return null;
}

/**
 * TrendChart Component
 * 
 * Komponen untuk menampilkan grafik tren menggunakan Area Chart dengan gradient.
 * 
 * Principles:
 * - Visual: Smooth area chart for better data visualization
 * - Responsive: Adapts to container size
 * - Accessible: Clear tooltip and labels
 * 
 * @param {TrendChartProps} props - Props component
 */
export function TrendChart({
  data,
  title,
  lineColor = '#10b981', // Default to Emerald if not specified
  yAxisLabel = 'Jumlah',
}: TrendChartProps) {
  // Jika tidak ada data, tampilkan empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-neutral-900 mb-6">{title}</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-lg text-neutral-500">Tidak ada data untuk ditampilkan</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
        {/* Placeholder for Filters as per design requirements */}
        <div className="flex gap-2 text-sm bg-neutral-100 p-1 rounded-lg">
          <button className="px-3 py-1 bg-white shadow-sm rounded-md font-medium text-neutral-900">7 Hari</button>
          <button className="px-3 py-1 text-neutral-500 hover:text-neutral-900">Bulan Ini</button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis
              dataKey="tanggal"
              stroke="#a3a3a3"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#a3a3a3"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area
              type="monotone"
              dataKey="jumlah"
              stroke={lineColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorJumlah)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
