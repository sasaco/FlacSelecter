'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { Providers } from "./providers";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Template from './template';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
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
          <Providers>
            <Template>{children}</Template>
          </Providers>
        </div>
      </body>
    </html>
  );
}
