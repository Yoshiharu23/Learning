import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Board | Web Development Learning",
  description: "架空のデータで試す、Webアプリケーション開発の学習サンプル。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
