import Link from "next/link";
import { formatCardPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/status";
import type { Artwork } from "@/lib/types";
import { ArtImage } from "./ArtImage";

export function ArtworkCard({ artwork, preload }: { artwork: Artwork; preload?: boolean }) {
  const cover = artwork.images[0];
  const sold = artwork.status === "sold";

  return (
    <Link href={`/catalog/${artwork.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
        <ArtImage
          image={cover}
          fill
          preload={preload}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-[1.03] ${sold ? "opacity-80 grayscale-[35%]" : ""}`}
        />
        {artwork.status !== "available" && (
          <span className="absolute top-3 left-3 bg-paper/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-ink uppercase backdrop-blur-sm">
            {sold ? STATUS_LABELS.sold : artwork.status === "custom" ? STATUS_LABELS.custom : "Под заказ"}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl leading-tight transition-colors group-hover:text-accent">
          {artwork.title}
        </h3>
        <p className={`shrink-0 text-sm ${sold ? "text-sold line-through decoration-1" : "text-ink"}`}>
          {formatCardPrice(artwork)}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        {[artwork.category.title, artwork.dimensions].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}

export function ArtworkGrid({ artworks, preloadFirst = 0 }: { artworks: Artwork[]; preloadFirst?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork, i) => (
        <li key={artwork.id}>
          <ArtworkCard artwork={artwork} preload={i < preloadFirst} />
        </li>
      ))}
    </ul>
  );
}
