"use client";

import React from 'react';

export default function Header() {
  return (
    <header className="bg-white">
      <div className="flex justify-between items-center mx-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <svg viewBox="0 0 36 36" className="text-gitlab-green-light">
              <path d="M2 14 L18 30 L34 14 L26 6 L10 22 L2 14" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-text-dark">変状対策工設計ツール</h1>
        </div>
        <span className="text-sm text-text-dark">Ver.2.1.1</span>
      </div>
      <div className="h-0.5 bg-gitlab-green-light mt-2 w-full"></div>
    </header>
  );
}
