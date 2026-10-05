export const STATUSES = ["available", "commission", "sold"] as const;

export type ArtworkStatus = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<ArtworkStatus, string> = {
  available: "В наличии",
  commission: "Можно заказать похожую",
  sold: "Продано",
};
