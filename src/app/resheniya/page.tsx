import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';
import { solutionPages } from '@/lib/seo-pages';

export const metadata: Metadata = buildMetadata('Решения на LED-экранах | Sapphire LED', 'Готовые решения на LED-экранах для рекламы, билбордов, сцен, диспетчерских и ритейла.', '/resheniya');

export default function SolutionsIndexPage() {
  return (
    <main>
      <Section>
        <h1 className="text-3xl font-semibold sm:text-4xl">Решения на LED-экранах</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Подбор технических решений под отраслевые сценарии: от наружной рекламы до диспетчерских центров и ритейла.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {solutionPages.map((page) => (
            <Link key={page.slug} href={page.path} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-300/40">
              <h2 className="text-xl font-semibold">{page.h1}</h2>
              <p className="mt-2 text-sm text-slate-300">{page.description}</p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
