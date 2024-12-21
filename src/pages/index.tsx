import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// Import styles
import styles from '@/styles/Input.module.css';

// Form data interface matching the Angular service
interface InputData {
  tunnelKeizyo: number;
  fukukouMakiatsu: number;
  invert: number;
  haimenKudo: number;
  henkeiMode: number;
  jiyamaKyodo: number;
  naikuHeniSokudo: number;
  uragomeChunyuko: number;
  lockBoltKou: number;
  lockBoltLength: number;
  downwardLockBoltKou: number;
  downwardLockBoltLength: number;
  uchimakiHokyo: number;
  MonitoringData: string;
}

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

const InputPage: NextPage = () => {
  // Form state
  const [formData, setFormData] = useState<InputData>({
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
  });

  // UI state for disabled fields
  const [uiState, setUiState] = useState({
    henkeiModeStyle: ['Enable', 'Enable', 'Enable', 'Disable'] as string[],
    uragomeChunyukoStyle: ['Enable', 'Disable'] as string[],
    lockBoltLengthStyle: ['Disable', 'Disable', 'Disable', 'Disable'] as string[],
    downwardLockBoltLengthStyle: 'Disable',
    henkeiMode4Flag: false,
    downwardLockBoltEnable: false
  });

  // Update UI state when form data changes
  useEffect(() => {
    updateUIState();
  }, [formData]);

  // Port of setEnable() from Angular
  const updateUIState = () => {
    const newUIState = { ...uiState };

    // Handle Shinkansen case
    if (formData.tunnelKeizyo === 3) {
      newUIState.henkeiModeStyle = ['Enable', 'Enable', 'Enable', 'Enable'];
      if (formData.haimenKudo === 1) {
        if (formData.henkeiMode === 4) {
          setFormData(prev => ({ ...prev, henkeiMode: 1 }));
        }
        newUIState.henkeiModeStyle[3] = 'Disable';
      }
      if (formData.fukukouMakiatsu < 50) {
        setFormData(prev => ({ ...prev, fukukouMakiatsu: 50 }));
      }
    } else {
      newUIState.henkeiModeStyle = ['Enable', 'Enable', 'Enable', 'Disable'];
      if (formData.henkeiMode === 4) {
        setFormData(prev => ({ ...prev, henkeiMode: 1 }));
      }
      newUIState.downwardLockBoltEnable = false;
      setFormData(prev => ({
        ...prev,
        downwardLockBoltKou: 0,
        downwardLockBoltLength: 0
      }));
      if (formData.fukukouMakiatsu > 60) {
        setFormData(prev => ({ ...prev, fukukouMakiatsu: 60 }));
      }
    }

    // Handle deformation mode
    if (formData.henkeiMode === 4) {
      newUIState.henkeiMode4Flag = true;
      newUIState.downwardLockBoltEnable = true;
      setFormData(prev => ({
        ...prev,
        lockBoltKou: 0,
        lockBoltLength: 0,
        uchimakiHokyo: 0
      }));
    } else {
      newUIState.henkeiMode4Flag = false;
      newUIState.downwardLockBoltEnable = false;
      setFormData(prev => ({
        ...prev,
        downwardLockBoltKou: 0,
        downwardLockBoltLength: 0
      }));
    }

    // Handle back cavity and injection
    if (formData.haimenKudo === 0) {
      newUIState.uragomeChunyukoStyle = ['Enable', 'Disable'];
      setFormData(prev => ({ ...prev, uragomeChunyuko: 0 }));
    } else {
      newUIState.uragomeChunyukoStyle = ['Disable', 'Enable'];
      setFormData(prev => ({ ...prev, uragomeChunyuko: 1 }));
    }

    // Handle rock bolt length
    if (formData.lockBoltKou === 0) {
      newUIState.lockBoltLengthStyle = ['Disable', 'Disable', 'Disable', 'Disable'];
      setFormData(prev => ({ ...prev, lockBoltLength: 0 }));
    } else {
      switch (formData.tunnelKeizyo) {
        case 1: // Single track: 3, 6m
          newUIState.lockBoltLengthStyle = ['Enable', 'Enable', 'Disable', 'Disable'];
          if (formData.lockBoltLength !== 3 && formData.lockBoltLength !== 6) {
            setFormData(prev => ({ ...prev, lockBoltLength: 3 }));
          }
          break;
        case 2: // Double track: 4, 8m
        case 3: // Shinkansen: 4, 8m
          newUIState.lockBoltLengthStyle = ['Disable', 'Disable', 'Enable', 'Enable'];
          if (formData.lockBoltLength !== 4 && formData.lockBoltLength !== 8) {
            setFormData(prev => ({ ...prev, lockBoltLength: 4 }));
          }
          break;
      }
    }

    // Handle downward rock bolt length
    if (formData.downwardLockBoltKou !== 0) {
      newUIState.downwardLockBoltLengthStyle = 'Enable';
      if (formData.downwardLockBoltLength === 0) {
        setFormData(prev => ({ ...prev, downwardLockBoltLength: 4 }));
      }
    } else {
      newUIState.downwardLockBoltLengthStyle = 'Disable';
      setFormData(prev => ({ ...prev, downwardLockBoltLength: 0 }));
    }

    setUiState(newUIState);
  };

  // Handle form field changes
  const handleInputChange = (field: keyof InputData, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>
        <h2>構造条件</h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.conditions}>
        <div className={styles.liner}>
          {/* Tunnel Shape */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>トンネル形状</legend>
            <div className={styles.radioGroup}>
              {tunnelKeizyoList.map((item, index) => (
                <label key={item.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="tunnelKeizyo"
                    value={item.id}
                    checked={formData.tunnelKeizyo === item.id}
                    onChange={(e) => handleInputChange('tunnelKeizyo', Number(e.target.value))}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Lining Thickness */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>覆工巻厚</legend>
            <div>
              <input
                type="number"
                className={styles.numberInput}
                value={formData.fukukouMakiatsu}
                onChange={(e) => handleInputChange('fukukouMakiatsu', Number(e.target.value))}
                min={30}
                max={70}
              />
              <span className={styles.unit}>cm</span>
            </div>
          </fieldset>

          {/* Invert Presence */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>インバートの有無</legend>
            <div className={styles.radioGroup}>
              {invertList.map((item, index) => (
                <label key={item.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="invert"
                    value={item.id}
                    checked={formData.invert === item.id}
                    onChange={(e) => handleInputChange('invert', Number(e.target.value))}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <h2>調査・計測結果の条件</h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.conditions}>
        <div className={styles.liner}>
          {/* Back Cavity */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>背面空洞の有無</legend>
            <div className={styles.radioGroup}>
              {haimenKudoList.map((item, index) => (
                <label key={item.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="haimenKudo"
                    value={item.id}
                    checked={formData.haimenKudo === item.id}
                    onChange={(e) => handleInputChange('haimenKudo', Number(e.target.value))}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Deformation Mode */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>変形モード</legend>
            <div className={styles.radioGroup}>
              {henkeiModeList.map((item, index) => (
                <label
                  key={item.id}
                  className={`${styles.radioLabel} ${
                    uiState.henkeiModeStyle[index] !== 'Enable' ? styles.disabled : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="henkeiMode"
                    value={item.id}
                    checked={formData.henkeiMode === item.id}
                    onChange={(e) => handleInputChange('henkeiMode', Number(e.target.value))}
                    disabled={uiState.henkeiModeStyle[index] !== 'Enable'}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Ground Strength */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>地山強度</legend>
            <div>
              <input
                type="number"
                className={styles.numberInput}
                value={formData.jiyamaKyodo}
                onChange={(e) => handleInputChange('jiyamaKyodo', Number(e.target.value))}
                min={2}
                max={8}
              />
              <span className={styles.unit}>MPa</span>
            </div>
          </fieldset>

          {/* Inner Displacement Speed */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>内空変位速度, 盤ぶくれ速度</legend>
            <div>
              <input
                type="number"
                className={styles.numberInput}
                value={formData.naikuHeniSokudo}
                onChange={(e) => handleInputChange('naikuHeniSokudo', Number(e.target.value))}
              />
              <span className={styles.unit}>mm/年</span>
            </div>
            {formData.MonitoringData && (
              <pre>{formData.MonitoringData}</pre>
            )}
          </fieldset>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <h2>対策工の条件</h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.conditions}>
        <div className={styles.liner}>
          {/* Back Filling Injection */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>裏込注入工</legend>
            <div className={styles.radioGroup}>
              {uragomeChunyukoList.map((item, index) => (
                <label
                  key={item.id}
                  className={`${styles.radioLabel} ${
                    uiState.uragomeChunyukoStyle[index] !== 'Enable' ? styles.disabled : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="uragomeChunyuko"
                    value={item.id}
                    checked={formData.uragomeChunyuko === item.id}
                    onChange={(e) => handleInputChange('uragomeChunyuko', Number(e.target.value))}
                    disabled={uiState.uragomeChunyukoStyle[index] !== 'Enable'}
                  />
                  {item.title}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Rock Bolt Work */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>ロックボルト工</legend>
            {!uiState.henkeiMode4Flag ? (
              <div className={styles.liner}>
                <div className={styles.radioGroup}>
                  {lockBoltKouList.map((item, index) => (
                    <label key={item.id} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="lockBoltKou"
                        value={item.id}
                        checked={formData.lockBoltKou === item.id}
                        onChange={(e) => handleInputChange('lockBoltKou', Number(e.target.value))}
                      />
                      {item.title}
                    </label>
                  ))}
                </div>
                <div className={`${styles.radioGroup} ${styles.marginLeft}`}>
                  {lockBoltLengthList.map((item, index) => (
                    <label
                      key={item.id}
                      className={`${styles.radioLabel} ${
                        uiState.lockBoltLengthStyle[index] !== 'Enable' ? styles.disabled : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="lockBoltLength"
                        value={item.id}
                        checked={formData.lockBoltLength === item.id}
                        onChange={(e) => handleInputChange('lockBoltLength', Number(e.target.value))}
                        disabled={uiState.lockBoltLengthStyle[index] !== 'Enable'}
                      />
                      {item.title}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <p className={styles.disabledText}>選択できません</p>
            )}
          </fieldset>

          {/* Downward Rock Bolt Work */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>ロックボルト工（下向き）</legend>
            {uiState.downwardLockBoltEnable ? (
              <div className={styles.liner}>
                <div className={styles.radioGroup}>
                  {downwardLockBoltKouList.map((item, index) => (
                    <label key={item.id} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="downwardLockBoltKou"
                        value={item.id}
                        checked={formData.downwardLockBoltKou === item.id}
                        onChange={(e) => handleInputChange('downwardLockBoltKou', Number(e.target.value))}
                      />
                      {item.title}
                    </label>
                  ))}
                </div>
                <div className={`${styles.radioGroup} ${styles.marginLeft}`}>
                  {downwardLockBoltLengthList.map((item, index) => (
                    <label
                      key={item.id}
                      className={`${styles.radioLabel} ${
                        uiState.downwardLockBoltLengthStyle !== 'Enable' ? styles.disabled : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="downwardLockBoltLength"
                        value={item.id}
                        checked={formData.downwardLockBoltLength === item.id}
                        onChange={(e) => handleInputChange('downwardLockBoltLength', Number(e.target.value))}
                        disabled={uiState.downwardLockBoltLengthStyle !== 'Enable'}
                      />
                      {item.title}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <p className={styles.disabledText}>選択できません</p>
            )}
          </fieldset>

          {/* Inner Reinforcement */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>内巻補強</legend>
            {!uiState.henkeiMode4Flag ? (
              <div className={styles.radioGroup}>
                {uchimakiHokyoList.map((item, index) => (
                  <label key={item.id} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="uchimakiHokyo"
                      value={item.id}
                      checked={formData.uchimakiHokyo === item.id}
                      onChange={(e) => handleInputChange('uchimakiHokyo', Number(e.target.value))}
                    />
                    {item.title}
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.disabledText}>選択できません</p>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
