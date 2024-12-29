'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import { Providers } from "./providers";

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
  return (
    <html lang="jp">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Template>
          <Providers>{children}</Providers>
        </Template>
      </body>
    </html>
  );
}
