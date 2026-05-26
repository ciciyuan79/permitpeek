import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PermitPeek | US Building Permit Lookup",
  description: "Check property building permits before you buy. Access free public records for NYC, San Francisco, Chicago, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="font-serif antialiased selection:bg-stone-900 selection:text-stone-50">
        {children}
      </body>
    </html>
  );
}
