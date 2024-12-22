import { useState, useEffect } from 'react';
import type { InputData } from '../utils/dataParser';

interface UIState {
  henkeiModeStyle: string[];
  uragomeChunyukoStyle: string[];
  lockBoltLengthStyle: string[];
  downwardLockBoltLengthStyle: string;
  henkeiMode4Flag: boolean;
  downwardLockBoltEnable: boolean;
}

export function useUIState(formData: InputData) {
  const [uiState, setUiState] = useState<UIState>({
    henkeiModeStyle: ['Enable', 'Enable', 'Enable', 'Disable'],
    uragomeChunyukoStyle: ['Enable', 'Disable'],
    lockBoltLengthStyle: ['Disable', 'Disable', 'Disable', 'Disable'],
    downwardLockBoltLengthStyle: 'Disable',
    henkeiMode4Flag: false,
    downwardLockBoltEnable: false
  });

  useEffect(() => {
    const newUIState = { ...uiState };

    // Handle Shinkansen case UI updates
    if (formData.tunnelKeizyo === 3) {
      newUIState.henkeiModeStyle = ['Enable', 'Enable', 'Enable', 'Enable'];
      if (formData.haimenKudo === 1) {
        newUIState.henkeiModeStyle[3] = 'Disable';
      }
    } else {
      newUIState.henkeiModeStyle = ['Enable', 'Enable', 'Enable', 'Disable'];
      newUIState.downwardLockBoltEnable = false;
    }

    // Handle deformation mode UI updates
    if (formData.henkeiMode === 4) {
      newUIState.henkeiMode4Flag = true;
      newUIState.downwardLockBoltEnable = true;
    } else {
      newUIState.henkeiMode4Flag = false;
      newUIState.downwardLockBoltEnable = false;
    }

    // Handle back cavity and injection UI updates
    if (formData.haimenKudo === 0) {
      newUIState.uragomeChunyukoStyle = ['Enable', 'Disable'];
    } else {
      newUIState.uragomeChunyukoStyle = ['Disable', 'Enable'];
    }

    // Handle rock bolt length UI updates
    if (formData.lockBoltKou === 0) {
      newUIState.lockBoltLengthStyle = ['Disable', 'Disable', 'Disable', 'Disable'];
    } else {
      switch (formData.tunnelKeizyo) {
        case 1: // Single track: 3, 6m
          newUIState.lockBoltLengthStyle = ['Enable', 'Enable', 'Disable', 'Disable'];
          break;
        case 2: // Double track: 4, 8m
        case 3: // Shinkansen: 4, 8m
          newUIState.lockBoltLengthStyle = ['Disable', 'Disable', 'Enable', 'Enable'];
          break;
      }
    }

    // Handle downward rock bolt length UI updates
    newUIState.downwardLockBoltLengthStyle = formData.downwardLockBoltKou !== 0 ? 'Enable' : 'Disable';

    setUiState(newUIState);
  }, [
    formData.tunnelKeizyo,
    formData.haimenKudo,
    formData.henkeiMode,
    formData.lockBoltKou,
    formData.downwardLockBoltKou
  ]);

  return uiState;
}
