import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fileforge — Privacy-first file converter",
  description: "Convert files quickly with local-first privacy and server fallback when needed."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
