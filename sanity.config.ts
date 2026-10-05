"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { ruKZLocale } from "@sanity/locale-ru-kz";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { SETTINGS_ID, structure } from "./src/sanity/structure";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/studio",
  title: "Valeri",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== SETTINGS_ID),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === SETTINGS_ID
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    ruKZLocale({ title: "Русский" }),
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
