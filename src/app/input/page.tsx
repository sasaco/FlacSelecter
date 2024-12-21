"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import type { ChangeEvent } from "react";

export default function InputPage() {
  const router = useRouter();
  // Form options
  const tunnelKeizyoList = [
    { id: 1, title: '単線' },
    { id: 2, title: '複線' },
    { id: 3, title: '新幹線（在来工法）' },
  ];

  const henkeiModeList = [
    { id: 1, title: '側壁全体押出し' },
    { id: 2, title: '側壁上部前傾' },
    { id: 3, title: '脚部押出し' },
    { id: 4, title: '盤ぶくれ' }
  ];

  const lockBoltKouList = [
    { id: 0, title: 'なし' },
    { id: 4, title: '4本' },
    { id: 8, title: '8本' },
    { id: 12, title: '12本' },
  ];

  const lockBoltLengthList = [
    { id: 3, title: '3m' },
    { id: 4, title: '4m' },
    { id: 6, title: '6m' },
    { id: 8, title: '8m' }
  ];

  const invertList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' }
  ];

  const haimenKudoList = [
    { id: 0, title: 'なし' },
    { id: 1, title: 'あり' }
  ];

  // UI state for disabled fields
  const [uiState, setUiState] = useState({
    henkeiModeStyle: ['Enable', 'Enable', 'Enable', 'Disable'] as string[],
    uragomeChunyukoStyle: ['Enable', 'Disable'] as string[],
    lockBoltLengthStyle: ['Disable', 'Disable', 'Disable', 'Disable'] as string[],
    downwardLockBoltLengthStyle: 'Disable',
    henkeiMode4Flag: false,
    downwardLockBoltEnable: false
  });

  const [formData, setFormData] = useState({
    tunnelKeizyo: 1,
    fukukouMakiatsu: 30,
    invert: 0,
    haimenKudo: 0,
    henkeiMode: 1,
    lockBoltKou: 0,
    lockBoltLength: 0,
    fukukouKyori: "",
    fukukouKeisya: "",
    fukukouKoubai: "",
    fukukouKotei: "",
    honkouMakiatsu: "",
    honkouKyori: "",
    honkouKeisya: "",
    honkouKoubai: "",
    honkouKotei: "",
    kijunMen: "",
    kijunKoubai: "",
    kijunKotei: "",
  });

  // Update UI state when form data changes
  useEffect(() => {
    updateUIState();
  }, [formData]);

  // Port of setEnable() from original implementation
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
    } else {
      newUIState.henkeiModeStyle = ['Enable', 'Enable', 'Enable', 'Disable'];
      if (formData.henkeiMode === 4) {
        setFormData(prev => ({ ...prev, henkeiMode: 1 }));
      }
    }

    // Handle deformation mode
    if (formData.henkeiMode === 4) {
      newUIState.henkeiMode4Flag = true;
      setFormData(prev => ({
        ...prev,
        lockBoltKou: 0,
        lockBoltLength: 0
      }));
    } else {
      newUIState.henkeiMode4Flag = false;
    }

    // Handle rock bolt length
    if (formData.lockBoltKou === 0) {
      newUIState.lockBoltLengthStyle = ['Disable', 'Disable', 'Disable', 'Disable'];
      setFormData(prev => ({ ...prev, lockBoltLength: 0 }));
    } else {
      switch (formData.tunnelKeizyo) {
        case 1: // Single track: 3, 6m
          newUIState.lockBoltLengthStyle = ['Enable', 'Disable', 'Enable', 'Disable'];
          if (formData.lockBoltLength !== 3 && formData.lockBoltLength !== 6) {
            setFormData(prev => ({ ...prev, lockBoltLength: 3 }));
          }
          break;
        case 2: // Double track: 4, 8m
        case 3: // Shinkansen: 4, 8m
          newUIState.lockBoltLengthStyle = ['Disable', 'Enable', 'Disable', 'Enable'];
          if (formData.lockBoltLength !== 4 && formData.lockBoltLength !== 8) {
            setFormData(prev => ({ ...prev, lockBoltLength: 4 }));
          }
          break;
      }
    }

    setUiState(newUIState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializedInputChange = (field: string, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const goToOutput = () => {
    const queryParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    router.push(`/output?${queryParams.toString()}`);
  };

  return (
    <div className={styles.container}>
      <h1>条件設定</h1>
      <div className={styles.formGroup}>
        <label>トンネル計上</label>
        <div className={styles.radioGroup}>
          {tunnelKeizyoList.map((item) => (
            <label key={item.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="tunnelKeizyo"
                value={item.id}
                checked={formData.tunnelKeizyo === item.id}
                onChange={(e) => handleSpecializedInputChange('tunnelKeizyo', Number(e.target.value))}
              />
              {item.title}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>副坑巻圧</label>
        <div>
          <input
            type="number"
            name="fukukouMakiatsu"
            value={formData.fukukouMakiatsu}
            onChange={handleInputChange}
            min={30}
            max={70}
          />
          <span className={styles.unit}>cm</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>インバートの有無</label>
        <div className={styles.radioGroup}>
          {invertList.map((item) => (
            <label key={item.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="invert"
                value={item.id}
                checked={formData.invert === item.id}
                onChange={(e) => handleSpecializedInputChange('invert', Number(e.target.value))}
              />
              {item.title}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>背面空洞の有無</label>
        <div className={styles.radioGroup}>
          {haimenKudoList.map((item) => (
            <label key={item.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="haimenKudo"
                value={item.id}
                checked={formData.haimenKudo === item.id}
                onChange={(e) => handleSpecializedInputChange('haimenKudo', Number(e.target.value))}
              />
              {item.title}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>変形モード</label>
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
                onChange={(e) => handleSpecializedInputChange('henkeiMode', Number(e.target.value))}
                disabled={uiState.henkeiModeStyle[index] !== 'Enable'}
              />
              {item.title}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>ロックボルト工</label>
        {!uiState.henkeiMode4Flag ? (
          <div className={styles.liner}>
            <div className={styles.radioGroup}>
              {lockBoltKouList.map((item) => (
                <label key={item.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="lockBoltKou"
                    value={item.id}
                    checked={formData.lockBoltKou === item.id}
                    onChange={(e) => handleSpecializedInputChange('lockBoltKou', Number(e.target.value))}
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
                    onChange={(e) => handleSpecializedInputChange('lockBoltLength', Number(e.target.value))}
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
      </div>

      <div className={styles.formGroup}>
        <label>副坑距離</label>
        <div>
          <input
            type="number"
            name="fukukouKyori"
            value={formData.fukukouKyori}
            onChange={handleInputChange}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>副坑傾斜</label>
        <div>
          <input
            type="number"
            name="fukukouKeisya"
            value={formData.fukukouKeisya}
            onChange={handleInputChange}
            min={0}
            max={90}
          />
          <span className={styles.unit}>度</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>副坑勾配</label>
        <div>
          <input
            type="number"
            name="fukukouKoubai"
            value={formData.fukukouKoubai}
            onChange={handleInputChange}
            min={-10}
            max={10}
            step={0.1}
          />
          <span className={styles.unit}>%</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>副坑高低</label>
        <div>
          <input
            type="number"
            name="fukukouKotei"
            value={formData.fukukouKotei}
            onChange={handleInputChange}
            step={0.1}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>本坑巻圧</label>
        <div>
          <input
            type="number"
            name="honkouMakiatsu"
            value={formData.honkouMakiatsu}
            onChange={handleInputChange}
            min={30}
            max={70}
          />
          <span className={styles.unit}>cm</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>本坑距離</label>
        <div>
          <input
            type="number"
            name="honkouKyori"
            value={formData.honkouKyori}
            onChange={handleInputChange}
            min={0}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>本坑傾斜</label>
        <div>
          <input
            type="number"
            name="honkouKeisya"
            value={formData.honkouKeisya}
            onChange={handleInputChange}
            min={0}
            max={90}
          />
          <span className={styles.unit}>度</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>本坑勾配</label>
        <div>
          <input
            type="number"
            name="honkouKoubai"
            value={formData.honkouKoubai}
            onChange={handleInputChange}
            min={-10}
            max={10}
            step={0.1}
          />
          <span className={styles.unit}>%</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>本坑高低</label>
        <div>
          <input
            type="number"
            name="honkouKotei"
            value={formData.honkouKotei}
            onChange={handleInputChange}
            step={0.1}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>基準面</label>
        <div>
          <input
            type="number"
            name="kijunMen"
            value={formData.kijunMen}
            onChange={handleInputChange}
            step={0.1}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>基準勾配</label>
        <div>
          <input
            type="number"
            name="kijunKoubai"
            value={formData.kijunKoubai}
            onChange={handleInputChange}
            min={-10}
            max={10}
            step={0.1}
          />
          <span className={styles.unit}>%</span>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>基準高低</label>
        <div>
          <input
            type="number"
            name="kijunKotei"
            value={formData.kijunKotei}
            onChange={handleInputChange}
            step={0.1}
          />
          <span className={styles.unit}>m</span>
        </div>
      </div>
      <button onClick={goToOutput} className={styles.submitButton}>
        結果を表示
      </button>
    </div>
  );
}
