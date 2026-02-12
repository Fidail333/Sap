import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { SeoProductsBlock } from './SeoProductsBlock';
import { Section } from './ui/Section';
import { productListSchema } from '@/lib/seo';
import { pickSolutionProducts, solutionPages } from '@/lib/seo-pages';

export function SolutionPage({ slug }: { slug: string }) {
  const page = solutionPages.find((item) => item.slug === slug);
  if (!page) return null;
  const products = pickSolutionProducts(slug);

  return (
    <main>
      <JsonLd data={productListSchema(products, `Подходящие позиции для решения ${page.h1}`)} />
      <Section>
        <h1 className="text-3xl font-semibold sm:text-4xl">{page.h1}</h1>
        <div className="mt-4 space-y-4 text-slate-300">
          {page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={{ pathname: '/contacts', query: { solution: slug } }} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-900">Связаться с инженером</Link>
          <Link href="/catalog" className="rounded-xl border border-white/20 px-4 py-2 text-sm">Каталог</Link>
        </div>
      </Section>
      <Section>
        <h2 className="text-2xl font-semibold">Типовые требования</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {page.requirements.map((item) => (
            <li key={item.parameter} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-slate-300">
              <p className="text-white">{item.parameter}</p>
              <p className="mt-1">{item.value}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <h2 className="text-2xl font-semibold">Рекомендации инженера</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {page.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </Section>
      <Section>
        <h2 className="text-2xl font-semibold">Подходящие позиции</h2>
        <SeoProductsBlock items={products} />
      </Section>
    </main>
  );
}
