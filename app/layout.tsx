import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grommet Admin",
  description: "Grommet inventory and order management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-slate-800 text-white p-4">
          <div className="container mx-auto flex gap-6 items-center">
            <Link href="/" className="text-xl font-bold hover:text-slate-300">
              Grommet
            </Link>
            <Link href="/alert-stock" className="hover:text-slate-300">
              alert-stock
            </Link>
            <Link href="/stock-manager" className="hover:text-slate-300">
              Stock Manager
            </Link>
            <Link href="/orders" className="hover:text-slate-300">
              Orders
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
