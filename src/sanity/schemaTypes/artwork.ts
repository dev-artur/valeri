import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { slugify } from "../slugify";
import { STATUS_LABELS, STATUSES } from "../../lib/status";

export const artwork = defineType({
  name: "artwork",
  title: "Работа",
  type: "document",
  groups: [
    { name: "main", title: "Основное", default: true },
    { name: "details", title: "Детали" },
  ],
  fields: [
    // Порядок задаётся перетаскиванием в списке «Работы»; новые работы встают в начало.
    orderRankField({ type: "artwork", newItemPosition: "before" }),
    defineField({
      name: "title",
      title: "Название",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Адрес в ссылке",
      description: "Нажмите «Generate», чтобы создать из названия",
      type: "slug",
      group: "main",
      options: { source: "title", slugify },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "reference",
      to: [{ type: "category" }],
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Фотографии",
      description: "Первое фото — обложка. Перетаскивайте, чтобы поменять порядок. В обложке можно выбрать главную точку кадра (иконка карандаша на фото).",
      type: "array",
      group: "main",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Что на фото",
              description: "Пара слов для поисковиков и незрячих посетителей",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).error("Добавьте хотя бы одно фото"),
    }),
    defineField({
      name: "status",
      title: "Статус",
      type: "string",
      group: "main",
      options: {
        list: STATUSES.map((value) => ({ value, title: STATUS_LABELS[value] })),
        layout: "radio",
      },
      initialValue: "available",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Цена, ₽",
      description: "Оставьте пустым — на сайте будет «Цена по запросу»",
      type: "number",
      group: "main",
      hidden: ({ document }) => hasOptions(document),
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "options",
      title: "Варианты с разной ценой",
      description:
        "Например, размеры картины на заказ. Покупатель выберет вариант на странице работы, и цена поменяется. Поле «Цена» тогда не нужно",
      type: "array",
      group: "main",
      of: [
        defineArrayMember({
          type: "object",
          name: "option",
          title: "Вариант",
          fields: [
            defineField({
              name: "label",
              title: "Вариант",
              description: "Например: 30 × 30 см",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Цена, ₽",
              type: "number",
              validation: (rule) => rule.required().min(0).integer(),
            }),
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare: ({ title, price }) => ({
              title,
              subtitle: typeof price === "number" ? `${price.toLocaleString("ru-RU")} ₽` : undefined,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "optionsTitle",
      title: "Подпись над вариантами",
      description: "Например: Размер, Количество",
      type: "string",
      group: "main",
      initialValue: "Размер",
      hidden: ({ document }) => !hasOptions(document),
    }),
    defineField({
      name: "featured",
      title: "Показывать на главной",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Обычный текст", value: "normal" }],
          lists: [{ title: "Список", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Жирный", value: "strong" },
              { title: "Курсив", value: "em" },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: "dimensions",
      title: "Размер",
      description: "Например: 40 × 50 см",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "materials",
      title: "Материалы",
      description: "Например: холст, масло",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "year",
      title: "Год",
      type: "number",
      group: "details",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
  ],
  orderings: [
    orderRankOrdering,
    { title: "Сначала новые", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      status: "status",
      media: "images.0",
    },
    prepare({ title, category, status, media }) {
      const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS];
      return {
        title,
        subtitle: [category, label].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});

function hasOptions(document?: Record<string, unknown>) {
  return Array.isArray(document?.options) && document.options.length > 0;
}
