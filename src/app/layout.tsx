import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabungan Bersama | Rio & Zahra",
  description:
    "Aplikasi tabungan bersama untuk Rio dan Zahra - Track, plan, dan capai target tabungan bersama-sama",
  keywords: ["tabungan", "savings", "financial tracker", "couple savings"],
  authors: [{ name: "Rio & Zahra" }],
  openGraph: {
    title: "Tabungan Bersama | Rio & Zahra",
    description: "Track dan capai target tabungan bersama-sama",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${archivoBlack.variable} ${spaceGrotesk.variable} min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
