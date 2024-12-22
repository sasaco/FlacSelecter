"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex bg-gitlab-green-dark">
      <Link 
        href="/input"
        className={`px-6 py-2 font-medium ${
          pathname === '/input'
            ? 'bg-gitlab-green-light text-text-dark'
            : 'text-white hover:bg-gitlab-green-light hover:text-text-dark'
        }`}
      >
        条件の設定
      </Link>
      <Link 
        href="/output"
        className={`px-6 py-2 font-medium ${
          pathname === '/output'
            ? 'bg-gitlab-green-light text-text-dark'
            : 'text-white hover:bg-gitlab-green-light hover:text-text-dark'
        }`}
      >
        結果
      </Link>
    </nav>
  );
}
