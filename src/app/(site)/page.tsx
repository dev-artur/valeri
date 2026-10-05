import Link from "next/link";
import { ArtImage } from "@/components/ArtImage";
import { ArtworkGrid } from "@/components/ArtworkCard";
import { RichText } from "@/components/RichText";
import { getArtworks, getCategories, getSettings } from "@/lib/data";
import { pluralizeWorks } from "@/lib/format";

export default async function HomePage() {
  const [artworks, categories, settings] = await Promise.all([getArtworks(), getCategories(), getSettings()]);

  const featured = artworks.filter((a) => a.featured);
  const showcase = (featured.length > 0 ? featured : artworks).slice(0, 6);
  const hero = showcase[0];

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1fr_1.1fr] md:gap-14 md:pt-16 md:pb-24">
        <div>
          <h1 className="font-serif text-6xl leading-[0.95] font-medium tracking-tight sm:text-7xl lg:text-8xl">
            {settings.title}
          </h1>
          {settings.tagline && (
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">{settings.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent"
            >
              Смотреть работы
            </Link>
            <Link
              href="/about"
              className="border border-ink/80 px-6 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
            >
              Обо мне
            </Link>
          </div>
        </div>
        {hero && (
          <Link href={`/catalog/${hero.slug}`} className="group relative block">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
              <ArtImage
                image={hero.images[0]}
                fill
                preload
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-3 text-sm text-muted">
              <span className="font-serif text-lg text-ink italic">{hero.title}</span>
              {hero.year ? `, ${hero.year}` : ""}
            </p>
          </Link>
        )}
      </section>

      {categories.length > 1 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="categories-title">
          <h2 id="categories-title" className="mb-8 font-serif text-4xl">
            Что я делаю
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/catalog?category=${category.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-paper-deep">
                    {category.cover && (
                      <ArtImage
                        image={category.cover}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 via-45% to-transparent to-75%" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-paper [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]">
                      <h3 className="font-serif text-3xl">{category.title}</h3>
                      <p className="mt-1 text-sm text-paper/85">{pluralizeWorks(category.count)}</p>
                    </div>
                  </div>
                  {category.description && <p className="mt-3 text-sm text-muted">{category.description}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showcase.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="featured-title">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="featured-title" className="font-serif text-4xl">
              Избранное
            </h2>
            <Link href="/catalog" className="text-sm underline-offset-4 hover:text-accent hover:underline">
              Весь каталог →
            </Link>
          </div>
          <ArtworkGrid artworks={showcase} />
        </section>
      )}

      {settings.about.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="about-title">
          <div className="grid items-center gap-10 border-t border-line pt-16 md:grid-cols-[0.8fr_1fr] md:gap-16">
            {settings.portrait && (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-paper-deep">
                <ArtImage image={settings.portrait} fill sizes="(min-width: 768px) 35vw, 90vw" className="object-cover" />
              </div>
            )}
            <div>
              <h2 id="about-title" className="font-serif text-4xl">
                Обо мне
              </h2>
              <RichText value={settings.about.slice(0, 1)} className="mt-5 max-w-prose text-lg leading-relaxed" />
              <Link
                href="/about"
                className="mt-6 inline-block text-sm underline-offset-4 hover:text-accent hover:underline"
              >
                Читать дальше →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
