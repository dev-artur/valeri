"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ArtImage as ArtImageType } from "@/lib/types";
import { ArtImage } from "./ArtImage";

export function Gallery({ images, title }: { images: ArtImageType[]; title: string }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const current = images[index];
  const many = images.length > 1;

  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [images.length]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null || !many) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      touchX.current = null;
    },
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group relative block w-full cursor-zoom-in bg-paper-deep"
        aria-label={`Открыть фото «${title}» на весь экран`}
        {...swipe}
      >
        <ArtImage
          key={current.src}
          image={current}
          preload={index === 0}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="mx-auto h-auto max-h-[80vh] w-auto object-contain"
        />
        <span className="pointer-events-none absolute right-3 bottom-3 bg-paper/90 px-2.5 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Увеличить
        </span>
      </button>

      {many && (
        <ul className="mt-2 flex gap-2 overflow-x-auto p-1" aria-label="Все фото">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Фото ${i + 1} из ${images.length}`}
                aria-current={i === index}
                className={`relative block size-20 overflow-hidden bg-paper-deep transition-opacity ${
                  i === index ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-60 hover:opacity-100"
                }`}
              >
                <ArtImage image={img} fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={title}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/80"
      >
        <div className="flex h-full flex-col" {...swipe}>
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{many ? `${index + 1} / ${images.length}` : title}</span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-2 py-1 text-2xl leading-none hover:text-paper/70"
              aria-label="Закрыть"
              autoFocus
            >
              ×
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              quality={90}
              className="object-contain p-2 sm:p-6"
            />
          </div>
          {many && (
            <div className="flex justify-center gap-4 py-4">
              <button type="button" onClick={() => go(-1)} className="px-4 py-2 text-sm hover:text-paper/70">
                ← Назад
              </button>
              <button type="button" onClick={() => go(1)} className="px-4 py-2 text-sm hover:text-paper/70">
                Вперёд →
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
