import React from 'react';

interface InputDisplayProps {
  inputString1: string;
  inputString2: string;
  inputString3: string;
}

export const InputDisplay: React.FC<InputDisplayProps> = ({
  inputString1,
  inputString2,
  inputString3,
}) => {
  return (
    <div className="space-y-4 bg-white rounded border border-gray-200 p-8 mb-10">
      <div className="flex">
        <span className="text-gray-700 mr-3">構造条件:</span>
        <span className="text-gray-900">{inputString1}</span>
      </div>
      <div className="flex">
        <span className="text-gray-700 mr-3">調査・計測結果:</span>
        <span className="text-gray-900">{inputString2}</span>
      </div>
      <div className="flex">
        <span className="text-gray-700 mr-3">対策工条件:</span>
        <span className="text-gray-900">{inputString3}</span>
      </div>
    </div>
  );
};
