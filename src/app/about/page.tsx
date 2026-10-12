import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Chakarin Limudom (จักริน ลิ้มป์อุดม) · Photographer based in Bangkok",
  description:
    "About Chakarin Limudom (จักริน ลิ้มป์อุดม), documentary and street photographer based in Bangkok. Camera: Sony α7 III. Thammasat University, Bangkok, Thailand.",
  openGraph: {
    title: "About — Chakarin Limudom (จักริน ลิ้มป์อุดม) · Photographer based in Bangkok",
    description:
      "About Chakarin Limudom (จักริน ลิ้มป์อุดม), documentary and street photographer based in Bangkok. Camera: Sony α7 III.",
    url: "https://chakarin.pics/about",
    images: ["/photos/personal-01.jpg"],
  },
  alternates: {
    canonical: "https://chakarin.pics/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
