import { NextStudio } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 font-sans">
        <h1 className="font-serif text-4xl">Админка ещё не подключена</h1>
        <p className="mt-4 text-muted">
          Создайте проект на sanity.io и укажите его ID в переменной NEXT_PUBLIC_SANITY_PROJECT_ID (файл .env.local).
          Подробности — в README.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
