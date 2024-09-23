import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-inter"
});
const supply = localFont({
  src: [
    {
      path: "../../public/font/PPSupplyMono-Ultralight.woff",
      weight: "200"
    },
    {
      path: "../../public/font/PPSupplyMono-Regular.woff",
      weight: "400"
    },
    {
      path: "../../public/font/PPSupplyMono-Medium.woff",
      weight: "500"
    },
    {
      path: "../../public/font/PPSupplyMono-Bold.woff",
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
      <body>
        <NavBar
          className="fixed right-20 top-20 z-10"
          links={[
            { href: "/checkin", label: "CHECK IN" },
            { href: "/register", label: "REGISTER" },
            { href: "/manage-login", label: "MANAGE", highlight: "/manage" }
          ]}
        />
        {children}
      </body>
    </html>
  );
}
