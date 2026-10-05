import Link from "next/link";

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "Обо мне" },
  { href: "#contacts", label: "Контакты" },
];

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="font-serif text-2xl tracking-wide sm:text-[1.7rem]">
          {title}
        </Link>
        <nav aria-label="Основное меню">
          <ul className="flex items-center gap-5 text-sm sm:gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
