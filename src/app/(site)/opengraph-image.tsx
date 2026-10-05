import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getArtworks, getSettings } from "@/lib/data";
import type { ArtImage } from "@/lib/types";
import { sanityCroppedUrl } from "@/sanity/map-image";

// Общая OG-картинка для главной, каталога и «Обо мне». У страниц работ своя — из generateMetadata.

const size = { width: 1200, height: 630 };
const IMAGE_WIDTH = 540; // правые ~45%

// Цвета из globals.css: --color-paper, --color-ink, --color-muted.
const PAPER = "#f7f3ee";
const INK = "#211c17";
const MUTED = "#6f655b";

const fontsDir = join(process.cwd(), "src/app/(site)/og-fonts");
const cormorant = await readFile(join(fontsDir, "CormorantGaramond-Medium.ttf"));
const manrope = await readFile(join(fontsDir, "Manrope-Regular.ttf"));

// alt зависит от названия и подзаголовка из Studio, поэтому не статическая константа.
export async function generateImageMetadata() {
  const settings = await getSettings();
  return [
    {
      id: "default",
      alt: settings.tagline ? `${settings.title} — ${settings.tagline}` : settings.title,
      size,
      contentType: "image/png",
    },
  ];
}

export default async function OpengraphImage() {
  const [settings, artworks] = await Promise.all([getSettings(), getArtworks()]);
  const picture =
    settings.ogImage ?? artworks.find((a) => a.featured)?.images[0] ?? artworks[0]?.images[0];
  const imageSrc = picture ? await loadImage(picture) : undefined;

  const titleSize = settings.title.length <= 10 ? 132 : settings.title.length <= 18 ? 96 : 72;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, color: INK }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 72px",
          }}
        >
          <div style={{ fontFamily: "Cormorant Garamond", fontSize: titleSize, lineHeight: 1 }}>
            {settings.title}
          </div>
          {settings.tagline && (
            <div style={{ fontFamily: "Manrope", fontSize: 34, lineHeight: 1.35, color: MUTED, marginTop: 28 }}>
              {settings.tagline}
            </div>
          )}
        </div>
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            width={IMAGE_WIDTH}
            height={size.height}
            style={{ width: IMAGE_WIDTH, height: size.height, objectFit: "cover" }}
          />
        )}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: cormorant, weight: 500, style: "normal" },
        { name: "Manrope", data: manrope, weight: 400, style: "normal" },
      ],
    },
  );
}

/** Картинка как data URI: Sanity CDN под размер колонки, моки — SVG из public. Ошибка → карточка без картинки. */
async function loadImage(image: ArtImage): Promise<string | undefined> {
  try {
    const remote = sanityCroppedUrl(image, IMAGE_WIDTH, size.height);
    if (remote) {
      const res = await fetch(remote);
      if (!res.ok) return undefined;
      return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
    }
    if (image.src.startsWith("/") && image.src.endsWith(".svg")) {
      const svg = await readFile(join(process.cwd(), "public", image.src));
      return `data:image/svg+xml;base64,${svg.toString("base64")}`;
    }
  } catch {
    // Без картинки карточка всё равно корректна: текст на всю ширину.
  }
  return undefined;
}
