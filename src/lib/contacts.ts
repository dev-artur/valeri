import type { Contacts } from "./types";

export type ContactLink = {
  id: keyof Contacts;
  label: string;
  href: string;
  /** Можно ли передать заготовленный текст сообщения */
  prefill: boolean;
};

const clean = (v?: string | null) => v?.trim().replace(/^@/, "") || undefined;

export function contactLinks(contacts: Contacts, message?: string): ContactLink[] {
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
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
    const subject = message ? `?subject=${encodeURIComponent(message)}` : "";
    links.push({ id: "email", label: "Почта", href: `mailto:${email}${subject}`, prefill: true });
  }

  return links;
}
