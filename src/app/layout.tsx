import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
