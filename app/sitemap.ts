import type { MetadataRoute } from "next";

const SITE_URL = "https://resonateai2.vercel.app";

// Single-page site for now — every section is an anchor on `/`. Add
// real routes here as the product surface grows (docs, pricing detail,
// solution pages, etc.).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
