import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const SETTINGS_ID = "siteSettings";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Сайт")
    .items([
      orderableDocumentListDeskItem({ type: "artwork", title: "Работы", S, context }),
      orderableDocumentListDeskItem({ type: "category", title: "Категории", S, context }),
      S.divider(),
      S.listItem()
        .title("Настройки сайта")
        .id(SETTINGS_ID)
        .child(S.document().schemaType("siteSettings").documentId(SETTINGS_ID).title("Настройки сайта")),
    ]);
