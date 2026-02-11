'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-5xl font-semibold">500</h1>
      <p className="mt-3 text-slate-600">Произошла ошибка на сервере.</p>
      <button onClick={reset} className="mt-6 rounded-xl bg-primary px-6 py-3 text-white">Повторить</button>
    </main>
  );
}
