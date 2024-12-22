"use client";

import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">変状対策工設計ツール</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ver.2.1.1</div>
          </div>
        </div>
      </div>
    </header>
  );
}
