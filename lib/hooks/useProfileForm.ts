import { useState } from 'react';
import { useAuth } from './useAuth';
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
  successMessage: string | null;
  errorMessage: string | null;
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
 * - Success/error message handling
 * - Auto-update AuthContext setelah berhasil
 * 
 * Follows SRP: Hanya handle logic untuk update nama
 * 
 * @returns Object dengan form state dan handlers
 */
export function useProfileForm(): UseProfileFormReturn {
  const { user, updateNama } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    nama: user?.nama || '',
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    
    // Clear messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Validate on change
    const error = validateNama(value);
    setErrors({ nama: error });
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
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
      
      setSuccessMessage('Nama berhasil diperbarui');
      
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      const errorMsg = handleAPIError(error);
      setErrorMessage(errorMsg);
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    successMessage,
    errorMessage,
    handleChange,
    handleSubmit,
  };
}
