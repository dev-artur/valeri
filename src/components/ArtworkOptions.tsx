"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/format";
import type { Artwork, Contacts } from "@/lib/types";
import { ContactButtons } from "./ContactButtons";

// Выбранный вариант (размер и т. п.) нужен цене, кнопкам выбора и кнопке покупки, которые стоят в колонке
// в разных местах. Колонка — клиентский провайдер, а всё остальное в ней приходит с сервера через children.

type State = { artwork: Artwork; index: number; select: (i: number) => void };

const OptionsContext = createContext<State | null>(null);

function useOptions() {
  const state = useContext(OptionsContext);
  if (!state) throw new Error("Компонент должен быть внутри ArtworkOptionsColumn");
  return state;
}

export function ArtworkOptionsColumn({
  artwork,
  className,
  children,
}: {
  artwork: Artwork;
  className?: string;
  children: ReactNode;
}) {
  const [index, select] = useState(0);
  return (
    <OptionsContext.Provider value={{ artwork, index, select }}>
      <div className={className}>{children}</div>
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
