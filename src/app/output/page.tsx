"use client";

import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCaseStrings, calculateEffectiveness, loadCaseData } from '../../utils/dataParser';
import type { InputData } from '../../utils/dataParser';
import { useFormData } from '../../context/FormContext';

const OutputPage: NextPage = () => {
  // Get form data from context
  const { formData } = useFormData();

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
  const getInputString1 = (data: InputData): string => {
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
  const getInputString2 = (data: InputData): string => {
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
  const getInputString3 = (data: InputData): string => {
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
    // Handle undefined/null case strings
    if (!caseStrings) {
      console.error('Case strings array is undefined or null');
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    // Handle insufficient array length
    if (caseStrings.length < 3) {
      console.error('Case strings array has insufficient length:', caseStrings);
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    // Validate individual case string values and ensure they're complete
    if (!caseStrings[1] || !caseStrings[2] || 
        !caseStrings[1].startsWith('case') || !caseStrings[2].startsWith('case')) {
      console.error('Invalid case string values:', caseStrings);
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    try {
      // Validate case string format (should match pattern like case3-70-1-1-2-8-1-8-1-0-8)
      const casePattern = /^case\d+(?:-\d+){9,10}$/;
      if (!casePattern.test(caseStrings[1]) || !casePattern.test(caseStrings[2])) {
        console.error('Case strings do not match expected pattern:', caseStrings);
        return ['/images/placeholder.png', '/images/placeholder.png'];
      }

      // Don't encode the paths - Next.js Image component will handle that
      const imgString0 = `/images/${caseStrings[1]}.png`;
      const imgString1 = `/images/${caseStrings[2]}.png`;
      
      return [imgString0, imgString1];
    } catch (error) {
      console.error('Error generating image paths:', error);
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }
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
  const getAlertString = (data: InputData): string => {
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
        if (!caseStrings || caseStrings.length < 3) {
          throw new Error('画像の生成に必要なデータが不足しています。');
        }
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100">構造条件</div>:
            <div className="text-gray-700 dark:text-gray-300">{outputState.inputString1}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100">調査・計測結果</div>:
            <div className="text-gray-700 dark:text-gray-300">{outputState.inputString2}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100">対策工条件</div>:
            <div className="text-gray-700 dark:text-gray-300">{outputState.inputString3}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <div className="mb-2">対策後の予測内空変位速度</div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">{outputState.displacement}</span>
              <span>mm/年</span>
            </div>
          </div>
          <div>
            <div className="mb-2">変位抑制効果</div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">{outputState.effection}</span>
              <span>％</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <div className="mb-4 font-semibold">【対策工なし】</div>
            {outputState.imgString0 && (
              <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={outputState.imgString0}
                  alt="補強前の状態"
                  width={400}
                  height={300}
                  priority
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <div>
            <div className="mb-4 font-semibold">【対策工あり】</div>
            {outputState.imgString1 && (
              <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={outputState.imgString1}
                  alt="補強後の状態"
                  width={400}
                  height={300}
                  priority
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {outputState.alertString && (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
            <div>{outputState.alertString}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPage;
