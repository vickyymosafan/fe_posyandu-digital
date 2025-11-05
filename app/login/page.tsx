'use client';

/**
 * Login Page
 *
 * Halaman login untuk Admin dan Petugas.
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya handle presentasi UI
 * - SoC: Form logic di useLoginForm hook
 * - DIP: Bergantung pada abstraksi (hooks), bukan implementasi konkret
 */

import { useLoginForm } from '@/lib/hooks';
import { Input, Button, Card, CardHeader, CardBody } from '@/components/ui';

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* Logo dan title */}
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-neutral-900">Posyandu Lansia</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Silakan login untuk melanjutkan
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              error={errors.email}
              placeholder="email@example.com"
              disabled={isSubmitting}
              required
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
            />

            {/* Password field */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              disabled={isSubmitting}
              required
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting || !!errors.email || !!errors.password}
            >
              {isSubmitting ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          {/* Info text */}
          <p className="text-xs text-neutral-600 text-center mt-6">
            Aplikasi Posyandu Lansia untuk Admin dan Petugas
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
