import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import styles from '@/styles/Output.module.css';
import { useRouter } from 'next/router';
import { getCaseStrings, calculateEffectiveness, loadCaseData } from '@/utils/dataParser';

interface OutputData {
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

const OutputPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<OutputData>({
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

  const [outputState, setOutputState] = React.useState({
    inputString1: '',
    inputString2: '',
    inputString3: '',
    imgString1: '',
    imgString0: '',
    alertString: '',
    effection: 0,
    displacement: 0
  });

  // Port of getinputString1
  const getInputString1 = (data: OutputData): string => {
    let result: string;
    switch (data.tunnelKeizyo) {
      case 1:
        result = "単線";
        break;
      case 2:
        result = "複線";
        break;
      case 3:
        result = "新幹線";
        break;
      default:
        result = "";
    }
    result += "・巻厚 ";
    result += data.fukukouMakiatsu.toString();
    result += "cm・";
    result += (data.invert === 0) ? "インバートなし" : "インバートあり";
    return result;
  };

  // Port of getinputString2
  const getInputString2 = (data: OutputData): string => {
    let result: string = (data.haimenKudo === 0) ? "背面空洞なし" : "背面空洞あり";
    result += "・";
    switch (data.henkeiMode) {
      case 1:
        result += "側壁全体押出し";
        break;
      case 2:
        result += "側壁上部前傾";
        break;
      case 3:
        result += "脚部押出し";
        break;
      case 4:
        result += "盤ぶくれ";
        break;
    }
    result += "・地山強度 ";
    result += data.jiyamaKyodo.toString();
    result += "MPa";
    result += "・内空変位速度 ";
    result += data.naikuHeniSokudo.toString();
    result += "mm / 年";
    return result;
  };

  // Port of getinputString3
  const getInputString3 = (data: OutputData): string => {
    let result: string = "";

    if (data.uragomeChunyuko === 0) {
      result += "裏込注入なし";
    } else {
      result += "裏込注入あり";
    }
    result += "・";
    if (data.lockBoltKou === 0) {
      result += "ロックボルトなし";
    } else {
      result += "ロックボルト ";
      result += data.lockBoltKou.toString();
      result += "本-";
      result += data.lockBoltLength.toString();
      result += "m";
    }    
    result += "・";
    if (data.uchimakiHokyo === 0) {
      result += "内巻なし";
    } else {
      result += "内巻あり";
    }
    if (data.downwardLockBoltKou !== 0) {
      result += "・";
      result += "下向きロックボルト ";
      result += data.downwardLockBoltKou.toString();
      result += "本-";
      result += data.downwardLockBoltLength.toString();
      result += "m";
    }    
    return result;
  };

  // Port of getimgString with Next.js public folder path and error handling
  const getImgString = (caseStrings: string[]): string[] => {
    if (!caseStrings || caseStrings.length < 3) {
      throw new Error('Invalid case strings array');
    }
    // 補強しなかった場合のファイル名
    const imgString0: string = `/images/${caseStrings[1]}.png`;
    // 補強後 のファイル名
    const imgString1: string = `/images/${caseStrings[2]}.png`;
    return [imgString0, imgString1];
  };

  // Port of getDisplacement
  const getDisplacement = (naikuHeniSokudo: number, effection: number): number => {
    const a: number = naikuHeniSokudo;
    const b: number = effection;
    const c: number = a * (1 - (b / 100));
    // 少数1 桁にラウンド
    return Math.round(c * 10) / 10;
  };

  // Port of getalertString
  const getAlertString = (data: OutputData): string => {
    let makiatsu: number = data.fukukouMakiatsu;
    let kyodo: number = data.jiyamaKyodo;
    if (data.tunnelKeizyo < 3) { // 単線, 複線
      if ((makiatsu === 30 || makiatsu === 60) && (kyodo === 2 || kyodo === 8)) {
        return '';
      }
      makiatsu = makiatsu < 45 ? 30 : 60;
    } else { // 新幹線   
      if ((makiatsu === 50 || makiatsu === 70) && (kyodo === 2 || kyodo === 8)) {
        return '';
      }
      makiatsu = makiatsu < 60 ? 50 : 70;
    }
    kyodo = kyodo < 5 ? 2 : 8;
    return '※この画像は覆工巻厚を' + makiatsu + '、地山強度を' + kyodo + 'とした場合のものです。';
  };

  // Initialize output state when component mounts or form data changes
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const updateOutputState = async () => {
      try {
        const caseStrings = getCaseStrings(formData);
        const imgStrings = getImgString(caseStrings);
        const caseData = await loadCaseData();
        const result = calculateEffectiveness(caseData, formData);
        
        if (!result) {
          throw new Error('計算に必要なデータが見つかりませんでした。');
        }
        
        setOutputState({
          inputString1: getInputString1(formData),
          inputString2: getInputString2(formData),
          inputString3: getInputString3(formData),
          imgString0: imgStrings[0],
          imgString1: imgStrings[1],
          alertString: getAlertString(formData),
          effection: result.effectiveness,
          displacement: getDisplacement(formData.naikuHeniSokudo, result.effectiveness)
        });
        setError('');
      } catch (error) {
        console.error('Error updating output state:', error);
        setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました。');
      }
    };

    updateOutputState();
  }, [formData]);

  return (
    <div className={styles.container}>
      <div className={styles.result}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <div className={styles.conditionsSummary}>
          <div className={styles.line}>
            <div className={styles.conditionName}>構造条件</div>:
            <div className={styles.content}>{outputState.inputString1}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.conditionName}>調査・計測結果</div>:
            <div className={styles.content}>{outputState.inputString2}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.conditionName}>対策工条件</div>:
            <div className={styles.content}>{outputState.inputString3}</div>
          </div>
        </div>

        <div className={styles.resultNumbers}>
          <div>
            <div>対策後の予測内空変位速度</div>
            <div className={styles.number}>
              <span className={styles.numberBox}>{outputState.displacement}</span>
              mm/年
            </div>
          </div>
          <div>
            <div>変位抑制効果</div>
            <div className={styles.number}>
              <span className={styles.numberBox}>{outputState.effection}</span>％
            </div>
          </div>
        </div>

        <div className={styles.images}>
          <div>
            <div>【対策工なし】</div>
            <Image
              src={outputState.imgString0}
              alt="補強前の状態"
              width={400}
              height={300}
              priority
            />
          </div>
          <div>
            <div>【対策工あり】</div>
            <Image
              src={outputState.imgString1}
              alt="補強後の状態"
              width={400}
              height={300}
              priority
            />
          </div>
        </div>
        
        {outputState.alertString && (
          <div className={styles.alert}>
            <div>{outputState.alertString}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPage;
