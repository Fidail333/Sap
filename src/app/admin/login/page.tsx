import Link from 'next/link';

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Вход в админку</h1>
      <p className="mt-3 text-slate-300">Введите ADMIN_TOKEN.</p>
      <form action="/api/admin/login" method="post" className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <input name="token" type="password" required placeholder="ADMIN_TOKEN" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
        {searchParams.error ? <p className="text-sm text-rose-300">Неверный токен.</p> : null}
        <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-900">Войти</button>
      </form>
      <Link href="/" className="mt-4 inline-flex text-sm text-cyan-300">← На сайт</Link>
    </main>
  );
}
