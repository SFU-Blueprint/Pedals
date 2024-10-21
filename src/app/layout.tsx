import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inter"
});
const supply = localFont({
  src: [
    {
      path: "../public/font/PPSupplyMono-Ultralight.woff",
      weight: "200"
    },
    {
      path: "../public/font/PPSupplyMono-Regular.woff",
      weight: "400"
    },
    {
      path: "../public/font/PPSupplyMono-Medium.woff",
      weight: "500"
    },
    {
      path: "../public/font/PPSupplyMono-Bold.woff",
      weight: "700"
    }
  ],
  variable: "--font-supply"
});

export const metadata: Metadata = {
  title: "PEDALS",
  description: "Volunteer Management System"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${supply.variable}`}>
      <body>{children}</body>
    </html>
  );
}
