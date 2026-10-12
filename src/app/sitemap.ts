import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chakarin.pics";
  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-10-12"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-10-12"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
