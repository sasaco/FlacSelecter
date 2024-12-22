import React from 'react';

interface NumericOutputProps {
  displacement: number;
  effection: number;
}

export const NumericOutput: React.FC<NumericOutputProps> = ({
  displacement,
  effection,
}) => {
  return (
    <div className="grid grid-cols-2 gap-16 mb-16">
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">対策後の予測内空変位速度</h3>
        <div className="flex items-center">
          <span className="bg-white px-6 py-3 rounded border border-gray-200 font-mono text-lg">{displacement}</span>
          <span className="ml-3 text-gray-700">mm/年</span>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">変位抑制効果</h3>
        <div className="flex items-center">
          <span className="bg-white px-6 py-3 rounded border border-gray-200 font-mono text-lg">{effection}</span>
          <span className="ml-3 text-gray-700">％</span>
        </div>
      </div>
    </div>
  );
};
