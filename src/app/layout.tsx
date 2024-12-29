import "./globals.css";
import Navigation from "../components/Navigation";
import React from 'react';

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
          {children}
        </div>
      </body>
    </html>
  );
}
