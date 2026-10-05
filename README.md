# Valeri — каталог авторских работ

Сайт-витрина с картинами, изделиями из шерсти и другими работами. Контентом управляют через встроенную админку Sanity Studio по адресу `/studio`. Покупка — через кнопку «Хочу эту работу»: она открывает Telegram или WhatsApp с готовым текстом сообщения.

**Стек:** Next.js 16 (App Router, статическая генерация), Sanity 6 (headless CMS + CDN изображений), Tailwind CSS 4, TypeScript.

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:3000. Пока не указан `NEXT_PUBLIC_SANITY_PROJECT_ID`, он работает на тестовых данных из [src/lib/mock.ts](src/lib/mock.ts).

## Подключение Sanity

1. Зарегистрироваться на [sanity.io](https://www.sanity.io) и создать проект в [sanity.io/manage](https://www.sanity.io/manage) с датасетом `production`.
2. Скопировать `.env.example` в `.env.local` и вписать **Project ID**.
3. В настройках проекта → **API → CORS origins** добавить `http://localhost:3000` и боевой домен, включив **Allow credentials**. Без этого Studio на `/studio` не сможет войти.
4. В **Members** пригласить художницу с ролью Editor или Administrator.
5. Открыть `/studio` и заполнить:
   - **Настройки сайта**: имя, подзаголовок, «Обо мне», контакты. Без контактов кнопка покупки не появится.
   - **Категории**, затем **Работы**.

## Деплой (Vercel)

1. Импортировать репозиторий в Vercel.
2. Задать переменные окружения из `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` — боевой адрес, например `https://valeri.art`. Можно не задавать: Vercel подставит основной адрес проекта;
   - `SANITY_REVALIDATE_SECRET` — длинная случайная строка.
3. В Sanity → **API → Webhooks** создать вебхук:
   - URL: `https://<домен>/api/revalidate`;
   - Trigger on: Create, Update, Delete;
   - Filter: `_type in ["artwork", "category", "siteSettings"]`;
   - Projection: `{_type}`;
   - Secret: то же значение, что в `SANITY_REVALIDATE_SECRET`.

После публикации в Studio страницы обновляются сразу. Если вебхук не настроен, обновление произойдёт в течение часа.

## Как устроено

| Путь | Что там |
| --- | --- |
| `src/app/(site)/` | Страницы сайта: главная, `/catalog`, `/catalog/[slug]`, `/about` |
| `src/app/studio/` | Встроенная Sanity Studio |
| `src/app/api/revalidate/` | Приёмник вебхука Sanity, сбрасывает кэш |
| `src/sanity/schemaTypes/` | Схемы контента: работа, категория, настройки |
| `src/sanity/queries.ts` | GROQ-запросы |
| `src/lib/data.ts` | Получение данных: Sanity или тестовые моки |
| `sanity.config.ts` | Конфиг Studio: русский интерфейс, структура меню |

- Картинки отдаёт CDN Sanity через кастомный loader [src/sanity/image-loader.ts](src/sanity/image-loader.ts), с ресайзом и WebP/AVIF. Кроп и точка фокуса (hotspot), выбранные в Studio, учитываются в превью.
- Фильтры каталога (`?category=…&status=available`) работают на клиенте поверх статически сгенерированной страницы.
