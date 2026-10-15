import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "SMARTPLATE", template: "%s | SMARTPLATE" },
  description: "Transparent restaurant menu nutrition and meal exploration.",
  applicationName: "SMARTPLATE",
  robots: { index: true, follow: true },
  openGraph: {
    title: "SMARTPLATE",
    description: "Transparent restaurant menu nutrition and meal exploration.",
    type: "website",
  },
};
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
