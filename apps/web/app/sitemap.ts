import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fileforge.example.com";
  const tools = [
    "pdf-to-word",
    "word-to-pdf",
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "jpg-to-png",
    "png-to-jpg",
    "mp4-to-mp3"
  ];

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    ...tools.map((tool) => ({
      url: `${base}/${tool}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
