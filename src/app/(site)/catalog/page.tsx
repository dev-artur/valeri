import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser, CatalogView } from "@/components/CatalogBrowser";
import { getArtworks, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Картины, изделия из шерсти и другие авторские работы",
};

export default async function CatalogPage() {
  const [artworks, categories] = await Promise.all([getArtworks(), getCategories()]);
  const categoryRefs = categories.map(({ title, slug }) => ({ title, slug }));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14">
      <h1 className="mb-8 font-serif text-5xl sm:text-6xl">Каталог</h1>
      <Suspense fallback={<CatalogView artworks={artworks} categories={categoryRefs} />}>
        <CatalogBrowser artworks={artworks} categories={categoryRefs} />
      </Suspense>
    </div>
  );
}
