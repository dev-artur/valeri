import type { Contacts } from "./types";

export type ContactLink = {
  id: keyof Contacts;
  label: string;
  href: string;
  /** Можно ли передать заготовленный текст сообщения */
  prefill: boolean;
};

const clean = (v?: string | null) => v?.trim().replace(/^@/, "") || undefined;

/** Заготовка сообщения: в мессенджеры уходит text, в письмо — subject и text в теле. */
export type ContactPrefill = { subject: string; text: string };

export function contactLinks(contacts: Contacts, prefill?: ContactPrefill): ContactLink[] {
  const q = prefill ? `?text=${encodeURIComponent(prefill.text)}` : "";
  const links: ContactLink[] = [];

  const telegram = clean(contacts.telegram);
  if (telegram) links.push({ id: "telegram", label: "Telegram", href: `https://t.me/${telegram}${q}`, prefill: true });

  const whatsapp = contacts.whatsapp?.replace(/\D/g, "");
  if (whatsapp) links.push({ id: "whatsapp", label: "WhatsApp", href: `https://wa.me/${whatsapp}${q}`, prefill: true });

  const vk = clean(contacts.vk);
  if (vk) links.push({ id: "vk", label: "ВКонтакте", href: `https://vk.me/${vk}`, prefill: false });

  const instagram = clean(contacts.instagram);
  if (instagram) links.push({ id: "instagram", label: "Instagram", href: `https://instagram.com/${instagram}`, prefill: false });

  const email = clean(contacts.email);
  if (email) {
    const params = prefill
      ? `?subject=${encodeURIComponent(prefill.subject)}&body=${encodeURIComponent(prefill.text)}`
      : "";
    links.push({ id: "email", label: "Почта", href: `mailto:${email}${params}`, prefill: true });
  }

  return links;
}
