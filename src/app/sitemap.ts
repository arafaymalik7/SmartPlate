import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const publicPaths = [
  "/",
  "/restaurants",
  "/recommend",
  "/compare",
  "/about",
  "/how-it-works",
  "/methodology",
  "/help",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: new URL(path, appUrl).toString(),
    lastModified: new Date("2026-10-15"),
  }));
}
