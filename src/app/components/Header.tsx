"use client";

import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#2B2B2B] border-b border-[#424242]">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="FlacSelecter Logo"
            width={48}
            height={48}
            className="w-12 h-12"
            priority
          />
          <h1 className="text-xl font-normal text-white tracking-wide">変状対策工設計ツール</h1>
        </div>
        <span className="text-sm text-white opacity-80">Ver.2.1.1</span>
      </div>
    </header>
  );
}
