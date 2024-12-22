"use client";

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useFormData } from '../../context/FormContext';
import type { InputData } from '../../utils/dataParser';



// Form options (ported from Angular component)
const tunnelKeizyoList = [
  { id: 1, title: '単線' },
  { id: 2, title: '複線' },
  { id: 3, title: '新幹線（在来工法）' },
];

const invertList = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const haimenKudoList = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const henkeiModeList = [
  { id: 1, title: '側壁全体押出し' },
  { id: 2, title: '側壁上部前傾' },
  { id: 3, title: '脚部押出し' },
  { id: 4, title: '盤ぶくれ' }
];

const uragomeChunyukoList = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const lockBoltKouList = [
  { id: 0, title: 'なし' },
  { id: 4, title: '4本' },
  { id: 8, title: '8本' },
  { id: 12, title: '12本' },
];

const lockBoltLengthList = [
  { id: 3, title: '3m' },
  { id: 6, title: '6m' },
  { id: 4, title: '4m' },
  { id: 8, title: '8m' },
];

const downwardLockBoltKouList = [
  { id: 0, title: 'なし' },
  { id: 4, title: '4本' },
  { id: 6, title: '6本' }
];

const downwardLockBoltLengthList = [
  { id: 4, title: '4m' },
  { id: 8, title: '8m' }
];

const uchimakiHokyoList = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

