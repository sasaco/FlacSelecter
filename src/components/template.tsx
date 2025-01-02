'use client';

import React, { type ReactNode } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Template({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (   
    <>
      <div className="header">
        <div className="container">
          <div className="liner">
            <Image src="/images/logo.png" alt="Logo" width={200} height={50} />
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
