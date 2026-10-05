const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null) {
  return price === null ? "Цена по запросу" : rub.format(price);
}

const plural = new Intl.PluralRules("ru-RU");

export function pluralizeWorks(n: number) {
  const forms = { one: "работа", few: "работы", many: "работ", other: "работы" } as const;
  return `${n} ${forms[plural.select(n) as keyof typeof forms] ?? forms.other}`;
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
