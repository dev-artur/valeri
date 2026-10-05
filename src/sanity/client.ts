import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const CONTENT_TAG = "sanity";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
