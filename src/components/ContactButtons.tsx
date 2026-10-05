import { contactLinks } from "@/lib/contacts";
import type { Artwork, Contacts } from "@/lib/types";

export function ContactButtons({ artwork, contacts, url }: { artwork: Artwork; contacts: Contacts; url: string }) {
  const sold = artwork.status === "sold";
  const message = sold
    ? `Здравствуйте! Увидел(а) на сайте работу «${artwork.title}» — можно заказать похожую? ${url}`
    : `Здравствуйте! Интересует работа «${artwork.title}». ${url}`;
  const links = contactLinks(contacts, message);
  if (links.length === 0) return null;

  const [primary, ...rest] = links;

  return (
    <div>
      <a
        href={primary.href}
        target={primary.id === "email" ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="block bg-ink px-6 py-3.5 text-center text-sm text-paper transition-colors hover:bg-accent"
      >
        {sold ? "Заказать похожую" : artwork.status === "commission" ? "Заказать" : "Хочу эту работу"} — написать
        в {primary.label}
      </a>
      {rest.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          Или:{" "}
          {rest.map((link, i) => (
            <span key={link.id}>
              {i > 0 && ", "}
              <a
                href={link.href}
                target={link.id === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4 hover:text-accent"
              >
                {link.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
