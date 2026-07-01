import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import NextAuthProvider from "@/components/NextAuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse - Spotify Discovery",
  description: "Spotify's AI-Native Discovery Feed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex flex-col h-full bg-spotify-base text-spotify-text font-sans">
        <NextAuthProvider>
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
          <BottomNav />
        </NextAuthProvider>
      </body>
    </html>
  );
}
