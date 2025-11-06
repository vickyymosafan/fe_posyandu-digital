import { useState } from 'react';
import { useAuth } from './useAuth';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Interface untuk form data
 */
interface ProfileFormData {
  nama: string;
}

/**
 * Interface untuk form errors
 */
interface ProfileFormErrors {
  nama?: string;
}

/**
 * Interface untuk return value hook
 */
interface UseProfileFormReturn {
  formData: ProfileFormData;
  errors: ProfileFormErrors;
  isSubmitting: boolean;
  handleChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook untuk mengelola form update profil (nama)
 * 
 * Features:
 * - Form state management
 * - Real-time validation
 * - API integration dengan AuthContext.updateNama
 * - Global notification untuk success/error
 * - Auto-update AuthContext setelah berhasil
 * 
 * Follows SRP: Hanya handle logic untuk update nama
 * Follows DRY: Menggunakan global notification system
 * 
 * @returns Object dengan form state dan handlers
 */
export function useProfileForm(): UseProfileFormReturn {
  const { user, updateNama } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<ProfileFormData>({
    nama: user?.nama || '',
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate nama field
   */
  const validateNama = (nama: string): string | undefined => {
    if (!nama.trim()) {
      return 'Nama tidak boleh kosong';
    }
    if (nama.trim().length < 3) {
      return 'Nama minimal 3 karakter';
    }
    if (nama.trim().length > 100) {
      return 'Nama maksimal 100 karakter';
    }
    return undefined;
  };

  /**
   * Handle input change
   */
  const handleChange = (value: string) => {
    setFormData({ nama: value });
    
    // Validate on change
    const error = validateNama(value);
    setErrors({ nama: error });
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const namaError = validateNama(formData.nama);
    if (namaError) {
      setErrors({ nama: namaError });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Use AuthContext's updateNama which handles API call and state update
      await updateNama(formData.nama.trim());
      
      // Show success notification
      showNotification('success', 'Nama berhasil diperbarui');
    } catch (error) {
      const errorMsg = handleAPIError(error);
      
      // Show error notification
      showNotification('error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
