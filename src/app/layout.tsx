import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Waifu Stream - VTuber Launchpad",
  description: "Join the 24/7 waifu VTuber experience on Abstract. Buy tokens, tip your favorite waifu, and be part of the community!",
  keywords: ["VTuber", "Waifu", "Crypto", "Streaming", "Abstract", "Blockchain"],
  openGraph: {
    title: "Waifu Stream - VTuber Launchpad",
    description: "Join the 24/7 waifu VTuber experience on Abstract",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${ptSans.variable} antialiased relative`}>
        <div className="texture" />
        {children}
      </body>
    </html>
  );
}
