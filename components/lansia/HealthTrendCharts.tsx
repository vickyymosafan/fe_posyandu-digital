'use client';

import { Pemeriksaan } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  filterLastMonths,
  transformToBMIChartData,
  transformToTekananDarahChartData,
  transformToGulaDarahChartData,
  hasChartData,
} from '@/lib/utils/chartData';

/**
 * Component untuk menampilkan grafik tren kesehatan
 * 
 * Responsibilities (SRP):
 * - Display BMI trend chart
 * - Display tekanan darah trend chart
 * - Display gula darah trend chart
 * - Show empty state when no data
 * - Responsive charts
 * 
 * Props (ISP):
 * - pemeriksaan: array of pemeriksaan data
 * - months: number of months to show (default: 6)
 */

interface HealthTrendChartsProps {
  pemeriksaan: Pemeriksaan[];
  months?: number;
}

export function HealthTrendCharts({ pemeriksaan, months = 6 }: HealthTrendChartsProps) {
  // Filter data untuk N bulan terakhir
  const filteredData = filterLastMonths(pemeriksaan, months);

  // Transform data untuk setiap chart
  const bmiData = transformToBMIChartData(filteredData);
  const tekananDarahData = transformToTekananDarahChartData(filteredData);
  const gulaDarahData = transformToGulaDarahChartData(filteredData);

  // Check apakah ada data untuk ditampilkan
  const hasBMIData = hasChartData(bmiData);
  const hasTekananDarahData = tekananDarahData.some(
    (d) => d.sistolik !== null || d.diastolik !== null
  );
  const hasGulaDarahData = gulaDarahData.some(
    (d) => d.gdp !== undefined || d.gds !== undefined || d.duaJpp !== undefined
  );

  if (!hasBMIData && !hasTekananDarahData && !hasGulaDarahData) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">
          Belum ada data pemeriksaan dalam {months} bulan terakhir
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BMI Chart */}
      {hasBMIData && (
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Tren BMI</h3>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                  domain={[15, 35]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value.toFixed(1), 'BMI']}
                />
                <Line
                  type="monotone"
                  dataKey="nilai"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tekanan Darah Chart */}
      {hasTekananDarahData && (
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Tren Tekanan Darah
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tekananDarahData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                  domain={[60, 200]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sistolik"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sistolik"
                />
                <Line
                  type="monotone"
                  dataKey="diastolik"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Diastolik"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gula Darah Chart */}
      {hasGulaDarahData && (
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Tren Gula Darah
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gulaDarahData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#737373"
                  domain={[60, 250]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                  formatter={(value: unknown, name: string) => {
                    if (typeof value !== 'number') return null;
                    return [`${value.toFixed(0)} mg/dL`, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gdp"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="GDP (Puasa)"
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="gds"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="GDS (Sewaktu)"
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="duaJpp"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="2JPP"
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
