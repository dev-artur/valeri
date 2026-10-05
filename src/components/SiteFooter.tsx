import { contactLinks } from "@/lib/contacts";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const links = contactLinks(settings.contacts);

  return (
    <footer id="contacts" className="mt-24 scroll-mt-20 border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-serif text-3xl sm:text-4xl">Хотите работу или заказ?</p>
          <p className="mt-3 max-w-md text-muted">
            Напишите в любой удобный мессенджер — отвечу, расскажу про доставку и пришлю дополнительные фото.
          </p>
        </div>
        {links.length > 0 && (
          <ul className="flex flex-wrap content-start gap-3 md:justify-end">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target={link.id === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-block border border-ink/80 px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} {settings.title}. Все работы авторские.
      </div>
    </footer>
  );
}
