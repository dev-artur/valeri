import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-8xl text-accent">404</p>
      <h1 className="mt-4 font-serif text-3xl">Такой страницы нет</h1>
      <p className="mt-3 text-muted">Возможно, работу уже убрали из каталога.</p>
      <Link href="/catalog" className="mt-8 bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent">
        В каталог
      </Link>
    </main>
  );
}
