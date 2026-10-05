import type { PortableTextBlock } from "next-sanity";
import type { ArtworkStatus } from "./status";

export type ArtImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  lqip?: string;
  /** Фокус кадра в процентах, для object-position */
  focus?: { x: number; y: number };
};

export type CategoryRef = { title: string; slug: string };

export type Category = CategoryRef & {
  description?: string;
  cover?: ArtImage;
  count: number;
};

export type Artwork = {
  id: string;
  title: string;
  slug: string;
  category: CategoryRef;
  images: ArtImage[];
  status: ArtworkStatus;
  price: number | null;
  featured: boolean;
  description: PortableTextBlock[];
  dimensions?: string;
  materials?: string;
  year?: number;
};

export type Contacts = {
  telegram?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  vk?: string | null;
  email?: string | null;
};

export type SiteSettings = {
  title: string;
  tagline?: string;
  /** Картинка для превью ссылок; без неё берётся фото работы */
  ogImage?: ArtImage;
  portrait?: ArtImage;
  about: PortableTextBlock[];
  contacts: Contacts;
};
