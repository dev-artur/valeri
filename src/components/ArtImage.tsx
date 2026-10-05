import Image from "next/image";
import type { ArtImage as ArtImageType } from "@/lib/types";

type Props = {
  image: ArtImageType;
  sizes: string;
  className?: string;
  preload?: boolean;
} & ({ fill: true } | { fill?: false });

/** Картинка из Sanity или моков: фокус кадра из hotspot, blur-заглушка из lqip. */
export function ArtImage({ image, sizes, className, preload, fill }: Props) {
  const common = {
    src: image.src,
    sizes,
    className,
    preload,
    style: image.focus ? { objectPosition: `${image.focus.x}% ${image.focus.y}%` } : undefined,
    ...(image.lqip ? { placeholder: "blur" as const, blurDataURL: image.lqip } : {}),
  };
  return fill ? (
    <Image {...common} alt={image.alt} fill />
  ) : (
    <Image {...common} alt={image.alt} width={image.width} height={image.height} />
  );
}
