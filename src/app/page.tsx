import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('SAP LED — решения и комплектующие', 'Единая витрина двух направлений: Sapphire LED и LED Modules.', '/');

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-8 rounded-3xl bg-slate-50 p-10 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Направление 1</p>
          <h1 className="mt-3 text-4xl font-semibold">Sapphire LED</h1>
          <p className="mt-3 text-slate-600">Брендовые решения для архитектурного, промышленного и уличного освещения.</p>
          <Link href="/sapphire" className="mt-6 inline-block text-primary">Перейти к разделу →</Link>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Направление 2</p>
          <h2 className="mt-3 text-4xl font-semibold">LED Modules</h2>
          <p className="mt-3 text-slate-600">Комплектующие и модули для производства и рекламных конструкций.</p>
          <Link href="/modules" className="mt-6 inline-block text-primary">Перейти к разделу →</Link>
        </div>
      </section>
      <div className="mt-10 text-center">
        <Link href="/request" className="rounded-xl bg-primary px-8 py-4 font-medium text-white">Оставить заявку</Link>
      </div>
    </main>
  );
}
