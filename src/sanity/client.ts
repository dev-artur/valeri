import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const CONTENT_TAG = "sanity";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Страницы кэширует Next. CDN Sanity обновляется с задержкой, и перестройка по вебхуку
      // успевала забрать старые данные — поэтому читаем напрямую из API.
      useCdn: false,
      perspective: "published",
    })
  : null;
