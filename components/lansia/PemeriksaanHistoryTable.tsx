'use client';

import { Pemeriksaan } from '@/types';
import { formatDate, formatBMI, formatTekananDarah, formatLabValue } from '@/lib/utils/formatters';

/**
 * Component untuk menampilkan tabel riwayat pemeriksaan
 * 
 * Responsibilities (SRP):
 * - Display pemeriksaan data in table format
 * - Responsive table with horizontal scroll on mobile
 * - Show empty state when no data
 * 
 * Props (ISP):
 * - pemeriksaan: array of pemeriksaan data
 */

interface PemeriksaanHistoryTableProps {
  pemeriksaan: Pemeriksaan[];
}

export function PemeriksaanHistoryTable({ pemeriksaan }: PemeriksaanHistoryTableProps) {
  if (pemeriksaan.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Belum ada riwayat pemeriksaan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Tanggal
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              BMI
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Tekanan Darah
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Gula Darah
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Kolesterol
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Asam Urat
            </th>
          </tr>
        </thead>
        <tbody>
          {pemeriksaan.map((p) => (
            <tr
              key={p.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-neutral-900">
                {formatDate(p.tanggal)}
              </td>
              <td className="py-3 px-4 text-sm">
                {p.bmi ? (
                  <div>
                    <div className="font-medium text-neutral-900">
                      {formatBMI(p.bmi)}
                    </div>
                    {p.kategoriBmi && (
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {p.kategoriBmi}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {p.sistolik && p.diastolik ? (
                  <div>
                    <div className="font-medium text-neutral-900">
                      {formatTekananDarah(p.sistolik, p.diastolik)}
                    </div>
                    {p.tekananDarah && (
                      <div
                        className={`text-xs mt-0.5 ${
                          p.tekananDarah.includes('Krisis')
                            ? 'text-red-600 font-medium'
                            : p.tekananDarah.includes('Hipertensi')
                              ? 'text-orange-600'
                              : 'text-neutral-600'
                        }`}
                      >
                        {p.tekananDarah}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {p.gulaPuasa || p.gulaSewaktu || p.gula2Jpp ? (
                  <div className="space-y-1">
                    {p.gulaPuasa && (
                      <div className="text-xs">
                        <span className="text-neutral-600">GDP: </span>
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gulaPuasa)}
                        </span>
                        {p.klasifikasiGula?.gdp && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.gdp})
                          </span>
                        )}
                      </div>
                    )}
                    {p.gulaSewaktu && (
                      <div className="text-xs">
                        <span className="text-neutral-600">GDS: </span>
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gulaSewaktu)}
                        </span>
                        {p.klasifikasiGula?.gds && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.gds})
                          </span>
                        )}
                      </div>
                    )}
                    {p.gula2Jpp && (
                      <div className="text-xs">
                        <span className="text-neutral-600">2JPP: </span>
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gula2Jpp)}
                        </span>
                        {p.klasifikasiGula?.duaJpp && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.duaJpp})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {p.kolesterol ? (
                  <div>
                    <div className="font-medium text-neutral-900">
                      {formatLabValue(p.kolesterol)}
                    </div>
                    {p.klasifikasiKolesterol && (
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {p.klasifikasiKolesterol}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {p.asamUrat ? (
                  <div className="font-medium text-neutral-900">
                    {formatLabValue(p.asamUrat)}
                  </div>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
