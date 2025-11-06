'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pemeriksaanAPI } from '@/lib/api';
import { useNotification } from '@/components/ui';
import { handleAPIError } from '@/lib/utils/errors';
import { hitungBMISafe, klasifikasiBMISafe } from '@/lib/utils/bmi';
import { klasifikasiTekananDarahSafe } from '@/lib/utils/tekananDarah';
import { klasifikasiGulaDarah } from '@/lib/utils/gulaDarah';
import { klasifikasiKolesterol } from '@/lib/utils/kolesterol';
import { klasifikasiAsamUrat } from '@/lib/utils/asamUrat';
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
 * Interface untuk BMI result
 */
export interface BMIResult {
  nilai: number | null;
  kategori: string | null;
}

/**
 * Interface untuk tekanan darah result
 */
export interface TekananDarahResult {
  kategori: string | null;
  emergency: boolean;
}

/**
 * Interface untuk klasifikasi gula darah
 */
export interface KlasifikasiGulaDarah {
  gdp?: string;
  gds?: string;
  duaJpp?: string;
}

/**
 * Interface untuk return value hook
 */
export interface UsePemeriksaanGabunganFormReturn {
  formData: PemeriksaanGabunganFormData;
  errors: PemeriksaanGabunganFormErrors;
  isSubmitting: boolean;
  bmiResult: BMIResult;
  tekananDarahResult: TekananDarahResult;
  klasifikasiGula: KlasifikasiGulaDarah;
  klasifikasiKolesterolValue: string | null;
  klasifikasiAsamUratValue: string | null;
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
 * - Calculate BMI realtime
 * - Classify blood pressure realtime
 * - Classify lab values realtime
 * - Submit data to API
 * 
 * Design Principles:
 * - DIP: Depends on pemeriksaanAPI abstraction
 * - SoC: Separates form logic from UI
 * - KISS: Simple validation and calculation
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

  // Calculated values
  const [bmiResult, setBmiResult] = useState<BMIResult>({
    nilai: null,
    kategori: null,
  });

  const [tekananDarahResult, setTekananDarahResult] = useState<TekananDarahResult>({
    kategori: null,
    emergency: false,
  });

  const [klasifikasiGula, setKlasifikasiGula] = useState<KlasifikasiGulaDarah>({});
  const [klasifikasiKolesterolValue, setKlasifikasiKolesterolValue] = useState<string | null>(null);
  const [klasifikasiAsamUratValue, setKlasifikasiAsamUratValue] = useState<string | null>(null);

  /**
   * Calculate BMI when tinggi or berat changes
   */
  useEffect(() => {
    const berat = parseFloat(formData.berat);
    const tinggi = parseFloat(formData.tinggi);

    if (!isNaN(berat) && !isNaN(tinggi) && berat > 0 && tinggi > 0) {
      const bmi = hitungBMISafe(berat, tinggi);
      const kategori = klasifikasiBMISafe(bmi);
      setBmiResult({ nilai: bmi, kategori });
    } else {
      setBmiResult({ nilai: null, kategori: null });
    }
  }, [formData.berat, formData.tinggi]);

  /**
   * Classify blood pressure when sistolik or diastolik changes
   */
  useEffect(() => {
    const sistolik = parseFloat(formData.sistolik);
    const diastolik = parseFloat(formData.diastolik);

    if (!isNaN(sistolik) && !isNaN(diastolik) && sistolik > 0 && diastolik > 0) {
      const result = klasifikasiTekananDarahSafe(sistolik, diastolik);
      if (result) {
        setTekananDarahResult(result);
      } else {
        setTekananDarahResult({ kategori: null, emergency: false });
      }
    } else {
      setTekananDarahResult({ kategori: null, emergency: false });
    }
  }, [formData.sistolik, formData.diastolik]);

  /**
   * Classify gula darah when values change
   */
  useEffect(() => {
    const gulaPuasa = formData.gulaPuasa ? parseFloat(formData.gulaPuasa) : undefined;
    const gulaSewaktu = formData.gulaSewaktu ? parseFloat(formData.gulaSewaktu) : undefined;
    const gula2Jpp = formData.gula2Jpp ? parseFloat(formData.gula2Jpp) : undefined;

    const klasifikasi = klasifikasiGulaDarah(gulaPuasa, gulaSewaktu, gula2Jpp);
    setKlasifikasiGula(klasifikasi);
  }, [formData.gulaPuasa, formData.gulaSewaktu, formData.gula2Jpp]);

  /**
   * Classify kolesterol when value changes
   */
  useEffect(() => {
    if (formData.kolesterol) {
      const kolesterol = parseFloat(formData.kolesterol);
      if (!isNaN(kolesterol) && kolesterol > 0) {
        const klasifikasi = klasifikasiKolesterol(kolesterol);
        setKlasifikasiKolesterolValue(klasifikasi);
      } else {
        setKlasifikasiKolesterolValue(null);
      }
    } else {
      setKlasifikasiKolesterolValue(null);
    }
  }, [formData.kolesterol]);

  /**
   * Classify asam urat when value changes
   */
  useEffect(() => {
    if (formData.asamUrat) {
      const asamUrat = parseFloat(formData.asamUrat);
      if (!isNaN(asamUrat) && asamUrat > 0) {
        const klasifikasi = klasifikasiAsamUrat(asamUrat, gender);
        setKlasifikasiAsamUratValue(klasifikasi);
      } else {
        setKlasifikasiAsamUratValue(null);
      }
    } else {
      setKlasifikasiAsamUratValue(null);
    }
  }, [formData.asamUrat, gender]);

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
    setBmiResult({ nilai: null, kategori: null });
    setTekananDarahResult({ kategori: null, emergency: false });
    setKlasifikasiGula({});
    setKlasifikasiKolesterolValue(null);
    setKlasifikasiAsamUratValue(null);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    bmiResult,
    tekananDarahResult,
    klasifikasiGula,
    klasifikasiKolesterolValue,
    klasifikasiAsamUratValue,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
