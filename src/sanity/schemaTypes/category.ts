import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { slugify } from "../slugify";

export const category = defineType({
  name: "category",
  title: "Категория",
  type: "document",
  fields: [
    // Порядок задаётся перетаскиванием в списке «Категории».
    orderRankField({ type: "category" }),
    defineField({
      name: "title",
      title: "Название",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Адрес в ссылке",
      description: "Нажмите «Generate», чтобы создать из названия",
      type: "slug",
      options: { source: "title", slugify },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Короткое описание",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "cover",
      title: "Обложка",
      description: "Если не выбрать, возьмётся фото первой работы из категории",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "title", media: "cover" },
  },
});
