import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  groups: [
    { name: "main", title: "Главная", default: true },
    { name: "about", title: "Обо мне" },
    { name: "contacts", title: "Контакты" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Имя на сайте",
      type: "string",
      group: "main",
      initialValue: "Valeri",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Подзаголовок",
      description: "Одна строка под именем на главной",
      type: "string",
      group: "main",
    }),
    defineField({
      name: "portrait",
      title: "Фото для «Обо мне»",
      type: "image",
      group: "about",
      options: { hotspot: true },
    }),
    defineField({
      name: "about",
      title: "Текст «Обо мне»",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Обычный текст", value: "normal" }],
          lists: [],
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
      name: "telegram",
      title: "Telegram",
      description: "Имя пользователя без @",
      type: "string",
      group: "contacts",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      description: "Номер в формате 79991234567",
      type: "string",
      group: "contacts",
      validation: (rule) => rule.regex(/^\d{10,15}$/, { name: "только цифры" }),
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      description: "Имя пользователя без @",
      type: "string",
      group: "contacts",
    }),
    defineField({
      name: "vk",
      title: "ВКонтакте",
      description: "Короткое имя страницы, например valeri.art",
      type: "string",
      group: "contacts",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contacts",
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Настройки сайта" }),
  },
});
