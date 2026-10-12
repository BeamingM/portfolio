import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Chakarin Limudom (จักริน ลิ้มป์อุดม) · Photographer based in Bangkok",
  description:
    "About Chakarin Limudom (จักริน ลิ้มป์อุดม), documentary and street photographer based in Bangkok. Camera: Sony α7 III.",
  openGraph: {
    title: "About — Chakarin Limudom (จักริน ลิ้มป์อุดม) · Photographer based in Bangkok",
    description:
      "About Chakarin Limudom (จักริน ลิ้มป์อุดม), documentary and street photographer based in Bangkok. Camera: Sony α7 III.",
    url: "https://chakarin.pics/about",
    images: ["https://chakarin.pics/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Chakarin Limudom (จักริน ลิ้มป์อุดม) · Photographer based in Bangkok",
    description:
      "About Chakarin Limudom (จักริน ลิ้มป์อุดม), documentary and street photographer based in Bangkok. Camera: Sony α7 III.",
    site: "@beamingmotion",
    creator: "@beamingmotion",
    images: ["https://chakarin.pics/og-image.png"],
  },
  alternates: {
    canonical: "https://chakarin.pics/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
