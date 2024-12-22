"use client";

import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { getCaseStrings, calculateEffectiveness, loadCaseData } from '../../utils/dataParser';
import styles from '@/components/styles/output.module.css';
import type { InputData } from '../../utils/dataParser';
import { formatInputString1, formatInputString2, formatInputString3 } from '../../utils/formatters/inputFormatters';
import { logError, getUserErrorMessage } from '../../utils/errorHandling';
import { InputDisplay } from '../../components/InputDisplay';
import { NumericOutput } from '../../components/NumericOutput';
import { ImageComparison } from '../../components/ImageComparison';
import { useFormData } from '../../context/FormContext';
// Components are now handled by layout.tsx

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

  // Use formatters from utils
  const getInputString1 = React.useCallback((data: InputData): string => {
    return formatInputString1(data);
  }, []);

  const getInputString2 = React.useCallback((data: InputData): string => {
    return formatInputString2(data);
  }, []);

  const getInputString3 = React.useCallback((data: InputData): string => {
    return formatInputString3(data);
  }, []);

  // Port of getimgString with Next.js public folder path and error handling
  const getImgString = React.useCallback((caseStrings: string[]): string[] => {
    // Handle undefined/null case strings
    if (!caseStrings) {
      logError('Case strings array is undefined or null', 'getImgString');
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    // Handle insufficient array length
    if (caseStrings.length < 3) {
      logError('Case strings array has insufficient length', 'getImgString', caseStrings);
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    // Validate individual case string values and ensure they're complete
    if (!caseStrings[1] || !caseStrings[2] || 
        !caseStrings[1].startsWith('case') || !caseStrings[2].startsWith('case')) {
      logError('Invalid case string values', 'getImgString', caseStrings);
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }

    try {
      // Validate case string format (should match pattern like case3-70-1-1-2-8-1-8-1-0-8)
      const casePattern = /^case\d+(?:-\d+){9,10}$/;
      if (!casePattern.test(caseStrings[1]) || !casePattern.test(caseStrings[2])) {
        logError('Case strings do not match expected pattern', 'getImgString', caseStrings);
        return ['/images/placeholder.png', '/images/placeholder.png'];
      }

      // Don't encode the paths - Next.js Image component will handle that
      const imgString0 = `/images/${caseStrings[1]}.png`;
      const imgString1 = `/images/${caseStrings[2]}.png`;
      
      return [imgString0, imgString1];
    } catch (error) {
      logError(error, 'getImgString - generating image paths');
      return ['/images/placeholder.png', '/images/placeholder.png'];
    }
  }, []);

  // Port of getDisplacement
  const getDisplacement = React.useCallback((naikuHeniSokudo: number, effection: number): number => {
    const a: number = naikuHeniSokudo;
    const b: number = effection;
    const c: number = a * (1 - (b / 100));
    // 少数1 桁にラウンド
    return Math.round(c * 10) / 10;
  }, []);

  // Port of getalertString
  const getAlertString = React.useCallback((data: InputData): string => {
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
  }, []);

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
        logError(error, 'updateOutputState');
        setError(getUserErrorMessage(error));
      }
    };

    updateOutputState();
  }, [formData]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <InputDisplay
          inputString1={outputState.inputString1}
          inputString2={outputState.inputString2}
          inputString3={outputState.inputString3}
        />

        <NumericOutput
          displacement={outputState.displacement}
          effection={outputState.effection}
        />

        <ImageComparison
          beforeImage={outputState.imgString0}
          afterImage={outputState.imgString1}
        />
        
        {outputState.alertString && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded">
            {outputState.alertString}
          </div>
        )}
      </main>
    </div>
  );
};

export default OutputPage;
