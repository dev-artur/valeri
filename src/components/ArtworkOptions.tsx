"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { formatPrice, galleryImages } from "@/lib/format";
import type { Artwork, Contacts } from "@/lib/types";
import { ContactButtons } from "./ContactButtons";

// Выбранный вариант (размер и т. п.) нужен цене, кнопкам выбора, кнопке покупки и галерее, которые стоят
// на странице в разных местах. Карточка работы — клиентский провайдер, остальное приходит с сервера через children.

type State = {
  artwork: Artwork;
  index: number;
  select: (i: number) => void;
  /** Текущее фото галереи — общее, чтобы выбор варианта мог показать его фото */
  photo: [number, Dispatch<SetStateAction<number>>];
};

const OptionsContext = createContext<State | null>(null);

function useOptions() {
  const state = useContext(OptionsContext);
  if (!state) throw new Error("Компонент должен быть внутри ArtworkOptionsScope");
  return state;
}

/** Индекс фото для Gallery, если она внутри карточки работы; иначе null — галерея хранит его сама. */
export function useSharedPhotoIndex() {
  return useContext(OptionsContext)?.photo ?? null;
}

export function ArtworkOptionsScope({
  artwork,
  className,
  children,
}: {
  artwork: Artwork;
  className?: string;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const photo = useState(0);
  const setPhoto = photo[1];

  const select = (i: number) => {
    setIndex(i);
    const image = artwork.options?.[i]?.image;
    if (image) setPhoto(galleryImages(artwork).findIndex((img) => img.src === image.src));
  };

  return (
    <OptionsContext.Provider value={{ artwork, index, select, photo }}>
      <article className={className}>{children}</article>
    </OptionsContext.Provider>
  );
}

export function ArtworkPrice({ className }: { className?: string }) {
  const { artwork, index } = useOptions();
  const price = artwork.options?.length ? artwork.options[index].price : artwork.price;
  return <p className={className}>{formatPrice(price)}</p>;
}

export function ArtworkOptionPicker() {
  const { artwork, index, select } = useOptions();
  if (!artwork.options?.length) return null;

  return (
    <fieldset className="mt-6">
      <legend className="mb-3 text-sm text-muted">{artwork.optionsTitle}</legend>
      <div className="flex flex-wrap gap-2">
        {artwork.options.map((option, i) => (
          <label key={option.label} className="cursor-pointer">
            <input
              type="radio"
              name="artwork-option"
              value={i}
              checked={i === index}
              onChange={() => select(i)}
              className="peer sr-only"
            />
            <span className="inline-block border border-line px-4 py-2 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ArtworkContactButtons({ contacts, url }: { contacts: Contacts; url: string }) {
  const { artwork, index } = useOptions();
  return <ContactButtons artwork={artwork} contacts={contacts} url={url} option={artwork.options?.[index]} />;
}
