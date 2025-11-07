'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';
import type { Gender, PemeriksaanGabunganData } from '@/types';

/**
 * Interface untuk form data pemeriksaan gabungan
 */
export interface PemeriksaanGabunganFormData {
  // Data Fisik
  tinggi: string;
  berat: string;
  sistolik: string;
  diastolik: string;
  // Data Kesehatan (Lab)
  gulaPuasa: string;
  gulaSewaktu: string;
  gula2Jpp: string;
  kolesterol: string;
  asamUrat: string;
}

/**
 * Interface untuk form errors
 */
export interface PemeriksaanGabunganFormErrors {
  tinggi?: string;
  berat?: string;
  sistolik?: string;
  diastolik?: string;
  gulaPuasa?: string;
  gulaSewaktu?: string;
  gula2Jpp?: string;
  kolesterol?: string;
  asamUrat?: string;
}

/**
 * Interface untuk return value hook
 */
export interface UsePemeriksaanGabunganFormReturn {
  formData: PemeriksaanGabunganFormData;
  errors: PemeriksaanGabunganFormErrors;
  isSubmitting: boolean;
  handleChange: (field: keyof PemeriksaanGabunganFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

/**
 * Custom hook untuk form pemeriksaan gabungan (fisik + kesehatan)
 * 
 * Responsibilities (SRP):
 * - Manage form state
 * - Validate input
 * - Submit data to API
 * 
 * Design Principles:
 * - High Cohesion: Focused on form management only
 * - Low Coupling: Delegates calculations to backend API
 * - DIP: Depends on abstractions (pemeriksaanAPI)
 * - SoC: Separates form logic from business logic
 * 
 * Note: Health metrics (BMI, blood pressure classifications, etc.) are calculated
 * by the backend API using WHO standards. The frontend only collects and validates
 * input data, then displays the calculated results from the API response.
 */
export function usePemeriksaanGabunganForm(
  kode: string,
  lansiaId: number,
  gender: Gender
): UsePemeriksaanGabunganFormReturn {
  const router = useRouter();
  const { showNotification } = useNotification();

  // Form state
  const [formData, setFormData] = useState<PemeriksaanGabunganFormData>({
    tinggi: '',
    berat: '',
    sistolik: '',
    diastolik: '',
    gulaPuasa: '',
    gulaSewaktu: '',
    gula2Jpp: '',
    kolesterol: '',
    asamUrat: '',
  });

  const [errors, setErrors] = useState<PemeriksaanGabunganFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (field: keyof PemeriksaanGabunganFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const newErrors: PemeriksaanGabunganFormErrors = {};

    // Validate data fisik (required)
    if (!formData.tinggi) {
      newErrors.tinggi = 'Tinggi badan wajib diisi';
    } else {
      const tinggi = parseFloat(formData.tinggi);
      if (isNaN(tinggi) || tinggi < 50 || tinggi > 250) {
        newErrors.tinggi = 'Tinggi badan harus antara 50-250 cm';
      }
    }

    if (!formData.berat) {
      newErrors.berat = 'Berat badan wajib diisi';
    } else {
      const berat = parseFloat(formData.berat);
      if (isNaN(berat) || berat < 20 || berat > 300) {
        newErrors.berat = 'Berat badan harus antara 20-300 kg';
      }
    }

    if (!formData.sistolik) {
      newErrors.sistolik = 'Tekanan darah sistolik wajib diisi';
    } else {
      const sistolik = parseFloat(formData.sistolik);
      if (isNaN(sistolik) || sistolik < 50 || sistolik > 300) {
        newErrors.sistolik = 'Sistolik harus antara 50-300 mmHg';
      }
    }

    if (!formData.diastolik) {
      newErrors.diastolik = 'Tekanan darah diastolik wajib diisi';
    } else {
      const diastolik = parseFloat(formData.diastolik);
      if (isNaN(diastolik) || diastolik < 30 || diastolik > 200) {
        newErrors.diastolik = 'Diastolik harus antara 30-200 mmHg';
      }
    }

    // Validate data kesehatan (optional, but if filled must be valid)
    if (formData.gulaPuasa) {
      const gulaPuasa = parseFloat(formData.gulaPuasa);
      if (isNaN(gulaPuasa) || gulaPuasa < 20 || gulaPuasa > 600) {
        newErrors.gulaPuasa = 'Gula darah puasa harus antara 20-600 mg/dL';
      }
    }

    if (formData.gulaSewaktu) {
      const gulaSewaktu = parseFloat(formData.gulaSewaktu);
      if (isNaN(gulaSewaktu) || gulaSewaktu < 20 || gulaSewaktu > 600) {
        newErrors.gulaSewaktu = 'Gula darah sewaktu harus antara 20-600 mg/dL';
      }
    }

    if (formData.gula2Jpp) {
      const gula2Jpp = parseFloat(formData.gula2Jpp);
      if (isNaN(gula2Jpp) || gula2Jpp < 20 || gula2Jpp > 600) {
        newErrors.gula2Jpp = 'Gula darah 2JPP harus antara 20-600 mg/dL';
      }
    }

    if (formData.kolesterol) {
      const kolesterol = parseFloat(formData.kolesterol);
      if (isNaN(kolesterol) || kolesterol < 50 || kolesterol > 500) {
        newErrors.kolesterol = 'Kolesterol harus antara 50-500 mg/dL';
      }
    }

    if (formData.asamUrat) {
      const asamUrat = parseFloat(formData.asamUrat);
      if (isNaN(asamUrat) || asamUrat < 1 || asamUrat > 20) {
        newErrors.asamUrat = 'Asam urat harus antara 1-20 mg/dL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showNotification('error', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data
      const data: PemeriksaanGabunganData = {
        tinggi: parseFloat(formData.tinggi),
        berat: parseFloat(formData.berat),
        sistolik: parseFloat(formData.sistolik),
        diastolik: parseFloat(formData.diastolik),
      };

      // Add optional lab data
      if (formData.gulaPuasa) {
        data.gulaPuasa = parseFloat(formData.gulaPuasa);
      }
      if (formData.gulaSewaktu) {
        data.gulaSewaktu = parseFloat(formData.gulaSewaktu);
      }
      if (formData.gula2Jpp) {
        data.gula2Jpp = parseFloat(formData.gula2Jpp);
      }
      if (formData.kolesterol) {
        data.kolesterol = parseFloat(formData.kolesterol);
      }
      if (formData.asamUrat) {
        data.asamUrat = parseFloat(formData.asamUrat);
      }

      // Submit to API
      const response = await pemeriksaanAPI.createGabungan(kode, data);

      if (response.error) {
        throw new Error(response.error);
      }

      showNotification('success', 'Pemeriksaan berhasil disimpan');
      
      // Navigate back to detail page
      router.push(`/petugas/lansia/${kode}`);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({
      tinggi: '',
      berat: '',
      sistolik: '',
      diastolik: '',
      gulaPuasa: '',
      gulaSewaktu: '',
      gula2Jpp: '',
      kolesterol: '',
      asamUrat: '',
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
