'use client';

import { Pemeriksaan } from '@/types';
import { formatDate, formatBMI, formatTekananDarah, formatLabValue } from '@/lib/utils/formatters';

/**
 * Component untuk menampilkan riwayat pemeriksaan
 * 
 * Responsibilities (SRP):
 * - Display pemeriksaan data dengan format yang sesuai per device
 * - Table view untuk desktop/tablet
 * - Card view untuk mobile
 * - Show empty state when no data
 * 
 * Principles Applied:
 * - SRP: Fokus pada display pemeriksaan data
 * - Responsive Design: Adaptive layout (table vs card)
 * - DRY: Reuse formatting utilities
 * - KISS: Simple conditional rendering
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
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
                Tanggal
              </th>
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
                BMI
              </th>
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
                Tekanan Darah
              </th>
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
                Gula Darah
              </th>
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
                Kolesterol
              </th>
              <th className="text-left py-4 px-6 text-base font-bold text-neutral-800">
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
                <td className="py-4 px-6 text-base text-neutral-900">
                  {formatDate(p.tanggal)}
                </td>
                <td className="py-4 px-6 text-base">
                  {p.bmi ? (
                    <div>
                      <div className="font-medium text-neutral-900">
                        {formatBMI(p.bmi)}
                      </div>
                      {p.kategoriBmi && (
                        <div className="text-sm text-neutral-600 mt-1">
                          {p.kategoriBmi}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-base">
                  {p.sistolik && p.diastolik ? (
                    <div>
                      <div className="font-medium text-neutral-900">
                        {formatTekananDarah(p.sistolik, p.diastolik)}
                      </div>
                      {p.tekananDarah && (
                        <div
                          className={`text-sm mt-1 ${p.tekananDarah.includes('Krisis')
                              ? 'text-red-600 font-bold'
                              : p.tekananDarah.includes('Hipertensi')
                                ? 'text-orange-600 font-medium'
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
                <td className="py-4 px-6 text-base">
                  {p.gulaPuasa || p.gulaSewaktu || p.gula2Jpp ? (
                    <div className="space-y-2">
                      {p.gulaPuasa && (
                        <div className="text-sm">
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
                        <div className="text-sm">
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
                        <div className="text-sm">
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
                <td className="py-4 px-6 text-base">
                  {p.kolesterol ? (
                    <div>
                      <div className="font-medium text-neutral-900">
                        {formatLabValue(p.kolesterol)}
                      </div>
                      {p.klasifikasiKolesterol && (
                        <div className="text-sm text-neutral-600 mt-1">
                          {p.klasifikasiKolesterol}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-base">
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

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {pemeriksaan.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-50 rounded-xl p-4 space-y-3"
          >
            {/* Tanggal */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-xs font-medium text-neutral-600">Tanggal</span>
              <span className="text-sm font-semibold text-neutral-900">
                {formatDate(p.tanggal)}
              </span>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* BMI */}
              <div>
                <div className="text-xs text-neutral-600 mb-1">BMI</div>
                {p.bmi ? (
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatBMI(p.bmi)}
                    </div>
                    {p.kategoriBmi && (
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {p.kategoriBmi}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">-</span>
                )}
              </div>

              {/* Tekanan Darah */}
              <div>
                <div className="text-xs text-neutral-600 mb-1">Tekanan Darah</div>
                {p.sistolik && p.diastolik ? (
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatTekananDarah(p.sistolik, p.diastolik)}
                    </div>
                    {p.tekananDarah && (
                      <div
                        className={`text-xs mt-0.5 ${p.tekananDarah.includes('Krisis')
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
                  <span className="text-sm text-neutral-400">-</span>
                )}
              </div>

              {/* Kolesterol */}
              <div>
                <div className="text-xs text-neutral-600 mb-1">Kolesterol</div>
                {p.kolesterol ? (
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatLabValue(p.kolesterol)}
                    </div>
                    {p.klasifikasiKolesterol && (
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {p.klasifikasiKolesterol}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">-</span>
                )}
              </div>

              {/* Asam Urat */}
              <div>
                <div className="text-xs text-neutral-600 mb-1">Asam Urat</div>
                {p.asamUrat ? (
                  <div className="text-sm font-medium text-neutral-900">
                    {formatLabValue(p.asamUrat)}
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">-</span>
                )}
              </div>
            </div>

            {/* Gula Darah - Full Width */}
            {(p.gulaPuasa || p.gulaSewaktu || p.gula2Jpp) && (
              <div className="pt-2 border-t border-neutral-200">
                <div className="text-xs text-neutral-600 mb-2">Gula Darah</div>
                <div className="space-y-1.5">
                  {p.gulaPuasa && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">GDP:</span>
                      <div className="text-right">
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gulaPuasa)}
                        </span>
                        {p.klasifikasiGula?.gdp && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.gdp})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {p.gulaSewaktu && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">GDS:</span>
                      <div className="text-right">
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gulaSewaktu)}
                        </span>
                        {p.klasifikasiGula?.gds && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.gds})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {p.gula2Jpp && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">2JPP:</span>
                      <div className="text-right">
                        <span className="font-medium text-neutral-900">
                          {formatLabValue(p.gula2Jpp)}
                        </span>
                        {p.klasifikasiGula?.duaJpp && (
                          <span className="text-neutral-600 ml-1">
                            ({p.klasifikasiGula.duaJpp})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
