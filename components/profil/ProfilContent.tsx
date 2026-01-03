'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useProfileForm } from '@/lib/hooks/useProfileForm';
import { usePasswordForm } from '@/lib/hooks/usePasswordForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * ProfilContent Component
 * 
 * Komponen untuk menampilkan dan mengedit profil pengguna.
 * Updated for accessibility: larger fonts, better spacing, and standard card styling.
 */
export function ProfilContent() {
  const { user } = useAuth();

  const {
    formData: profileFormData,
    errors: profileErrors,
    isSubmitting: isProfileSubmitting,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
  } = useProfileForm();

  const {
    formData: passwordFormData,
    errors: passwordErrors,
    isSubmitting: isPasswordSubmitting,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    handleChange: handlePasswordChange,
    toggleOldPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit: handlePasswordSubmit,
  } = usePasswordForm();

  if (!user) {
    return (
      <div className="card">
        <p className="text-neutral-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <h2 className="text-3xl font-bold text-neutral-950 mb-3">
          Profil Pengguna
        </h2>
        <p className="text-lg text-neutral-600">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      {/* Informasi Akun */}
      <div className="card">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
          Informasi Akun
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-neutral-700 mb-2">
              Email
            </label>
            <p className="text-xl text-neutral-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-lg font-semibold text-neutral-700 mb-2">
              Role
            </label>
            <p className="text-xl text-neutral-900">
              {user.role === 'ADMIN' ? 'Administrator' : 'Petugas'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Update Nama */}
      <div className="card">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
          Ubah Nama
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nama"
              className="block text-lg font-semibold text-neutral-700 mb-2"
            >
              Nama Lengkap
            </label>
            <Input
              id="nama"
              type="text"
              value={profileFormData.nama}
              onChange={(e) => handleProfileChange(e.target.value)}
              error={profileErrors.nama}
              disabled={isProfileSubmitting}
              placeholder="Masukkan nama lengkap"
              className="text-lg"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isProfileSubmitting || !!profileErrors.nama}
            className="w-full sm:w-auto"
          >
            {isProfileSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </div>

      {/* Form Update Password */}
      <div className="card">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">
          Ubah Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Password Lama */}
          <div>
            <label
              htmlFor="kataSandiLama"
              className="block text-lg font-semibold text-neutral-700 mb-2"
            >
              Password Lama
            </label>
            <div className="relative">
              <Input
                id="kataSandiLama"
                type={showOldPassword ? 'text' : 'password'}
                value={passwordFormData.kataSandiLama}
                onChange={(e) =>
                  handlePasswordChange('kataSandiLama', e.target.value)
                }
                error={passwordErrors.kataSandiLama}
                disabled={isPasswordSubmitting}
                placeholder="Masukkan password lama"
                className="text-lg pr-12"
              />
              <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 p-2"
                aria-label={showOldPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                <span className="text-xl">{showOldPassword ? '👁️' : '👁️‍🗨️'}</span>
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div>
            <label
              htmlFor="kataSandiBaru"
              className="block text-lg font-semibold text-neutral-700 mb-2"
            >
              Password Baru
            </label>
            <div className="relative">
              <Input
                id="kataSandiBaru"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordFormData.kataSandiBaru}
                onChange={(e) =>
                  handlePasswordChange('kataSandiBaru', e.target.value)
                }
                error={passwordErrors.kataSandiBaru}
                disabled={isPasswordSubmitting}
                placeholder="Masukkan password baru"
                className="text-lg pr-12"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 p-2"
                aria-label={showNewPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                <span className="text-xl">{showNewPassword ? '👁️' : '👁️‍🗨️'}</span>
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 pl-1">
              Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
            </p>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label
              htmlFor="konfirmasiKataSandi"
              className="block text-lg font-semibold text-neutral-700 mb-2"
            >
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <Input
                id="konfirmasiKataSandi"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordFormData.konfirmasiKataSandi}
                onChange={(e) =>
                  handlePasswordChange('konfirmasiKataSandi', e.target.value)
                }
                error={passwordErrors.konfirmasiKataSandi}
                disabled={isPasswordSubmitting}
                placeholder="Konfirmasi password baru"
                className="text-lg pr-12"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 p-2"
                aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                <span className="text-xl">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={
              isPasswordSubmitting ||
              !!passwordErrors.kataSandiLama ||
              !!passwordErrors.kataSandiBaru ||
              !!passwordErrors.konfirmasiKataSandi
            }
            className="w-full sm:w-auto mt-4"
          >
            {isPasswordSubmitting ? 'Menyimpan...' : 'Ubah Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
