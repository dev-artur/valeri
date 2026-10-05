// custom — делается под покупателя (портрет питомца и т. п.); commission — оригинал продан, можно заказать похожую.
export const STATUSES = ["available", "custom", "commission", "sold"] as const;

export type ArtworkStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<ArtworkStatus, string> = {
  available: "В наличии",
  custom: "На заказ",
  commission: "Можно заказать похожую",
  sold: "Продано",
};
