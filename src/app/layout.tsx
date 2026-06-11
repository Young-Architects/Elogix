import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f9ff",
};

export const metadata: Metadata = {
  title: "Expendesk — Expense Intelligence Platform for Finance Teams",
  description:
    "Track expenses, automate reimbursements, enforce policies, and gain real-time visibility into company spending — all from one powerful platform built for SMEs.",
  keywords: ["expense management", "finance", "reimbursements", "SME", "expense tracking"],
  openGraph: {
    title: "Expendesk — Expense Intelligence Platform",
    description: "Control every business expense without the spreadsheet chaos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${syne.variable}
          antialiased
          bg-black
          text-white
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}