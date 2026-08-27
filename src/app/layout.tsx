import type { Metadata } from "next";
import { Noto_Sans_SC, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "西语拾页 | 西班牙语读写学习",
  description: "为中文母语学习者设计的西班牙语阅读与写作学习空间。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
