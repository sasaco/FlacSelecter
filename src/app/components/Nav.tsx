"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex bg-[#34C240]">
      <Link 
        href="/input"
        className={`px-6 py-2 text-sm font-medium ${
          pathname === '/input'
            ? 'bg-white text-[#34C240] rounded-t-md'
            : 'text-white hover:bg-[#3DD249]'
        }`}
      >
        条件の設定
      </Link>
      <Link 
        href="/output"
        className={`px-6 py-2 text-sm font-medium ${
          pathname === '/output'
            ? 'bg-white text-[#34C240] rounded-t-md'
            : 'text-white hover:bg-[#3DD249]'
        }`}
      >
        結果
      </Link>
    </nav>
  );
}
