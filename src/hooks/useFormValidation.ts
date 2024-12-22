import { useEffect } from 'react';
import type { InputData } from '../utils/dataParser';

export function useFormValidation(
  formData: InputData,
  setFormData: React.Dispatch<React.SetStateAction<InputData>>
) {
  // Handle Shinkansen-specific constraints
  useEffect(() => {
    if (formData.tunnelKeizyo === 3) {
      if (formData.haimenKudo === 1 && formData.henkeiMode === 4) {
        setFormData(prev => ({ ...prev, henkeiMode: 1 }));
      }
      if (formData.fukukouMakiatsu < 50) {
        setFormData(prev => ({ ...prev, fukukouMakiatsu: 50 }));
      }
    } else {
      if (formData.henkeiMode === 4) {
        setFormData(prev => ({ ...prev, henkeiMode: 1 }));
      }
      if (formData.fukukouMakiatsu > 60) {
        setFormData(prev => ({ ...prev, fukukouMakiatsu: 60 }));
      }
    }
  }, [formData.tunnelKeizyo, formData.haimenKudo, formData.henkeiMode, formData.fukukouMakiatsu, setFormData]);

  // Handle deformation mode constraints
  useEffect(() => {
    if (formData.henkeiMode === 4) {
      setFormData(prev => ({
        ...prev,
        lockBoltKou: 0,
        lockBoltLength: 0,
        uchimakiHokyo: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        downwardLockBoltKou: 0,
        downwardLockBoltLength: 0
      }));
    }
  }, [formData.henkeiMode, setFormData]);

  // Handle back cavity and injection constraints
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      uragomeChunyuko: formData.haimenKudo === 0 ? 0 : 1
    }));
  }, [formData.haimenKudo, setFormData]);

  // Handle rock bolt length constraints
  useEffect(() => {
    if (formData.lockBoltKou === 0) {
      setFormData(prev => ({ ...prev, lockBoltLength: 0 }));
    } else {
      const isSingleTrack = formData.tunnelKeizyo === 1;
      if (isSingleTrack && formData.lockBoltLength !== 3 && formData.lockBoltLength !== 6) {
        setFormData(prev => ({ ...prev, lockBoltLength: 3 }));
      } else if (!isSingleTrack && formData.lockBoltLength !== 4 && formData.lockBoltLength !== 8) {
        setFormData(prev => ({ ...prev, lockBoltLength: 4 }));
      }
    }
  }, [formData.lockBoltKou, formData.tunnelKeizyo, formData.lockBoltLength, setFormData]);

  // Handle downward rock bolt length constraints
  useEffect(() => {
    if (formData.downwardLockBoltKou === 0) {
      setFormData(prev => ({ ...prev, downwardLockBoltLength: 0 }));
    } else if (formData.downwardLockBoltLength === 0) {
      setFormData(prev => ({ ...prev, downwardLockBoltLength: 4 }));
    }
  }, [formData.downwardLockBoltKou, formData.downwardLockBoltLength, setFormData]);
}
