import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="text-cyan-300">404</p>
      <h1 className="mt-3 text-5xl font-semibold">Страница не найдена</h1>
      <p className="mt-4 text-slate-300">Возможно, адрес изменился. Перейдите на главную или в каталог LED-решений.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="rounded-xl bg-cyan-400 px-5 py-3 text-slate-950">На главную</Link>
        <Link href="/catalog" className="rounded-xl border border-white/20 px-5 py-3">Каталог</Link>
      </div>
    </main>
  );
}
