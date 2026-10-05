"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Artwork, CategoryRef } from "@/lib/types";
import { ArtworkGrid } from "./ArtworkCard";

type Props = { artworks: Artwork[]; categories: CategoryRef[] };

export function CatalogBrowser({ artworks, categories }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const onlyAvailable = searchParams.get("status") === "available";

  const filtered = artworks.filter(
    (a) => (!category || a.category.slug === category) && (!onlyAvailable || a.status === "available"),
  );

  return (
    <CatalogView
      artworks={filtered}
      categories={categories}
      activeCategory={category}
      onlyAvailable={onlyAvailable}
    />
  );
}

/** Без JS и при пререндере показываем все работы — фильтры работают как обычные ссылки. */
export function CatalogView({
  artworks,
  categories,
  activeCategory = null,
  onlyAvailable = false,
}: Props & { activeCategory?: string | null; onlyAvailable?: boolean }) {
  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterLinks categories={categories} activeCategory={activeCategory} onlyAvailable={onlyAvailable} />
      </div>
      {artworks.length > 0 ? (
        <ArtworkGrid artworks={artworks} preloadFirst={3} />
      ) : (
        <p className="py-20 text-center text-muted">
          Здесь пока пусто.{" "}
          <Link href="/catalog" className="underline underline-offset-4 hover:text-accent">
            Показать все работы
          </Link>
        </p>
      )}
    </>
  );
}

function FilterLinks({
  categories,
  activeCategory,
  onlyAvailable,
}: {
  categories: CategoryRef[];
  activeCategory: string | null;
  onlyAvailable: boolean;
}) {
  const pathname = usePathname();
  const href = (next: { category?: string | null; available?: boolean }) => {
    const params = new URLSearchParams();
    const c = next.category === undefined ? activeCategory : next.category;
    const av = next.available === undefined ? onlyAvailable : next.available;
    if (c) params.set("category", c);
    if (av) params.set("status", "available");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const chip = (active: boolean) =>
    `inline-block border px-4 py-1.5 text-sm transition-colors ${
      active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
    }`;

  return (
    <>
      <nav aria-label="Категории">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href={href({ category: null })} scroll={false} className={chip(!activeCategory)}>
              Все
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={href({ category: c.slug })}
                scroll={false}
                className={chip(activeCategory === c.slug)}
                aria-current={activeCategory === c.slug ? "page" : undefined}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href={href({ available: !onlyAvailable })}
        scroll={false}
        className="inline-flex items-center gap-2.5 text-sm"
      >
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${onlyAvailable ? "bg-accent" : "bg-line"}`}
          aria-hidden
        >
          <span
            className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-paper shadow transition-transform ${
              onlyAvailable ? "translate-x-4" : ""
            }`}
          />
        </span>
        Только в наличии
        <span className="sr-only">{onlyAvailable ? "(включено)" : "(выключено)"}</span>
      </Link>
    </>
  );
}
