import type { Metadata } from "next";
import { Anuphan, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

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

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chakarin.pics"),
  title: "CHAKARIN L. — Photographer based in Bangkok",
  description:
    "Photography by Chakarin L. (BeamingMotion), photographer based in Bangkok, Thailand. Faculty of Political Science, Thammasat University (Singhdang #77). Sony α7 III documentary, stage, and coastal photography.",
  keywords: [
    "Chakarin Limudom",
    "Chakarin L.",
    "BeamingMotion",
    "Photographer based in Bangkok",
    "Sony α7 III",
    "TU Photo",
    "Thammasat University",
    "Singhdang 77",
    "chakarin.pics",
  ],
  authors: [{ name: "Chakarin Limudom", url: "https://chakarin.pics" }],
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://chakarin.pics",
    title: "CHAKARIN L. — Photographer based in Bangkok",
    description:
      "Documentary, stage, and coastal photography portfolio of Chakarin Limudom (Sony α7 III).",
    siteName: "CHAKARIN L. Portfolio",
    images: [
      {
        url: "/photos/personal-01.jpg",
        width: 1200,
        height: 800,
        alt: "CHAKARIN L. — Photographer based in Bangkok",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@beamingmotion",
    creator: "@beamingmotion",
    title: "CHAKARIN L. — Photographer based in Bangkok",
    description:
      "Documentary, stage, and coastal photography portfolio of Chakarin Limudom (Sony α7 III).",
    images: ["/photos/personal-01.jpg"],
  },
  alternates: {
    canonical: "https://chakarin.pics",
  },
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
      suppressHydrationWarning
      className={`${inter.variable} ${anuphan.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved === 'dark' || ((!saved || saved === 'system') && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#FBFBF9] dark:bg-[#0D0D0D] text-[#121212] dark:text-[#F5F5F3] font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
