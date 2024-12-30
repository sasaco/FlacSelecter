'use client';

import { useEffect, useState } from 'react';
import { useInputData } from '@/context/InputDataContext';
import type { InputData, InputDataContextType } from '@/context/InputDataContext';
import styles from './page.module.css';
import type { ReactElement } from 'react';

export default function OutputPage(): ReactElement {
  const { data } = useInputData() as InputDataContextType;
  const [inputString1, setInputString1] = useState<string>('');
  const [inputString2, setInputString2] = useState<string>('');
  const [inputString3, setInputString3] = useState<string>('');
  const [imgString0, setImgString0] = useState<string | undefined>('');
  const [imgString1, setImgString1] = useState<string | undefined>('');
  const [displacement, setDisplacement] = useState<number>(0);
  const [effection, setEffection] = useState<number>(0);
  const [alertString, setAlertString] = useState<string>('');

  const getInputString1 = (): string => {
    let result = '';
    switch (data.tunnelKeizyo) {
      case 1:
        result = '単線';
        break;
      case 2:
        result = '複線';
        break;
      case 3:
        result = '新幹線';
        break;
    }
    result += '・巻厚 ';
    // Use raw context value without transformation
    const rawMakiatsu = data.fukukouMakiatsu;
    result += rawMakiatsu.toString();
    result += 'cm・';
    result += data.invert === 0 ? 'インバートなし' : 'インバートあり';
    return result;
  };

  const getInputString2 = (): string => {
    let result = data.haimenKudo === 0 ? '背面空洞なし' : '背面空洞あり';
    result += '・';
    switch (data.henkeiMode) {
      case 1:
        result += '側壁全体押出し';
        break;
      case 2:
        result += '側壁上部前傾';
        break;
      case 3:
        result += '脚部押出し';
        break;
      case 4:
        result += '盤ぶくれ';
        break;
    }
    result += '・地山強度 ';
    // Use raw context values without transformation
    const rawKyodo = data.jiyamaKyodo;
    result += rawKyodo.toString();
    result += 'MPa';
    result += '・内空変位速度 ';
    const rawNaikuHeniSokudo = data.naikuHeniSokudo;
    result += rawNaikuHeniSokudo.toString();
    result += 'mm / 年';
    return result;
  };

  const getInputString3 = (): string => {
    let result = '';
    if (data.uragomeChunyuko === 0) {
      result += '裏込注入なし';
    } else {
      result += '裏込注入あり';
    }
    result += '・';
    if (data.lockBoltKou === 0) {
      result += 'ロックボルトなし';
    } else {
      result += 'ロックボルト ';
      result += data.lockBoltKou.toString();
      result += '本-';
      result += data.lockBoltLength.toString();
      result += 'm';
    }
    result += '・';
    if (data.uchimakiHokyo === 0) {
      result += '内巻なし';
    } else {
      result += '内巻あり';
    }
    if (data.downwardLockBoltKou !== 0) {
      result += '・';
      result += '下向きロックボルト ';
      result += data.downwardLockBoltKou.toString();
      result += '本-';
      result += data.downwardLockBoltLength.toString();
      result += 'm';
    }
    return result;
  };

  const getImgString = (): [string | undefined, string | undefined] => {
    function generateCaseStrings(flg: boolean = false): string[] {
      function getTargetData(): number[] {
        // Use raw values from context without adjustment
        return [
          data.tunnelKeizyo,
          data.fukukouMakiatsu,
          data.invert,
          data.haimenKudo,
          data.henkeiMode,
          data.jiyamaKyodo,
          data.uragomeChunyuko,
          data.lockBoltKou,
          data.uchimakiHokyo,
          data.downwardLockBoltKou,
          data.lockBoltLength || data.downwardLockBoltLength
        ];
      }

      function caseString(numbers: number[]): string {
        return 'case' + numbers.join('-');
      }

      const result: string[] = [];
      
      // index 0 - base case
      let numbers = getTargetData();
      result.push(caseString(numbers));

      // index 1 - no reinforcement case (for first image)
      numbers = getTargetData();
      for (let i = 6; i < numbers.length; i++) {
        numbers[i] = 0;
      }
      result.push(caseString(numbers));

      // index 2 - reinforced case (for second image)
      numbers = getTargetData();
      // Use raw values without adjustment
      result.push(caseString(numbers));

      return result;
    }

    const caseStrings = generateCaseStrings(false);
    // Use indices 1 and 2 for images, matching Angular's implementation
    return [
      caseStrings[1] ? `/images/${caseStrings[1]}.png` : undefined,
      caseStrings[2] ? `/images/${caseStrings[2]}.png` : undefined
    ];
  };

  const getDisplacement = (effectionValue: number): number => {
    const a = data.naikuHeniSokudo;
    const b = effectionValue;
    const c = a * (1 - (b / 100));
    return Math.round(c * 10) / 10;
  };

  const getAlertString = (): string => {
    const makiatsu = data.fukukouMakiatsu;
    const kyodo = data.jiyamaKyodo;
    return `※この画像は覆工巻厚を${makiatsu}、地山強度を${kyodo}とした場合のものです。`;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update display strings when data changes
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 10;  // Increased from 5 to 10
    const retryDelay = 200; // Increased from 100ms to 200ms

    const initializeData = async () => {
      if (!mounted) return;

      console.log('Output page: Initializing with data (attempt ' + (retryCount + 1) + '/' + maxRetries + '):', {
        tunnelKeizyo: data.tunnelKeizyo,
        fukukouMakiatsu: data.fukukouMakiatsu,
        invert: data.invert,
        jiyamaKyodo: data.jiyamaKyodo,
        naikuHeniSokudo: data.naikuHeniSokudo,
        henkeiMode: data.henkeiMode,
        MonitoringData: data.MonitoringData,
        timestamp: new Date().toISOString()
      });

      // Enhanced validation to ensure we have the expected data
      const isDataValid = 
        typeof data.tunnelKeizyo !== 'undefined' &&
        typeof data.fukukouMakiatsu !== 'undefined' &&
        typeof data.invert !== 'undefined' &&
        typeof data.jiyamaKyodo !== 'undefined' &&
        typeof data.naikuHeniSokudo !== 'undefined' &&
        typeof data.henkeiMode !== 'undefined';

      // Check if values are stale (matching defaults when they shouldn't)
      const expectedValues = {
        fukukouMakiatsu: 60, // Updated to match our input
        jiyamaKyodo: 4,
        naikuHeniSokudo: 2
      };
      
      console.log('Output page: Checking for stale values:', {
        current: {
          fukukouMakiatsu: Number(data.fukukouMakiatsu),
          jiyamaKyodo: Number(data.jiyamaKyodo),
          naikuHeniSokudo: Number(data.naikuHeniSokudo)
        },
        expected: expectedValues
      });
      
      const hasDefaultOrStaleValues = 
        (Number(data.fukukouMakiatsu) === 30) || // Check if still at default
        (Number(data.jiyamaKyodo) === 2) ||      // Check if still at default
        (Number(data.naikuHeniSokudo) === 1);    // Check if still at default

      if (!isDataValid || (hasDefaultOrStaleValues && retryCount < maxRetries)) {
        console.log('Output page: Data validation status:', {
          retryCount,
          maxRetries,
          isDataValid,
          hasDefaultOrStaleValues,
          currentValues: {
            fukukouMakiatsu: data.fukukouMakiatsu,
            jiyamaKyodo: data.jiyamaKyodo,
            naikuHeniSokudo: data.naikuHeniSokudo
          },
          expectedValues: {
            fukukouMakiatsu: '60',
            jiyamaKyodo: '4',
            naikuHeniSokudo: '2'
          }
        });

        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Output page: Retrying in ${retryDelay}ms... (attempt ${retryCount}/${maxRetries})`);
          setTimeout(initializeData, retryDelay);
          return;
        } else {
          console.warn('Output page: Max retries reached. Using current data state.');
        }
      }

      setIsLoading(true);
      try {
        // Force update display strings with latest data
        setInputString1(getInputString1());
        setInputString2(getInputString2());
        setInputString3(getInputString3());
        
        // Update images with latest data
        const [img0, img1] = getImgString();
        setImgString0(img0);
        setImgString1(img1);
        
        // Update alert with latest data
        setAlertString(getAlertString());
        
        console.log('Output page: Display updated with latest data:', {
          inputString1: getInputString1(),
          inputString2: getInputString2(),
          inputString3: getInputString3()
        });
      } catch (error) {
        console.error('Error updating display:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Call initializeData immediately when data changes
    initializeData();

    return () => {
      mounted = false;
    };
  }, [data]);

  // Handle effection calculation separately to avoid race conditions
  useEffect(() => {
    let isMounted = true;
    const getEffectionNum = async (): Promise<number> => {
      if (isLoading) return 0;
      setIsLoading(true);
      try {
        const response = await fetch('/api/calculate-effection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to calculate effection');
        const result = await response.json();
        return result.effection;
      } catch (error) {
        console.error('Error calculating effection:', error);
        return 0;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getEffectionNum().then(effectionValue => {
      if (isMounted) {
        setEffection(effectionValue);
        setDisplacement(getDisplacement(effectionValue));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [data.tunnelKeizyo, data.fukukouMakiatsu, data.jiyamaKyodo, data.naikuHeniSokudo]);

  return (
    <div>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loading}>データを読み込んでいます...</div>
        ) : (
          <div className={styles.result}>
          <div className={styles['conditions-summary']}>
            <div className={styles.line}>
              <div className={styles['condition-name']}>構造条件</div>:
              <div className={styles.content}>{inputString1}</div>
            </div>
            <div className={styles.line}>
              <div className={styles['condition-name']}>調査・計測結果</div>:
              <div className={styles.content}>{inputString2}</div>
            </div>
            <div className={styles.line}>
              <div className={styles['condition-name']}>対策工条件</div>:
              <div className={styles.content}>{inputString3}</div>
            </div>
          </div>

          <div className={styles['result-numbers']}>
            <div>
              <div>対策後の予測内空変位速度</div>
              <div className={styles.number}>
                <span className={styles['number-box']}>{displacement}</span>
                mm/年
              </div>
            </div>
            <div>
              <div>変位抑制効果</div>
              <div className={styles.number}>
                <span className={styles['number-box']}>{effection}</span>％
              </div>
            </div>
          </div>

          <div className={styles.images}>
            <div>
              <div>【対策工なし】</div>
              {imgString0 && <img id="outputimage" src={imgString0} alt="対策工なし" />}
            </div>
            <div>
              <div>【対策工あり】</div>
              {imgString1 && <img id="outputimage" src={imgString1} alt="対策工あり" />}
            </div>
          </div>

          {alertString && (
            <div className={styles.alert}>
              <div>{alertString}</div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
