import type { StructureResolver } from "sanity/structure";

export const SETTINGS_ID = "siteSettings";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Сайт")
    .items([
      S.documentTypeListItem("artwork").title("Работы"),
      S.documentTypeListItem("category").title("Категории"),
      S.divider(),
      S.listItem()
        .title("Настройки сайта")
        .id(SETTINGS_ID)
        .child(S.document().schemaType("siteSettings").documentId(SETTINGS_ID).title("Настройки сайта")),
    ]);
