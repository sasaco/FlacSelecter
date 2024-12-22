import React from 'react';
import Image from 'next/image';
import styles from '@/components/styles/output.module.css';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
}) => {
  return (
    <div className="grid grid-cols-2 gap-12">
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">【対策工なし】</h3>
        {beforeImage && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <Image
              src={beforeImage}
              alt="補強前の状態"
              width={350}
              height={350}
              priority
              unoptimized
              className={styles.outputImage}
            />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">【対策工あり】</h3>
        {afterImage && (
          <div className="bg-white border border-gray-300 rounded p-4">
            <Image
              src={afterImage}
              alt="補強後の状態"
              width={350}
              height={350}
              priority
              unoptimized
              className={styles.outputImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
