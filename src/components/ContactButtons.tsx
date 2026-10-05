import { contactLinks } from "@/lib/contacts";
import { formatPrice } from "@/lib/format";
import type { Artwork, ArtworkOption, Contacts } from "@/lib/types";

type Props = {
  artwork: Artwork;
  contacts: Contacts;
  url: string;
  /** Выбранный вариант (размер и т. п.) — попадёт в текст сообщения */
  option?: ArtworkOption;
};

export function ContactButtons({ artwork, contacts, url, option }: Props) {
  const sold = artwork.status === "sold";
  const choice = option
    ? `, ${(artwork.optionsTitle ?? "вариант").toLowerCase()} ${option.label} — ${formatPrice(option.price)}`
    : "";
  const message = sold
    ? `Здравствуйте! Увидел(а) на сайте работу «${artwork.title}» — можно заказать похожую? ${url}`
    : artwork.status === "custom"
      ? `Здравствуйте! Хочу заказать «${artwork.title}»${choice}. ${url}`
      : `Здравствуйте! Интересует работа «${artwork.title}»${choice}. ${url}`;
  const links = contactLinks(contacts, { subject: `Работа «${artwork.title}»`, text: message });
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
        {sold ? "Заказать похожую" : artwork.status === "available" ? "Хочу эту работу" : "Заказать"} — написать
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
