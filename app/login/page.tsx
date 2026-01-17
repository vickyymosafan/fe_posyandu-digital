'use client';

/**
 * Login Page
 *
 * Halaman login yang diremajakan untuk Admin dan Petugas.
 * Menggunakan layout split-screen dengan estetika Posyandu modern.
 */

import { useLoginForm } from '@/lib/hooks';
import { Input, Button } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const {
    formData,
    errors,
    isSubmitting,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Kolom Kiri - Gambar & Branding (Hanya Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
        {/* Gambar Latar */}
        <div className="absolute inset-0">
          <Image
            src="/images/side-kiri-login.webp"
            alt="Lansia Bahagia di Posyandu"
            fill
            className="object-cover opacity-90"
            priority
            quality={90}
            unoptimized
          />
          {/* Overlay Gradient Hijau */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-emerald-900/30 mix-blend-multiply" />
        </div>

        {/* Konten Branding overlay */}
        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 overflow-hidden">
              {/* Logo Image */}
              <Image
                src="/icons/icon-192x192.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-bold text-lg tracking-wide">Posyandu Lansia</span>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold leading-tight mb-4 text-emerald-50">
              Melayani dengan Hati, <br />
              Menjaga Usia Emas
            </h2>
            <p className="text-emerald-100 text-lg max-w-md">
              Sistem manajemen kesehatan terpadu untuk meningkatkan kualitas hidup lansia Indonesia.
            </p>
          </div>

          <div className="text-sm text-emerald-200/60 font-medium">
            © 2026 Posyandu Digital Indonesia
          </div>
        </div>
      </div>

      {/* Kolom Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-20 xl:px-32 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Header Mobile Only Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-100/50 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/icons/icon-192x192.png"
                alt="Logo"
                width={48}
                height={48}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Judul Form */}
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Selamat Datang</h1>
            <p className="text-neutral-500">
              Masuk untuk mengakses dashboard petugas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                error={errors.email}
                placeholder="petugas@posyandu.id"
                disabled={isSubmitting}
                required
                className="bg-neutral-50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                labelClassName="text-neutral-700 font-semibold"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={errors.password}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  required
                  className="bg-neutral-50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  labelClassName="text-neutral-700 font-semibold"
                  rightIcon={
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-neutral-400 hover:text-emerald-600 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  }
                />

                {/* Lupa Password Link - Opsional, placeholder untuk masa depan */}
                <div className="flex justify-end mt-1">
                  <Link href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    Lupa password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              className="mt-2 rounded-xl h-12 text-base shadow-emerald-200"
              disabled={isSubmitting || !!errors.email || !!errors.password}
            >
              {isSubmitting ? 'Memproses Masuk...' : 'Masuk Dashboard'}
            </Button>
          </form>

          {/* Footer Mobile/Desktop */}
          <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Butuh bantuan akses?{' '}
              <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                Hubungi Administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
