import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { casesData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Кейсы внедрения LED-экранов | Sapphire LED', 'Портфолио реализованных проектов: транспорт, финансы, спорт, ритейл и медиа.', '/cases');

export default function CasesPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Кейсы</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Примеры проектов с измеримым бизнес-эффектом.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">{casesData.map((item) => (
          <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-wider text-cyan-300">{item.industry}</p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
            <p className="mt-4 text-sm text-slate-400">Задача</p><p className="text-sm text-slate-300">{item.task}</p>
            <p className="mt-3 text-sm text-slate-400">Решение</p><p className="text-sm text-slate-300">{item.solution}</p>
            <p className="mt-3 text-sm text-slate-400">Результат</p><p className="text-sm text-white">{item.result}</p>
          </article>
        ))}</div>
      </Section>
    </main>
  );
}
