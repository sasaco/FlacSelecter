'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (   
    <>
      <div className="header">
        <div className="container">
          <div className="liner">
            <img src="/images/logo.png" alt="Logo" />
            <div className="title-and-version">
              <h1>変状対策工設計ツール</h1>
              <div>Ver.2.1.1</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container">
          <div className="page-selector">
            <nav>
              <Link href="/input-page" className={pathname === '/input-page' ? 'is-active' : ''}>条件の設定</Link>
              <Link href="/output-page" className={pathname === '/output-page' ? 'is-active' : ''}>結果</Link>
            </nav>
          </div>
        </div>
          {children}
      </div>
    </>     
  );
}
