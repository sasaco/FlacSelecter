'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { FocusEvent, ChangeEvent } from 'react';
import { useInputData } from '@/context/InputDataContext';
import type { InputData, InputDataContextType } from '@/context/InputDataContext';
import styles from './page.module.css';

interface FormOption {
  id: number;
  title: string;
}

// Form options
const tunnelKeizyoList: FormOption[] = [
  { id: 1, title: '単線' },
  { id: 2, title: '複線' },
  { id: 3, title: '新幹線（在来工法）' },
];

const invertList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const haimenKudoList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const henkeiModeList: FormOption[] = [
  { id: 1, title: '側壁全体押出し' },
  { id: 2, title: '側壁上部前傾' },
  { id: 3, title: '脚部押出し' },
  { id: 4, title: '盤ぶくれ' }
];

const uragomeChunyukoList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const lockBoltKouList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 4, title: '4本' },
  { id: 8, title: '8本' },
  { id: 12, title: '12本' },
];

const lockBoltLengthList: FormOption[] = [
  { id: 3, title: '3m' },
  { id: 6, title: '6m' },
  { id: 4, title: '4m' },
  { id: 8, title: '8m' },
];

const downwardLockBoltKouList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 4, title: '4本' },
  { id: 6, title: '6本' }
];

const downwardLockBoltLengthList: FormOption[] = [
  { id: 4, title: '4m' },
  { id: 8, title: '8m' }
];

const uchimakiHokyoList: FormOption[] = [
  { id: 0, title: 'なし' },
  { id: 1, title: 'あり' }
];

