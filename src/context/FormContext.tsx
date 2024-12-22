"use client";

import React, { createContext, useState, ReactNode, useContext } from 'react';
import type { InputData } from '../utils/dataParser';

interface FormContextValue {
  formData: InputData;
  setFormData: React.Dispatch<React.SetStateAction<InputData>>;
}

const defaultFormData: InputData = {
  tunnelKeizyo: 1,
  fukukouMakiatsu: 30,
  invert: 0,
  haimenKudo: 0,
  henkeiMode: 1,
  jiyamaKyodo: 2,
  naikuHeniSokudo: 1,
  uragomeChunyuko: 0,
  lockBoltKou: 0,
  lockBoltLength: 0,
  downwardLockBoltKou: 0,
  downwardLockBoltLength: 0,
  uchimakiHokyo: 0,
  MonitoringData: ''
};

const FormContext = createContext<FormContextValue | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<InputData>(defaultFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormProvider');
  }
  return context;
}
