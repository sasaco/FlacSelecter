"use client";

import React from 'react';

export default function Header() {
  return (
    <header className="bg-[#34C240]">
      <div className="flex justify-between items-center px-6 py-3">
        <h1 className="text-lg font-medium text-white">変状対策工設計ツール</h1>
        <span className="text-sm text-white opacity-90">Ver.2.1.1</span>
      </div>
    </header>
  );
}
