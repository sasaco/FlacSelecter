import React, { createContext, useState } from 'react';
import { InputData, InputDataService } from '../services/inputData';

export const InputDataContext = createContext<{
  data: InputData;
  setData: React.Dispatch<React.SetStateAction<InputData>>;
} | null>(null);

export function InputDataProvider({ children }: { children: React.ReactNode }) {
  const inputService = new InputDataService();
  const [data, setData] = useState<InputData>(inputService.Data);

  return (
    <InputDataContext.Provider value={{ data, setData }}>
      {children}
    </InputDataContext.Provider>
  );
}
