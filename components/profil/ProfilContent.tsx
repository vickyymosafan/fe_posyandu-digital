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
 * 
 * Features:
 * - Display user information (nama, email, role)
 * - Form update nama
 * - Form update password
 * - Real-time validation
 * - Success/error messages
 * - Password visibility toggle
 * 
 * Follows SoC principle:
 * - Hook layer: useProfileForm, usePasswordForm (logic)
 * - Component layer: ProfilContent (UI)
 * 
 * @example
 * ```tsx
 * <ProfilContent />
 * ```
 */
export function ProfilContent() {
  const { user } = useAuth();
  
  const {
    formData: profileFormData,
    errors: profileErrors,
    isSubmitting: isProfileSubmitting,
    successMessage: profileSuccessMessage,
    errorMessage: profileErrorMessage,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
  } = useProfileForm();
  
  const {
    formData: passwordFormData,
    errors: passwordErrors,
    isSubmitting: isPasswordSubmitting,
    successMessage: passwordSuccessMessage,
    errorMessage: passwordErrorMessage,
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2">
          Profil Pengguna
        </h2>
        <p className="text-neutral-600">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      {/* Informasi Akun */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          Informasi Akun
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <p className="text-base text-neutral-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Role
            </label>
            <p className="text-base text-neutral-900">
              {user.role === 'ADMIN' ? 'Administrator' : 'Petugas'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Update Nama */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          Ubah Nama
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-neutral-700 mb-2"
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
            />
          </div>

          {/* Success Message */}
          {profileSuccessMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">{profileSuccessMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {profileErrorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">{profileErrorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isProfileSubmitting || !!profileErrors.nama}
            className="w-full sm:w-auto"
          >
            {isProfileSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </div>

      {/* Form Update Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          Ubah Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Password Lama */}
          <div>
            <label
              htmlFor="kataSandiLama"
              className="block text-sm font-medium text-neutral-700 mb-2"
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
              />
              <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showOldPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div>
            <label
              htmlFor="kataSandiBaru"
              className="block text-sm font-medium text-neutral-700 mb-2"
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
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-600">
              Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
            </p>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label
              htmlFor="konfirmasiKataSandi"
              className="block text-sm font-medium text-neutral-700 mb-2"
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
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {passwordSuccessMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">{passwordSuccessMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {passwordErrorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">{passwordErrorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={
              isPasswordSubmitting ||
              !!passwordErrors.kataSandiLama ||
              !!passwordErrors.kataSandiBaru ||
              !!passwordErrors.konfirmasiKataSandi
            }
            className="w-full sm:w-auto"
          >
            {isPasswordSubmitting ? 'Menyimpan...' : 'Ubah Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
