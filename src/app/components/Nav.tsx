"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          <Link 
            href="/input"
            className={`py-4 px-2 border-b-2 ${
              pathname === '/input'
                ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
            }`}
          >
            条件の設定
          </Link>
          <Link 
            href="/output"
            className={`py-4 px-2 border-b-2 ${
              pathname === '/output'
                ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
            }`}
          >
            結果
          </Link>
        </div>
      </div>
    </nav>
  );
}
