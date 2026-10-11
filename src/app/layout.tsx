import type { Metadata } from "next";
import { Anuphan, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "greek"],
  display: "swap",
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
  title: "CHAKARIN L. — Photographer based in Bangkok",
  description:
    "Photography by Chakarin L. (BeamingMotion), photographer based in Bangkok, Thailand.",
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
      className={`${anuphan.variable} ${inter.variable} ${jetbrainsMono.variable} ${macintoshCursive.variable}`}
    >
      <body className="antialiased bg-[#FBFBF9] dark:bg-[#0D0D0D] text-[#121212] dark:text-[#F5F5F3] font-sans">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
