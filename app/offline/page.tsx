'use client';

/**
 * Offline Fallback Page
 *
 * Halaman ini ditampilkan ketika pengguna offline dan mencoba mengakses
 * halaman yang belum di-cache oleh service worker.
 *
 * Mengikuti prinsip:
 * - SRP: Hanya menampilkan status offline
 * - KISS: UI sederhana dan informatif
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        {/* Icon Offline */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Judul */}
        <h1 className="text-3xl font-bold text-neutral-950 mb-4">Anda Sedang Offline</h1>

        {/* Deskripsi */}
        <p className="text-base text-neutral-700 mb-6">
          Koneksi internet tidak tersedia. Beberapa fitur mungkin tidak dapat diakses saat
          offline.
        </p>

        {/* Informasi */}
        <div className="card text-left">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">Yang Dapat Anda Lakukan:</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-neutral-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Lihat data yang sudah dimuat sebelumnya</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-neutral-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Periksa koneksi internet Anda</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-neutral-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Coba lagi setelah koneksi kembali</span>
            </li>
          </ul>
        </div>

        {/* Tombol Coba Lagi */}
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-6"
          aria-label="Muat ulang halaman"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
