import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toPlainText } from "next-sanity";
import { ArtworkGrid } from "@/components/ArtworkCard";
import {
  ArtworkContactButtons,
  ArtworkOptionPicker,
  ArtworkOptionsColumn,
  ArtworkPrice,
} from "@/components/ArtworkOptions";
import { Gallery } from "@/components/Gallery";
import { RichText } from "@/components/RichText";
import { getArtwork, getArtworks, getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/status";

export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtwork(slug);
  if (!artwork) return {};
  const description =
    toPlainText(artwork.description).slice(0, 160) ||
    [artwork.category.title, artwork.materials, artwork.dimensions].filter(Boolean).join(", ");
  const cover = artwork.images[0];
  return {
    title: artwork.title,
    description,
    alternates: { canonical: `/catalog/${artwork.slug}` },
    openGraph: {
      title: artwork.title,
      description,
      images: cover.src.startsWith("https://")
        ? [{ url: `${cover.src}${cover.src.includes("?") ? "&" : "?"}w=1200&h=630&fit=crop&auto=format`, alt: cover.alt }]
        : undefined,
    },
  };
}

export default async function ArtworkPage({ params }: PageProps<"/catalog/[slug]">) {
  const { slug } = await params;
  const [artwork, artworks, settings] = await Promise.all([getArtwork(slug), getArtworks(), getSettings()]);
  if (!artwork) notFound();

  const related = artworks
    .filter((a) => a.category.slug === artwork.category.slug && a.id !== artwork.id)
    .slice(0, 3);

  const details = [
    ["Размер", artwork.dimensions],
    ["Материалы", artwork.materials],
    ["Год", artwork.year?.toString()],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:pt-10">
      <nav aria-label="Навигация" className="mb-6 text-sm text-muted">
        <Link href="/catalog" className="hover:text-accent">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/catalog?category=${artwork.category.slug}`} className="hover:text-accent">
          {artwork.category.title}
        </Link>
      </nav>

      {/* minmax(0, …): иначе лента миниатюр растягивает колонку шире экрана вместо прокрутки. */}
      <article className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
        <Gallery images={artwork.images} title={artwork.title} />

        <ArtworkOptionsColumn artwork={artwork} className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{artwork.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {!(artwork.status === "sold" && artwork.price === null && !artwork.options?.length) && (
              <ArtworkPrice className={`text-2xl ${artwork.status === "sold" ? "text-sold line-through decoration-1" : ""}`} />
            )}
            <StatusBadge status={artwork.status} />
          </div>

          {artwork.status !== "sold" && <ArtworkOptionPicker />}

          {details.length > 0 && (
            <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
              {details.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-6 py-3">
                  <dt className="text-muted">{term}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <RichText value={artwork.description} className="mt-8 leading-relaxed" />

          <div className="mt-8">
            <ArtworkContactButtons contacts={settings.contacts} url={`${siteUrl}/catalog/${artwork.slug}`} />
          </div>
        </ArtworkOptionsColumn>
      </article>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-8 font-serif text-3xl sm:text-4xl">
            Ещё в разделе «{artwork.category.title}»
          </h2>
          <ArtworkGrid artworks={related} />
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: keyof typeof STATUS_LABELS }) {
  const color = {
    available: "bg-[#e3ecd9] text-[#3f5a2c]",
    custom: "bg-[#f1e4d0] text-[#7a5520]",
    commission: "bg-[#f1e4d0] text-[#7a5520]",
    sold: "bg-line text-muted",
  }[status];
  return <span className={`px-2.5 py-1 text-xs font-medium ${color}`}>{STATUS_LABELS[status]}</span>;
}
