import { Pemeriksaan } from '@/types';
import { subMonths, isAfter, format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Utility untuk memproses data pemeriksaan menjadi data chart
 * 
 * Responsibilities (SRP):
 * - Filter data berdasarkan range tanggal
 * - Transform data untuk format chart
 * - Sort data by date
 */

export interface ChartDataPoint {
  tanggal: string;
  nilai: number | null;
  label?: string;
}

/**
 * Filter pemeriksaan dalam N bulan terakhir
 * 
 * @param pemeriksaan - Array pemeriksaan
 * @param months - Jumlah bulan ke belakang (default: 6)
 * @returns Pemeriksaan yang sudah difilter dan disort
 */
export function filterLastMonths(
  pemeriksaan: Pemeriksaan[],
  months: number = 6
): Pemeriksaan[] {
  const cutoffDate = subMonths(new Date(), months);
  
  return pemeriksaan
    .filter((p) => {
      const tanggal = new Date(p.tanggal);
      return isAfter(tanggal, cutoffDate);
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
}

/**
 * Transform pemeriksaan data ke BMI chart data
 * 
 * @param pemeriksaan - Array pemeriksaan
 * @returns Array data point untuk chart BMI
 */
export function transformToBMIChartData(
  pemeriksaan: Pemeriksaan[]
): ChartDataPoint[] {
  return pemeriksaan.map((p) => ({
    tanggal: format(new Date(p.tanggal), 'dd MMM', { locale: id }),
    nilai: p.bmi || null,
    label: p.kategoriBmi,
  }));
}

/**
 * Transform pemeriksaan data ke tekanan darah chart data
 * 
 * @param pemeriksaan - Array pemeriksaan
 * @returns Array data point untuk chart tekanan darah (sistolik dan diastolik)
 */
export function transformToTekananDarahChartData(
  pemeriksaan: Pemeriksaan[]
): Array<{
  tanggal: string;
  sistolik: number | null;
  diastolik: number | null;
  label?: string;
}> {
  return pemeriksaan.map((p) => ({
    tanggal: format(new Date(p.tanggal), 'dd MMM', { locale: id }),
    sistolik: p.sistolik || null,
    diastolik: p.diastolik || null,
    label: p.tekananDarah,
  }));
}

/**
 * Transform pemeriksaan data ke gula darah chart data
 * 
 * Catatan: Menggunakan undefined untuk nilai yang tidak ada agar recharts
 * tidak menampilkan titik pada chart. Nilai 0 akan tetap ditampilkan.
 * 
 * @param pemeriksaan - Array pemeriksaan
 * @returns Array data point untuk chart gula darah (GDP, GDS, 2JPP)
 */
export function transformToGulaDarahChartData(
  pemeriksaan: Pemeriksaan[]
): Array<{
  tanggal: string;
  gdp: number | undefined;
  gds: number | undefined;
  duaJpp: number | undefined;
}> {
  return pemeriksaan.map((p) => ({
    tanggal: format(new Date(p.tanggal), 'dd MMM', { locale: id }),
    gdp: p.gulaPuasa ?? undefined,
    gds: p.gulaSewaktu ?? undefined,
    duaJpp: p.gula2Jpp ?? undefined,
  }));
}

/**
 * Check apakah ada data untuk chart
 * 
 * @param data - Array data point
 * @returns true jika ada minimal 1 data point dengan nilai
 */
export function hasChartData(data: ChartDataPoint[]): boolean {
  return data.some((d) => d.nilai !== null);
}
