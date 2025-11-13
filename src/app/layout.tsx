import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinZeit",
  description: "Tenha sua vida sob controle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-200 text-black h-full w-full overflow-x-hidden`}
      >
        <Providers>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
