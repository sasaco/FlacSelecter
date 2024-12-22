import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import { FormProvider } from "../context/FormContext";

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
  description: "トンネル変状対策工の設計支援ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50`}>
        <FormProvider>
          <Header />
          <Nav />
          {children}
        </FormProvider>
      </body>
    </html>
  );
}
