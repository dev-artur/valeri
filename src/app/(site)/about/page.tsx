import type { Metadata } from "next";
import Link from "next/link";
import { ArtImage } from "@/components/ArtImage";
import { RichText } from "@/components/RichText";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Обо мне",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 sm:px-6 md:grid-cols-[0.9fr_1fr] md:gap-16 md:pt-16">
      {settings.portrait && (
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep md:sticky md:top-24 md:self-start">
          <ArtImage image={settings.portrait} fill preload sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
      )}
      <div>
        <h1 className="font-serif text-5xl sm:text-6xl">Обо мне</h1>
        <RichText value={settings.about} className="mt-8 max-w-prose text-lg leading-relaxed" />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/catalog" className="bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent">
            Смотреть работы
          </Link>
          <a
            href="#contacts"
            className="border border-ink/80 px-6 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            Написать мне
          </a>
        </div>
      </div>
    </div>
  );
}
