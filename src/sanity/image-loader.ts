"use client";

import type { ImageLoaderProps } from "next/image";

export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://cdn.sanity.io/")) {
    return `${src}?w=${width}`;
  }
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
