import type { ArtImage } from "@/lib/types";

type Rect = { top: number; bottom: number; left: number; right: number };

export type SanityImageResult = {
  url: string | null;
  width: number;
  height: number;
  lqip?: string | null;
  crop?: Rect | null;
  hotspot?: { x: number; y: number } | null;
  alt?: string | null;
} | null;

/** Применяет кроп из Studio к URL и пересчитывает hotspot в координаты обрезанного кадра. */
export function mapSanityImage(img: SanityImageResult, fallbackAlt: string): ArtImage | undefined {
  if (!img?.url) return undefined;

  const crop = img.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const fw = 1 - crop.left - crop.right;
  const fh = 1 - crop.top - crop.bottom;
  const width = Math.round(img.width * fw);
  const height = Math.round(img.height * fh);

  let src = img.url;
  if (width !== img.width || height !== img.height) {
    const x = Math.round(img.width * crop.left);
    const y = Math.round(img.height * crop.top);
    src += `?rect=${x},${y},${width},${height}`;
  }

  const focus = img.hotspot
    ? {
        x: clampPercent((img.hotspot.x - crop.left) / fw),
        y: clampPercent((img.hotspot.y - crop.top) / fh),
      }
    : undefined;

  return {
    src,
    width,
    height,
    alt: img.alt || fallbackAlt,
    lqip: img.lqip ?? undefined,
    focus,
  };
}

function clampPercent(v: number) {
  return Math.round(Math.min(1, Math.max(0, v)) * 100);
}
