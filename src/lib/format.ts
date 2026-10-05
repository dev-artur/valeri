import type { Artwork } from "./types";

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null) {
  return price === null ? "Цена по запросу" : rub.format(price);
}

/** Цена для карточки: у работы с вариантами — «от» самой дешёвой. */
export function formatCardPrice(artwork: Pick<Artwork, "price" | "options">) {
  if (artwork.options?.length) return `от ${rub.format(Math.min(...artwork.options.map((o) => o.price)))}`;
  return artwork.price === null ? "" : rub.format(artwork.price);
}

const plural = new Intl.PluralRules("ru-RU");

export function pluralizeWorks(n: number) {
  const forms = { one: "работа", few: "работы", many: "работ", other: "работы" } as const;
  return `${n} ${forms[plural.select(n) as keyof typeof forms] ?? forms.other}`;
}

// На Vercel без NEXT_PUBLIC_SITE_URL берём боевой адрес проекта, который Vercel передаёт сам.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
