import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { SeoProductsBlock } from './SeoProductsBlock';
import { Section } from './ui/Section';
import { faqSchema, productListSchema } from '@/lib/seo';
import { ledLandings, pickProductsBySlug } from '@/lib/seo-pages';

export function SeoLandingPage({ slug }: { slug: string }) {
  const page = ledLandings.find((item) => item.slug === slug);
  if (!page) return null;

  const related = ledLandings.filter((item) => item.slug !== slug);
  const products = pickProductsBySlug(slug);

  return (
    <main>
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd data={productListSchema(products, `Подходящие позиции: ${page.h1}`)} />
      <Section>
        <h1 className="text-3xl font-semibold sm:text-4xl">{page.h1}</h1>
        <div className="mt-4 space-y-4 text-slate-300">
          {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link href={{ pathname: '/contacts', query: { from: slug } }} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-900">Связаться с инженером</Link>
          <Link href="/catalog" className="rounded-xl border border-white/20 px-4 py-2 text-sm">Смотреть каталог</Link>
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">Где применяют</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          {page.applications.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">Как выбрать</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3">Параметр</th>
                <th className="px-4 py-3">Рекомендация</th>
              </tr>
            </thead>
            <tbody>
              {page.choosing.map((row) => (
                <tr key={row.parameter} className="border-t border-white/10 text-slate-300">
                  <td className="px-4 py-3 font-medium text-white">{row.parameter}</td>
                  <td className="px-4 py-3">{row.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">Подходящие позиции</h2>
        <SeoProductsBlock items={products} />
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">Полезные разделы</h2>
        <div className="mt-4 grid gap-2 text-cyan-300 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/catalog">Каталог LED-решений</Link>
          <Link href="/contacts">Контакты и консультация</Link>
          {related.map((item) => <Link key={item.slug} href={item.path}>{item.h1}</Link>)}
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-medium">{faq.question}</summary>
              <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </main>
  );
}