export default function Page() {
  // Get form state from context
  const { formData, setFormData } = useFormData();

  // UI state for disabled fields
  const [uiState, setUiState] = useState({
    henkeiModeStyle: ['Enable', 'Enable', 'Enable', 'Disable'] as string[],
    uragomeChunyukoStyle: ['Enable', 'Disable'] as string[],
    lockBoltLengthStyle: ['Disable', 'Disable', 'Disable', 'Disable'] as string[],
    downwardLockBoltLengthStyle: 'Disable',
    henkeiMode4Flag: false,
    downwardLockBoltEnable: false
  });

  // Update UI state based on specific form data changes
  const updateUIState = () => {
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
  };

  // Update UI state when relevant form data changes
  useEffect(() => {
    updateUIState();
  }, [
    formData.tunnelKeizyo,
    formData.haimenKudo,
    formData.henkeiMode,
    formData.lockBoltKou,
    formData.downwardLockBoltKou
  ]);

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
  }, [formData.tunnelKeizyo, formData.haimenKudo, formData.henkeiMode, formData.fukukouMakiatsu]);

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
  }, [formData.henkeiMode]);

  // Handle back cavity and injection constraints
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      uragomeChunyuko: formData.haimenKudo === 0 ? 0 : 1
    }));
  }, [formData.haimenKudo]);

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
  }, [formData.lockBoltKou, formData.tunnelKeizyo, formData.lockBoltLength]);

  // Handle downward rock bolt length constraints
  useEffect(() => {
    if (formData.downwardLockBoltKou === 0) {
      setFormData(prev => ({ ...prev, downwardLockBoltLength: 0 }));
    } else if (formData.downwardLockBoltLength === 0) {
      setFormData(prev => ({ ...prev, downwardLockBoltLength: 4 }));
    }
  }, [formData.downwardLockBoltKou, formData.downwardLockBoltLength]);

  // Handle form field changes
  const handleInputChange = (field: keyof InputData, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div>
        <h2 className="text-xl font-semibold pb-2 mb-4 border-b-2 border-green-500">構造条件</h2>
      </div>

      <div className="space-y-2">
        <div className="bg-white p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="grid grid-cols-3 gap-4">
              {/* Tunnel Shape */}
              <fieldset>
                <legend>トンネル形状</legend>
                <div className="space-y-1.5">
                  {tunnelKeizyoList.map((item, index) => (
                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tunnelKeizyo"
                        value={item.id}
                        checked={formData.tunnelKeizyo === item.id}
                        onChange={(e) => handleInputChange('tunnelKeizyo', Number(e.target.value))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{item.title}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Lining Thickness */}
              <fieldset>
                <legend>覆工巻厚</legend>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="form-input w-20 px-2 py-1 rounded border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 text-gray-700"
                    value={formData.fukukouMakiatsu}
                    onChange={(e) => handleInputChange('fukukouMakiatsu', Number(e.target.value))}
                    min={30}
                    max={70}
                  />
                  <span className="text-sm text-gray-700">cm</span>
                </div>
              </fieldset>

              {/* Invert Presence */}
              <fieldset>
                <legend>インバートの有無</legend>
                <div className="space-y-1.5">
                  {invertList.map((item, index) => (
                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="invert"
                        value={item.id}
                        checked={formData.invert === item.id}
                        onChange={(e) => handleInputChange('invert', Number(e.target.value))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{item.title}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2 mb-4 border-b-2 border-green-500">調査・計測結果の条件</h2>
      </div>

      <div>
        <h2 className="text-xl font-semibold pb-2 mb-4 border-b-2 border-green-500">変状条件</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-4 gap-6">
            {/* Back Cavity */}
            <fieldset>
              <legend>背面空洞の有無</legend>
              <div className="space-y-3">
                {haimenKudoList.map((item, index) => (
                  <label key={item.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                    <input
                      type="radio"
                      name="haimenKudo"
                      value={item.id}
                      checked={formData.haimenKudo === item.id}
                      onChange={(e) => handleInputChange('haimenKudo', Number(e.target.value))}
                      className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300"
                    />
                    <span className="text-gray-700">{item.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Deformation Mode */}
            <fieldset>
              <legend>変形モード</legend>
              <div className="space-y-3">
                {henkeiModeList.map((item, index) => (
                  <label
                    key={item.id}
                    className={`flex items-center space-x-3 p-2 ${
                      uiState.henkeiModeStyle[index] !== 'Enable' 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="henkeiMode"
                      value={item.id}
                      checked={formData.henkeiMode === item.id}
                      onChange={(e) => handleInputChange('henkeiMode', Number(e.target.value))}
                      disabled={uiState.henkeiModeStyle[index] !== 'Enable'}
                      className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300 disabled:opacity-50"
                    />
                    <span className="text-text-dark">{item.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Ground Strength */}
            <fieldset>
              <legend>地山強度</legend>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  className="form-input w-32 rounded-md border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.jiyamaKyodo}
                  onChange={(e) => handleInputChange('jiyamaKyodo', Number(e.target.value))}
                  min={2}
                  max={8}
                />
                <span className="text-text-dark">MPa</span>
              </div>
            </fieldset>

            {/* Inner Displacement Speed */}
            <fieldset>
              <legend>内空変位速度, 盤ぶくれ速度</legend>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  className="form-input w-40 rounded-md border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.naikuHeniSokudo}
                  onChange={(e) => handleInputChange('naikuHeniSokudo', Number(e.target.value))}
                />
                <span className="text-text-dark">mm/年</span>
              </div>
              {formData.MonitoringData && (
                <pre className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-text-dark">{formData.MonitoringData}</pre>
              )}
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="section-title">対策工の条件</h2>
        <div className="section-underline" />
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Back Filling Injection */}
            <fieldset>
              <legend>裏込注入工</legend>
              <div className="space-y-3">
                {uragomeChunyukoList.map((item, index) => (
                  <label
                    key={item.id}
                    className={`flex items-center space-x-3 p-2 ${
                      uiState.uragomeChunyukoStyle[index] !== 'Enable' 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="uragomeChunyuko"
                      value={item.id}
                      checked={formData.uragomeChunyuko === item.id}
                      onChange={(e) => handleInputChange('uragomeChunyuko', Number(e.target.value))}
                      disabled={uiState.uragomeChunyukoStyle[index] !== 'Enable'}
                      className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-text-dark">{item.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <h2 className="text-xl font-semibold pb-2 mb-4 border-b-2 border-green-500">対策工</h2>
            </div>

            {/* Rock Bolt Work */}
            <fieldset>
              <legend>ロックボルト工</legend>
              {!uiState.henkeiMode4Flag ? (
                <div className="space-y-3">
                  {lockBoltKouList.map((item, index) => (
                    <label key={item.id} className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="lockBoltKou"
                        value={item.id}
                        checked={formData.lockBoltKou === item.id}
                        onChange={(e) => handleInputChange('lockBoltKou', Number(e.target.value))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-700">{item.title}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-disabled-gray text-sm p-2">選択できません</p>
              )}
            </fieldset>

            {/* Downward Rock Bolt Work */}
            <fieldset>
              <legend>ロックボルト工（下向き）</legend>
              {uiState.downwardLockBoltEnable ? (
                <div className="space-y-3">
                  {downwardLockBoltKouList.map((item, index) => (
                    <label key={item.id} className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="downwardLockBoltKou"
                        value={item.id}
                        checked={formData.downwardLockBoltKou === item.id}
                        onChange={(e) => handleInputChange('downwardLockBoltKou', Number(e.target.value))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-text-dark">{item.title}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-disabled-gray text-sm p-2">選択できません</p>
              )}
            </fieldset>

            {/* Inner Reinforcement */}
            <fieldset>
              <legend>内巻補強</legend>
              {!uiState.henkeiMode4Flag ? (
                <div className="space-y-3">
                  {uchimakiHokyoList.map((item, index) => (
                    <label key={item.id} className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="uchimakiHokyo"
                        value={item.id}
                        checked={formData.uchimakiHokyo === item.id}
                        onChange={(e) => handleInputChange('uchimakiHokyo', Number(e.target.value))}
                        className="form-radio h-4 w-4 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-text-dark">{item.title}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-disabled-gray text-sm p-2">選択できません</p>
              )}
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};
