import "server-only";
import { cache } from "react";
import type { QueryParams } from "next-sanity";
import { client, CONTENT_TAG } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { mapSanityImage, type SanityImageResult } from "@/sanity/map-image";
import { artworkBySlugQuery, artworksQuery, categoriesQuery, settingsQuery } from "@/sanity/queries";
import { mockArtworks, mockCategoryMeta, mockSettings } from "./mock";
import type { Artwork, Category, SiteSettings } from "./types";

type Raw<T, K extends keyof T> = Omit<T, K> & { [P in K]: unknown };

// Вебхук до localhost не доходит, поэтому в dev кэш выключен: правки из Studio видны после обновления страницы.
const REVALIDATE_SECONDS = process.env.NODE_ENV === "development" ? 0 : 3600;

function sanityFetch<T>(query: string, params: QueryParams = {}) {
  if (!client) throw new Error("Sanity client is not configured");
  return client.fetch<T>(query, params, {
    next: { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
  });
}

function mapArtwork(raw: Raw<Artwork, "images">): Artwork {
  const images = ((raw.images as SanityImageResult[] | null) ?? [])
    .map((img) => mapSanityImage(img, raw.title))
    .filter((img) => img !== undefined);
  return { ...raw, images };
}

export const getArtworks = cache(async (): Promise<Artwork[]> => {
  if (!isSanityConfigured) return mockArtworks;
  const raw = await sanityFetch<Raw<Artwork, "images">[]>(artworksQuery);
  return raw.map(mapArtwork).filter((a) => a.images.length > 0);
});

export const getArtwork = cache(async (slug: string): Promise<Artwork | null> => {
  if (!isSanityConfigured) return mockArtworks.find((a) => a.slug === slug) ?? null;
  const raw = await sanityFetch<Raw<Artwork, "images"> | null>(artworkBySlugQuery, { slug });
  return raw ? mapArtwork(raw) : null;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSanityConfigured) {
    return Object.entries(mockCategoryMeta)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([slug, meta]) => {
        const items = mockArtworks.filter((a) => a.category.slug === slug);
        return {
          slug,
          title: items[0]?.category.title ?? slug,
          description: meta.description,
          cover: items[0]?.images[0],
          count: items.length,
        };
      })
      .filter((c) => c.count > 0);
  }
  const raw = await sanityFetch<Raw<Category, "cover">[]>(categoriesQuery);
  return raw
    .map((c) => ({ ...c, cover: mapSanityImage(c.cover as SanityImageResult, c.title) }))
    .filter((c) => c.count > 0);
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSanityConfigured) return mockSettings;
  const raw = await sanityFetch<Raw<SiteSettings, "portrait" | "ogImage"> | null>(settingsQuery);
  if (!raw) return { title: "Valeri", about: [], contacts: {} };
  return {
    ...raw,
    ogImage: mapSanityImage(raw.ogImage as SanityImageResult, raw.title),
    portrait: mapSanityImage(raw.portrait as SanityImageResult, raw.title),
  };
});
