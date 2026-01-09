import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "メモリモジュール専門店 | 産業用・組込み用メモリ",
  description:
    "産業用・組込み用メモリモジュールの専門店。DDR4/DDR5、ECC対応、産業グレードなど幅広いラインナップ。見積・相談承ります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
