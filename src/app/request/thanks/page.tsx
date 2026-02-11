import Link from 'next/link';

export default function ThanksPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold">Спасибо за заявку!</h1>
      <p className="mt-3 text-slate-600">Мы получили ваш запрос и скоро свяжемся.</p>
      <Link href="/" className="mt-8 inline-block rounded-xl bg-primary px-8 py-3 text-white">На главную</Link>
    </main>
  );
}
