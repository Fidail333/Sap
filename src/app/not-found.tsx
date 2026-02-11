import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-3 text-slate-600">Страница не найдена.</p>
      <Link href="/" className="mt-6 inline-block text-primary">Вернуться на главную</Link>
    </main>
  );
}
