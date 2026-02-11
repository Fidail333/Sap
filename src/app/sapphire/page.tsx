import type { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';
import { sapphireData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Sapphire LED | SAP LED', 'Серии продуктов, преимущества и форма заявки Sapphire.', '/sapphire');

export default function SapphirePage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12">
      <section>
        <h1 className="text-4xl font-semibold">Sapphire LED — серии и решения</h1>
        <p className="mt-3 text-slate-600">Источник: {sapphireData.source_url}</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Преимущества</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {sapphireData.advantages.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 p-4">{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Серии</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {sapphireData.series.map((series) => (
            <article key={series.slug} className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-xl">{series.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{series.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">FAQ / Запрос</h2>
        <RequestForm initialDirection="SAPPHIRE" />
      </section>
    </main>
  );
}
