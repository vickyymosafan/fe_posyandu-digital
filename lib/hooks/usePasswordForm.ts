import { useState } from 'react';
import { useAuth } from './useAuth';
import { handleAPIError } from '@/lib/utils/errors';

/**
 * Interface untuk form data
 */
interface PasswordFormData {
  kataSandiLama: string;
  kataSandiBaru: string;
  konfirmasiKataSandi: string;
}

/**
 * Interface untuk form errors
 */
interface PasswordFormErrors {
  kataSandiLama?: string;
  kataSandiBaru?: string;
  konfirmasiKataSandi?: string;
}

/**
 * Interface untuk return value hook
 */
interface UsePasswordFormReturn {
  formData: PasswordFormData;
  errors: PasswordFormErrors;
  isSubmitting: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  handleChange: (field: keyof PasswordFormData, value: string) => void;
  toggleOldPasswordVisibility: () => void;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook untuk mengelola form update password
 * 
 * Features:
 * - Form state management
 * - Real-time validation
 * - Password strength validation (min 8 chars, letters, numbers, symbols)
 * - Password visibility toggle
 * - API integration dengan AuthContext.updatePassword
 * - Success/error message handling
 * 
 * Follows SRP: Hanya handle logic untuk update password
 * 
 * @returns Object dengan form state dan handlers
 */
export function usePasswordForm(): UsePasswordFormReturn {
  const { updatePassword } = useAuth();
  const [formData, setFormData] = useState<PasswordFormData>({
    kataSandiLama: '',
    kataSandiBaru: '',
    konfirmasiKataSandi: '',
  });
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Validate password lama
   */
  const validateOldPassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password lama tidak boleh kosong';
    }
    return undefined;
  };

  /**
   * Validate password baru
   * Requirements: Min 8 chars, at least one letter, one number, one symbol
   */
  const validateNewPassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password baru tidak boleh kosong';
    }
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }
    
    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return 'Password harus mengandung minimal satu huruf';
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return 'Password harus mengandung minimal satu angka';
    }
    
    // Check for at least one symbol
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password harus mengandung minimal satu simbol';
    }
    
    return undefined;
  };

  /**
   * Validate konfirmasi password
   */
  const validateConfirmPassword = (
    confirmPassword: string,
    newPassword: string
  ): string | undefined => {
    if (!confirmPassword) {
      return 'Konfirmasi password tidak boleh kosong';
    }
    if (confirmPassword !== newPassword) {
      return 'Konfirmasi password tidak cocok';
    }
    return undefined;
  };

  /**
   * Handle input change
   */
  const handleChange = (field: keyof PasswordFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Clear messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Validate on change
    const newErrors: PasswordFormErrors = {};
    
    if (field === 'kataSandiLama') {
      newErrors.kataSandiLama = validateOldPassword(value);
    } else if (field === 'kataSandiBaru') {
      newErrors.kataSandiBaru = validateNewPassword(value);
      // Re-validate confirm password if it's already filled
      if (formData.konfirmasiKataSandi) {
        newErrors.konfirmasiKataSandi = validateConfirmPassword(
          formData.konfirmasiKataSandi,
          value
        );
      }
    } else if (field === 'konfirmasiKataSandi') {
      newErrors.konfirmasiKataSandi = validateConfirmPassword(
        value,
        formData.kataSandiBaru
      );
    }
    
    setErrors({ ...errors, ...newErrors });
  };

  /**
   * Toggle password visibility
   */
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Validate all fields
    const oldPasswordError = validateOldPassword(formData.kataSandiLama);
    const newPasswordError = validateNewPassword(formData.kataSandiBaru);
    const confirmPasswordError = validateConfirmPassword(
      formData.konfirmasiKataSandi,
      formData.kataSandiBaru
    );
    
    if (oldPasswordError || newPasswordError || confirmPasswordError) {
      setErrors({
        kataSandiLama: oldPasswordError,
        kataSandiBaru: newPasswordError,
        konfirmasiKataSandi: confirmPasswordError,
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Use AuthContext's updatePassword which handles API call
      await updatePassword(formData.kataSandiLama, formData.kataSandiBaru);
      
      setSuccessMessage('Password berhasil diperbarui');
      
      // Clear form
      setFormData({
        kataSandiLama: '',
        kataSandiBaru: '',
        konfirmasiKataSandi: '',
      });
      
      // Hide passwords
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      
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
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    handleChange,
    toggleOldPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  };
}
