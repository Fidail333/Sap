'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold">Что-то пошло не так</h2>
      <p className="mt-3 text-slate-300">Попробуйте обновить страницу или повторить действие.</p>
      <button onClick={reset} className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950">Повторить</button>
    </main>
  );
}
