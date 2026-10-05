import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const description = settings.tagline ?? `Авторские работы ${settings.title}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.title, template: `%s — ${settings.title}` },
    description,
    openGraph: {
      siteName: settings.title,
      locale: "ru_RU",
      type: "website",
    },
    // Просим Dark Reader не перекрашивать сайт: он осветлял затемнение под подписями на фото,
    // и белый текст пропадал. Картины лучше смотреть в родных цветах.
    other: { "darkreader-lock": "true" },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader title={settings.title} />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
