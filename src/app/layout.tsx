import "./globals.css";
import Navigation from "../components/Navigation";
import React from 'react';
import { InputDataProvider } from '../context/InputDataContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div id="__next">
          <Navigation />
          <InputDataProvider>
            {children}
          </InputDataProvider>
        </div>
      </body>
    </html>
  );
}
