import { defineField, defineType } from "sanity";
import { slugify } from "../slugify";

export const category = defineType({
  name: "category",
  title: "Категория",
  type: "document",
  fields: [
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
      description: "Если не выбрать, возьмётся фото последней работы из категории",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Порядок",
      description: "Чем меньше число, тем выше категория в списке",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", media: "cover" },
  },
});
