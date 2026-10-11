import type { Metadata } from "next";
import { Geist, Geist_Mono, Anuphan } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["thai", "latin"],
  display: "swap",
});

const macintoshCursive = localFont({
  src: "../fonts/MacintoshSkeletalFilled.otf",
  variable: "--font-macintosh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHAKARIN L. — Street & Documentary Photography",
  description:
    "Observational street and documentary photography by Chakarin L. (BeamingMotion), Bangkok, Thailand.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${anuphan.variable} ${macintoshCursive.variable}`}
    >
      <body className="antialiased bg-[#FBFBF9] text-[#121212] font-sans">{children}</body>
    </html>
  );
}
