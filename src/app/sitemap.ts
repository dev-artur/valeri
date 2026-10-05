import type { MetadataRoute } from "next";
import { getArtworks } from "@/lib/data";
import { siteUrl } from "@/lib/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await getArtworks();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...artworks.map((a) => ({
      url: `${siteUrl}/catalog/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