const InputPage: React.FC = () => {
  // Initialize context
  const { data, setData } = useInputData() as InputDataContextType;

  // Initialize state variables
  const [henkeiModeStyle, setHenkeiModeStyle] = useState<string[]>(['Enable', 'Enable', 'Enable', 'Enable']);
  const [uragomeChunyukoStyle, setUragomeChunyukoStyle] = useState<string[]>(['Enable', 'Disable']);
  const [lockBoltLengthStyle, setLockBoltLengthStyle] = useState<string[]>(['Disable', 'Disable', 'Disable', 'Disable']);
  const [downwardLockBoltLengthStyle, setDownwardLockBoltLengthStyle] = useState<string[]>(['Disable', 'Disable', 'Disable', 'Disable']);
  const [downwardLockBoltEnable, setDownwardLockBoltEnable] = useState<boolean>(false);
  const [henkeiMode4Flag, setHenkeiMode4Flag] = useState<boolean>(false);
  const [tempFukukouMakiatsu, setTempFukukouMakiatsu] = useState<string>(data.fukukouMakiatsu.toString());
  const [tempJiyamaKyodo, setTempJiyamaKyodo] = useState<string>(data.jiyamaKyodo.toString());
  const [tempNaikuHeniSokudo, setTempNaikuHeniSokudo] = useState<string>(data.naikuHeniSokudo.toString());
  const [tempMonitoringData, setTempMonitoringData] = useState<string>(data.MonitoringData || '');

  // Form validation and state management
  const setEnable = useCallback((): void => {
    // Create new state objects with proper types
    const newData: InputData = { ...data };
    const newStyles = {
      henkeiMode: [...henkeiModeStyle],
      uragomeChunyuko: [...uragomeChunyukoStyle],
      lockBoltLength: [...lockBoltLengthStyle],
      downwardLockBoltLength: [...downwardLockBoltLengthStyle]
    };
    const newFlags = {
      downwardLockBoltEnable,
      henkeiMode4: henkeiMode4Flag
    };
    const newTemp = {
      fukukouMakiatsu: tempFukukouMakiatsu
    };

    // Update state based on conditions
    if (data.tunnelKeizyo === 3) {
      if (data.haimenKudo === 1) {
        if (data.henkeiMode === 4) {
          newData.henkeiMode = 1;
        }
        newStyles.henkeiMode[3] = 'Disable';
      }
      if (data.fukukouMakiatsu < 50) {
        newTemp.fukukouMakiatsu = "50";
        newData.fukukouMakiatsu = 50;
      }
    } else {
      newStyles.henkeiMode = ['Enable', 'Enable', 'Enable', 'Disable'];
      if (data.henkeiMode === 4) {
        newData.henkeiMode = 1;
      }
      newData.downwardLockBoltKou = 0;
      newData.downwardLockBoltLength = 0;
      if (data.fukukouMakiatsu > 60) {
        newTemp.fukukouMakiatsu = "60";
        newData.fukukouMakiatsu = 60;
      }
    }

    // Handle henkeiMode4Flag and related states
    if (data.henkeiMode === 4) {
      newFlags.henkeiMode4 = true;
      newFlags.downwardLockBoltEnable = true;
      newData.lockBoltKou = 0;
      newData.lockBoltLength = 0;
      newData.uchimakiHokyo = 0;
    } else {
      newData.downwardLockBoltKou = 0;
      newData.downwardLockBoltLength = 0;
    }

    // Update states based on haimenKudo
    if (data.haimenKudo === 0) {
      newStyles.uragomeChunyuko = ['Enable', 'Disable'];
      newData.uragomeChunyuko = 0;
    } else {
      newStyles.uragomeChunyuko = ['Disable', 'Enable'];
      newData.uragomeChunyuko = 1;
    }

    // Update lockBoltLength based on conditions
    if (data.lockBoltKou === 0) {
      newData.lockBoltLength = 0;
    } else {
      switch (data.tunnelKeizyo) {
        case 1: // 単線 3, 6m
          newStyles.lockBoltLength = ['Enable', 'Enable', 'Disable', 'Disable'];
          if (data.lockBoltLength !== 3 && data.lockBoltLength !== 6) {
            newData.lockBoltLength = 3;
          }
          break;
        case 2: // 複線 4, 8m
        case 3: // 新幹線（在来工法）4, 8m
          newStyles.lockBoltLength = ['Disable', 'Disable', 'Enable', 'Enable'];
          if (data.lockBoltLength !== 4 && data.lockBoltLength !== 8) {
            newData.lockBoltLength = 4;
          }
          break;
      }
    }

    // Update downwardLockBoltLength states
    if (data.downwardLockBoltKou !== 0) {
      newStyles.downwardLockBoltLength = ['Enable', 'Enable', 'Enable', 'Enable'];
      if (data.downwardLockBoltLength === 0) {
        newData.downwardLockBoltLength = 4;
      }
    } else {
      newStyles.downwardLockBoltLength = ['Disable', 'Disable', 'Disable', 'Disable'];
      newData.downwardLockBoltLength = 0;
    }

    // Handle invert conditions
    if (data.invert === 1) {
      newStyles.henkeiMode[2] = 'Disable';
      if (data.henkeiMode === 3) {
        newData.henkeiMode = 1;
      }
    }

    // Update all states
    setHenkeiModeStyle(newStyles.henkeiMode);
    setUragomeChunyukoStyle(newStyles.uragomeChunyuko);
    setLockBoltLengthStyle(newStyles.lockBoltLength);
    setDownwardLockBoltLengthStyle(newStyles.downwardLockBoltLength);
    setDownwardLockBoltEnable(newFlags.downwardLockBoltEnable);
    setHenkeiMode4Flag(newFlags.henkeiMode4);
    setTempFukukouMakiatsu(newTemp.fukukouMakiatsu);
    setData(newData);
  }, [
    data,
    setData,
    henkeiModeStyle,
    uragomeChunyukoStyle,
    lockBoltLengthStyle,
    downwardLockBoltLengthStyle,
    downwardLockBoltEnable,
    henkeiMode4Flag,
    tempFukukouMakiatsu
  ]);

  const setFukukouMakiatsu = useCallback((value: string): void => {
    const num = Number(value);
    if (!isNaN(num)) {
      if (data.tunnelKeizyo === 3) {
        if (num < 50) {
          setData({ ...data, fukukouMakiatsu: 50 });
          setTempFukukouMakiatsu("50");
        } else {
          setData({ ...data, fukukouMakiatsu: num });
          setTempFukukouMakiatsu(value);
        }
      } else {
        if (num > 60) {
          setData({ ...data, fukukouMakiatsu: 60 });
          setTempFukukouMakiatsu("60");
        } else {
          setData({ ...data, fukukouMakiatsu: num });
          setTempFukukouMakiatsu(value);
        }
      }
    }
  }, [data, setData]);

  const setJiyamaKyodo = useCallback((value: string): void => {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num < 2) {
        setData({ ...data, jiyamaKyodo: 2 });
        setTempJiyamaKyodo("2");
      } else if (num > 8) {
        setData({ ...data, jiyamaKyodo: 8 });
        setTempJiyamaKyodo("8");
      } else {
        setData({ ...data, jiyamaKyodo: num });
        setTempJiyamaKyodo(value);
      }
    }
  }, [data, setData]);

  const setNaikuHeniSokudo = useCallback((value: string): void => {
    const num = Number(value);
    if (!isNaN(num)) {
      setData({ ...data, naikuHeniSokudo: num });
      setTempNaikuHeniSokudo(value);
    }
  }, [data, setData]);

  const getMonitoringData = useCallback(async () => {
    try {
      const response = await fetch('/api/calculate-effection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setTempMonitoringData(result.MonitoringData);
      setData({ ...data, MonitoringData: result.MonitoringData });
    } catch (error) {
      console.error('Error:', error);
    }
  }, [data, setData]);

  // Initialize form state on mount and when specific data fields change
  useEffect(() => {
    setEnable();
  }, [
    data.tunnelKeizyo,
    data.haimenKudo,
    data.henkeiMode,
    data.fukukouMakiatsu,
    data.lockBoltKou,
    data.uragomeChunyuko,
    setEnable
  ]);

  // Return the JSX for the input page
  return (
    <div className={styles.mainContainer}>
      {/* 構造条件 */}
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.sectionHeading}>構造条件</h2>
          <div className={styles.divider}></div>
        </div>
      </div>

      <div className={`${styles.container} ${styles.conditions}`}>
        <div className={styles.liner}>
          <fieldset>
            <legend>トンネル形状</legend>
            {tunnelKeizyoList.map((x, i) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    name="tunnelKeizyo"
                    id={`tunnelKeizyo${i}`}
                    value={x.id}
                    checked={data.tunnelKeizyo === x.id}
                    onChange={() => {
                      setData({ ...data, tunnelKeizyo: x.id } as InputData);
                      setEnable();
                    }}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>覆工巻厚</legend>
            <div id="textbox">
              <input
                type="number"
                value={tempFukukouMakiatsu}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTempFukukouMakiatsu(e.target.value)}
                onBlur={(e: FocusEvent<HTMLInputElement>) => setFukukouMakiatsu(e.target.value)}
                style={{ width: '65px', textAlign: 'center' }}
                min="30"
                max="70"
              />
              cm
            </div>
          </fieldset>

          <fieldset>
            <legend>インバートの有無</legend>
            {invertList.map((x, i) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    name="invert"
                    id={`invert${i}`}
                    value={x.id}
                    checked={data.invert === x.id}
                    onChange={() => {
                      setData({ ...data, invert: x.id } as InputData);
                      setEnable();
                    }}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      {/* 調査・計測結果の条件 */}
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.sectionHeading}>調査・計測結果の条件</h2>
          <div className={styles.divider}></div>
        </div>
      </div>

      <div className={`${styles.container} ${styles.conditions}`}>
        <div className={styles.liner}>
          <fieldset>
            <legend>背面空洞の有無</legend>
            {haimenKudoList.map((x, i) => (
              <div key={x.id}>
                <label>
                  <input
                    type="radio"
                    name="haimenKudo"
                    id={`haimenKudo${i}`}
                    value={x.id}
                    checked={data.haimenKudo === x.id}
                    onChange={() => {
                      setData({ ...data, haimenKudo: x.id } as InputData);
                      setEnable();
                    }}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>変形モード</legend>
            {henkeiModeList.map((x, i) => (
              <div key={x.id} className={henkeiModeStyle[i] === 'Enable' ? styles.enabled : styles.disabled}>
                <label>
                  <input
                    type="radio"
                    name="henkeiMode"
                    id={`henkeiMode${i}`}
                    value={x.id}
                    checked={data.henkeiMode === x.id}
                    disabled={henkeiModeStyle[i] !== 'Enable'}
                    onChange={() => {
                      setData({ ...data, henkeiMode: x.id } as InputData);
                      setEnable();
                    }}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>地山強度</legend>
            <input
              type="number"
              value={tempJiyamaKyodo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTempJiyamaKyodo(e.target.value)}
              onBlur={(e: FocusEvent<HTMLInputElement>) => setJiyamaKyodo(e.target.value)}
              style={{ width: '65px', textAlign: 'center' }}
              min="2"
              max="8"
            />
            MPa
          </fieldset>

          <fieldset>
            <legend>内空変位速度, 盤ぶくれ速度</legend>
            <div>
              <input
                type="number"
                value={tempNaikuHeniSokudo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTempNaikuHeniSokudo(e.target.value)}
                onBlur={(e: FocusEvent<HTMLInputElement>) => setNaikuHeniSokudo(e.target.value)}
                style={{ width: '65px', textAlign: 'center' }}
              />
              <span>mm/年</span>
              <button 
                type="button" 
                onClick={getMonitoringData}
                className={styles.button}
              >
                モニタリングデータ取得
              </button>
              {tempMonitoringData && (
                <div className={styles.monitoringData}>
                  <pre className={styles.monitoringPre}>{tempMonitoringData}</pre>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* 対策工の条件 */}
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.sectionHeading}>対策工の条件</h2>
          <div className={styles.divider}></div>
        </div>
      </div>

      <div className={`${styles.container} ${styles.conditions}`}>
        <div className={styles.liner}>
          <fieldset>
            <legend>裏込注入工</legend>
            {uragomeChunyukoList.map((x, i) => (
              <div key={x.id} className={uragomeChunyukoStyle[i] === 'Enable' ? styles.enabled : styles.disabled}>
                <label>
                  <input
                    type="radio"
                    name="uragomeChunyuko"
                    id={`uragomeChunyuko${i}`}
                    value={x.id}
                    checked={data.uragomeChunyuko === x.id}
                    disabled={uragomeChunyukoStyle[i] !== 'Enable'}
                    onChange={() => {
                      setData({ ...data, uragomeChunyuko: x.id });
                      setEnable();
                    }}
                  />
                  {x.title}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>ロックボルト工</legend>
            <div className={styles.lockBoltContainer}>
              <div>
                {lockBoltKouList.map((x, i) => (
                  <div key={x.id}>
                    <label>
                      <input
                        type="radio"
                        name="lockBoltKou"
                        id={`lockBoltKou${i}`}
                        value={x.id}
                        checked={data.lockBoltKou === x.id}
                        onChange={() => {
                          setData({ ...data, lockBoltKou: x.id });
                          setEnable();
                        }}
                      />
                      {x.title}
                    </label>
                  </div>
                ))}
              </div>
              <div className={styles['margin-left']}>
                {lockBoltLengthList.map((x, i) => (
                  <div key={x.id}>
                    <label>
                      <input
                        type="radio"
                        name="lockBoltLength"
                        id={`lockBoltLength${i}`}
                        value={x.id}
                        checked={data.lockBoltLength === x.id}
                        disabled={lockBoltLengthStyle[i] !== 'Enable'}
                        onChange={() => {
                          setData({ ...data, lockBoltLength: x.id });
                        }}
                      />
                      {x.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>下向きロックボルト工</legend>
            {downwardLockBoltEnable ? (
              <div className={styles.lockBoltContainer}>
                <div>
                  {downwardLockBoltKouList.map((x, i) => (
                    <div key={x.id}>
                      <label>
                        <input
                          type="radio"
                          name="downwardLockBoltKou"
                          id={`downwardLockBoltKou${i}`}
                          value={x.id}
                          checked={data.downwardLockBoltKou === x.id}
                          onChange={() => {
                            setData({ ...data, downwardLockBoltKou: x.id });
                            setEnable();
                          }}
                        />
                        {x.title}
                      </label>
                    </div>
                  ))}
                </div>
                <div className={styles['margin-left']}>
                  {downwardLockBoltLengthList.map((x, i) => (
                    <div key={x.id}>
                      <label>
                        <input
                          type="radio"
                          name="downwardLockBoltLength"
                          id={`downwardLockBoltLength${i}`}
                          value={x.id}
                          checked={data.downwardLockBoltLength === x.id}
                          disabled={downwardLockBoltLengthStyle[i] !== 'Enable'}
                          onChange={() => {
                            setData({ ...data, downwardLockBoltLength: x.id });
                          }}
                        />
                        {x.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>選択できません</p>
            )}
          </fieldset>

          <fieldset>
            <legend>内巻補強</legend>
            {!henkeiMode4Flag ? (
              <>
                {uchimakiHokyoList.map((x, i) => (
                  <div key={x.id}>
                    <label>
                      <input
                        type="radio"
                        name="uchimakiHokyo"
                        id={`uchimakiHokyo${i}`}
                        value={x.id}
                        checked={data.uchimakiHokyo === x.id}
                        onChange={() => {
                          setData({ ...data, uchimakiHokyo: x.id } as InputData);
                          setEnable();
                        }}
                      />
                      {x.title}
                    </label>
                  </div>
                ))}
              </>
            ) : (
              <p>選択できません</p>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
