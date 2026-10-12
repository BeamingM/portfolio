import type { Metadata } from "next";
import { Anuphan, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
    "Photography by Chakarin L. (BeamingMotion), photographer based in Bangkok, Thailand. Thammasat University. Sony α7 III documentary, stage, and coastal photography.",
  keywords: [
    "Chakarin Limudom",
    "Chakarin L.",
    "BeamingMotion",
    "Photographer based in Bangkok",
    "Sony α7 III",
    "TU Photo",
    "Thammasat University",
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
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Person", "Photographer"],
      "@id": "https://chakarin.pics/#person",
      name: "Chakarin Limudom",
      alternateName: ["จักริน ลิ้มป์อุดม", "Chakarin L.", "BeamingMotion"],
      jobTitle: "Photographer based in Bangkok",
      url: "https://chakarin.pics",
      image: "https://chakarin.pics/photos/personal-01.jpg",
      description: "Documentary, street, and stage photographer based in Bangkok, Thailand (Sony α7 III).",
      sameAs: [
        "https://www.instagram.com/beamingmotion",
        "https://x.com/beamingmotion",
        "https://github.com/BeamingM",
      ],
      knowsAbout: ["Documentary Photography", "Street Photography", "Sony α7 III", "Photojournalism"],
    },
    {
      "@type": "WebSite",
      "@id": "https://chakarin.pics/#website",
      url: "https://chakarin.pics",
      name: "CHAKARIN L. — Photographer based in Bangkok",
      publisher: { "@id": "https://chakarin.pics/#person" },
    },
  ],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = new URLSearchParams(window.location.search);
                  if (p.get('preview') === 'true') {
                    document.documentElement.classList.add('secret-preview');
                  }
                } catch (e) {}
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
        {/* Skip to Main Content Link (WCAG 2.2 AA Bypass Blocks) */}
        <a
          href="#photos-archive"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#121212] focus:text-white dark:focus:bg-[#F5F5F3] dark:focus:text-[#121212] focus:rounded-md focus:shadow-lg focus:font-mono focus:text-xs"
        >
          Skip to photo exhibition
        </a>
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
