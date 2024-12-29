import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Template from './template';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "変状対策工設計ツール",
  description: "変状対策工設計ツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="header">
          <div className="container">
            <div className="liner">
              <img src="/img/logo.png" alt="Logo" />
              <div className="title-and-version">
                <h1>変状対策工設計ツール</h1>
                <div>Ver.2.1.1</div>
              </div>
            </div>
          </div>
        </div>
        <Template>{children}</Template>
      </body>
    </html>
  );
}
